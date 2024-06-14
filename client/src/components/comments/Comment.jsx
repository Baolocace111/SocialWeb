import { URL_OF_BACK_END, makeRequest } from "../../axios";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import { useContext, useEffect, useState } from "react";
import { useLanguage } from "../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import "./comment.scss";
import PopupWindow from "../PopupComponent/PopupWindow";
import { useQueryClient } from "@tanstack/react-query";
import CommentReporter from "../postPopup/reportComponent/commentReporter/CommentReporter";
import { useQuery } from "@tanstack/react-query";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { useMutation } from "@tanstack/react-query";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import Comments from "./Comments";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import ReplyComments from "./ReplyComment";
const Comment = ({ comment, postUserID, replyId }) => {
  const { currentUser } = useContext(AuthContext);
  const { trl, language } = useLanguage();
  const [isDelete, setDelete] = useState(false);
  const [commentReplyOpen, setCommentReplyOpen] = useState(false);
  const queryClient = useQueryClient();
  const [showReportPopup, setShowReportPopup] = useState(false);
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);
  const {
    isLoading: ListCommentLoading,
    error: ListCommentError,
    data: ListCommentData,
  } = useQuery(["comments" + comment.id + "in" + comment.postId], () => {
    if (replyId) {
      return Promise.resolve([]); // Trả về một Promise để đảm bảo callback luôn trả về một Promise
    } else {
      return makeRequest
        .get(
          "/comments/comment?postId=" +
            comment.postId +
            "&commentId=" +
            comment.id
        )
        .then((res) => {
          return res.data;
        }); // Trả về Promise từ makeRequest.get()
    }
  });

  const handleDeleteComment = () => {
    makeRequest
      .delete(`/comments/${comment.id}`)
      .then((res) => {
        queryClient.invalidateQueries(["comments" + comment.postId]);
      })
      .catch((e) => {
        alert(e.response.data);
      })
      .finally(() => {
        setDelete(false);
      });
  };
  const { isLoading, data } = useQuery(["likes", comment.id], () =>
    makeRequest.get("/likes?commentId=" + comment.id).then((res) => {
      return res.data;
    })
  );
  const handleReport = () => {
    setShowReportPopup(!showReportPopup);
  };

  //Use Mutation
  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?commentId=" + comment.id);
      return makeRequest.post("/likes", { commentId: comment.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  return (
    <div className="comment" key={comment.id}>
      <PopupWindow
        show={isDelete}
        handleClose={() => {
          setDelete(false);
        }}
      >
        <div className="notification-text">
          {trl("Do you want to DELETE this comment")}
        </div>
        <div className="buttonbox">
          <button className="btnyes" onClick={handleDeleteComment}>
            {trl("Yes")}
          </button>
          <button
            className="btnno"
            onClick={() => {
              setDelete(false);
            }}
          >
            {trl("No")}
          </button>
        </div>
      </PopupWindow>
      <PopupWindow show={showReportPopup} handleClose={handleReport}>
        <CommentReporter
          comment={comment}
          setShowReportPopup={setShowReportPopup}
          showReportPopup={showReportPopup}
        />
      </PopupWindow>
      <img
        src={URL_OF_BACK_END + `users/profilePic/` + comment.userId}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/upload/errorImage.png";
        }}
        alt={""}
        onClick={() => {
          window.location.href = `/profile/${comment.userId}`;
        }}
      />
      <div className="infocomment">
        <span
          onClick={() => {
            window.location.href = `/profile/${comment.userId}`;
          }}
        >
          {comment.name}{" "}
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </span>

        <p>{comment.desc}</p>
        {comment.image && (
          <img
            src={URL_OF_BACK_END + `comments/image?id=` + comment.id}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={URL_OF_BACK_END + `comments/image?id=` + comment.id}
          ></img>
        )}
      </div>

      <div className="editting">
        {currentUser.id === comment.userId || currentUser.id === postUserID ? (
          <FontAwesomeIcon
            icon={faTrash}
            onClick={() => {
              setDelete(true);
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            onClick={handleReport}
          ></FontAwesomeIcon>
        )}
      </div>
      <div className="action">
        <div className="item">
          {isLoading ? (
            trl("Loading")
          ) : data.includes(currentUser.id) ? (
            <FavoriteOutlinedIcon
              className="shake-heart"
              style={{ color: "red" }}
              onClick={handleLike}
            />
          ) : (
            <FavoriteBorderOutlinedIcon
              className="white-color-heart"
              onClick={handleLike}
            />
          )}
          {data?.length < 2
            ? trl([data?.length, " ", "Like"])
            : trl([data?.length, " ", "Likes"])}
        </div>
        {!replyId && (
          <div
            className="item"
            onClick={() => setCommentReplyOpen(!commentReplyOpen)}
          >
            <TextsmsOutlinedIcon />
            {trl("See Comments")}
          </div>
        )}
      </div>
      {commentReplyOpen && !replyId && (
        <div className="replybox">
          {ListCommentError ? (
            <div>{trl("Something went wrong")}</div>
          ) : ListCommentLoading ? (
            <ThreePointLoading />
          ) : (
            <ReplyComments
              postId={comment.postId}
              userId={postUserID}
              commentId={comment.id}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default Comment;
