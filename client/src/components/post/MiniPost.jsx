import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";

import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Description from "./desc";

const MiniPost = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  // console.log(post.id);
  const { currentUser } = useContext(AuthContext);

  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  //Use Mutation
  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  //End use Mutation

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                target="_blank"
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
        <div className="content">
          <Description text={post.desc}></Description>
          <Link to={"/seepost/" + post.id} target="_blank">
            <img src={"/upload/" + post.img} alt="" />
          </Link>
        </div>
        {!post.error &&
          <div className="info">
            <div className="item">
              {isLoading ? (
                "loading"
              ) : data.includes(currentUser.id) ? (
                <FavoriteOutlinedIcon
                  style={{ color: "red" }}
                  onClick={handleLike}
                />
              ) : (
                <FavoriteBorderOutlinedIcon onClick={handleLike} />
              )}
              {data?.length} Likes
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              See Comments
            </div>
          </div>
        }

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default MiniPost;
