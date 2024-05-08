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
const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
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
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment).catch((err) => {
        alert(err.response.data);
      });
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
    mutation.mutate({ desc, postId });
    setDesc("");
  };

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
        <input
          type="text"
          placeholder={trl("Write a comment")}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>{trl("Send")}</button>
      </div>
      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        <ThreePointLoading />
      ) : (
        data.map((comment) => (
          <Comment key={comment.id} comment={comment}></Comment>
        ))
      )}
    </div>
  );
};

export default Comments;
