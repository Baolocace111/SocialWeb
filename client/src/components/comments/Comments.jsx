import { useContext, useState } from "react";
import "./comments.scss";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
import moment from "moment";
import { useEffect } from "react";
import { useLanguage } from "../../context/languageContext";
import Comment from "./Comment";
import { faImages, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Comments = ({ postId, userId }) => {
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

  const { isLoading, error, data } = useQuery(["comments" + postId], () =>
    makeRequest.get("/comments/comment?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      if (!newComment.file) {
        return makeRequest
          .post("/comments/addComment", newComment)
          .catch((err) => {
            alert(trl(err.response.data));
          });
      } else {
        const formData = new FormData();
        formData.append("desc", newComment.desc);
        formData.append("file", newComment.file);
        formData.append("postId", postId);
        return makeRequest
          .post("/comments/addImageComment", formData)
          .catch((err) => {
            alert(trl(err.response.data));
          });
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments" + postId]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId, file });
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
            id={"file" + postId}
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
          <label htmlFor={"file" + postId}>
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
      {error ? (
        <div>{trl("Something went wrong")}</div>
      ) : isLoading ? (
        <ThreePointLoading />
      ) : Array.isArray(data) ? (
        data.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postUserID={userId}
          ></Comment>
        ))
      ) : (
        <div>{trl("Something went wrong")}</div>
      )}
    </div>
  );
};

export default Comments;
