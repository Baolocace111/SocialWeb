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
const Comment = ({ comment, postUserID }) => {
  const { currentUser } = useContext(AuthContext);
  const { trl, language } = useLanguage();
  const [isDelete, setDelete] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);
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
  return (
    <div className="comment" key={comment.id}>
      <PopupWindow
        show={isDelete}
        handleClose={() => {
          setDelete(false);
        }}
      >
        <div>{trl("Do you want to DELETE this comment")}</div>
        <div>
          <button onClick={handleDeleteComment}>{trl("Yes")}</button>
          <button
            onClick={() => {
              setDelete(false);
            }}
          >
            {trl("No")}
          </button>
        </div>
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
          <FontAwesomeIcon icon={faTriangleExclamation}></FontAwesomeIcon>
        )}
      </div>
    </div>
  );
};
export default Comment;
