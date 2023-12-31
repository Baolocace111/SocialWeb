import { useContext, useState } from "react";
import "./comments.scss";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments"], () =>
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
        queryClient.invalidateQueries(["comments"]);
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
        <img src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
          ? <ThreePointLoading />
          : data.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={URL_OF_BACK_END + `users/profilePic/` + comment.userId} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
