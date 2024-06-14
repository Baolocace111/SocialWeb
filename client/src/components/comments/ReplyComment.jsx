import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useLanguage } from "../../context/languageContext";
import { useEffect } from "react";
import moment from "moment";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { URL_OF_BACK_END } from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faX } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import Comment from "./Comment";
const ReplyComments = ({ postId, userId, commentId }) => {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);
  const queryClient = useQueryClient();
  const {
    isLoading: ListCommentLoading,
    error: ListCommentError,
    data: ListCommentData,
  } = useQuery(["comments" + commentId + "in" + postId], () => {
    return makeRequest
      .get("/comments/comment?postId=" + postId + "&commentId=" + commentId)
      .then((res) => {
        return res.data;
      }); // Trả về Promise từ makeRequest.get()
  });
  const mutation = useMutation(
    (newComment) => {
      if (!newComment.file) {
        return makeRequest
          .post("/comments/addComment", newComment)
          .catch((err) => {
            console.log(err.response);
            alert(trl(err.response.data));
          });
      } else {
        const formData = new FormData();
        formData.append("desc", newComment.desc);
        formData.append("file", newComment.file);
        formData.append("postId", postId);
        formData.append("commentId", commentId);
        return makeRequest
          .post("/comments/addImageComment", formData)
          .catch((err) => {
            console.log(err.response);
            alert(trl(err.response.data));
          });
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments" + commentId + "in" + postId]);
      },
    }
  );
  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId, file, commentId });
    setDesc("");
    setFile(null);
  };
  function isImageAndVideo(file) {
    return (
      file &&
      (file["type"].split("/")[0] === "image" ||
        file["type"].split("/")[0] === "video")
    );
  }
  function isImage(file) {
    return file && file["type"].split("/")[0] === "image";
  }

  return (
    <div className="comments">
      <div className="write">
        <img
          src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/upload/errorImage.png";
          }}
          alt={""}
        />
        <div className="inputcomment">
          <input
            type="text"
            placeholder={trl("Write a comment")}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            type="file"
            id={"file" + commentId + "in" + postId}
            accept="image/*, video/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (isImageAndVideo(selectedFile)) {
                setFile(selectedFile);
              } else {
                alert(trl("Unacceptable file"));
              }
            }}
          />
          <label htmlFor={"file" + commentId + "in" + postId}>
            <div className="item">
              <FontAwesomeIcon icon={faImages} color="green" size="xl" />
              <span>
                {trl("Image")}/{trl("Video")}
              </span>
            </div>
          </label>
          <div className="file-container">
            {file && (
              <div className="preview">
                {isImage(file) ? (
                  <img
                    className="file"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/upload/errorImage.png";
                    }}
                    alt={""}
                    src={URL.createObjectURL(file)}
                  />
                ) : (
                  <video className="file" src={URL.createObjectURL(file)} />
                )}
                <button className="close-button" onClick={() => setFile(null)}>
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            )}
          </div>
        </div>
        <button onClick={handleClick}>{trl("Send")}</button>
      </div>
      {ListCommentData?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          postUserID={userId}
          replyId={commentId}
        ></Comment>
      ))}
    </div>
  );
};
export default ReplyComments;
