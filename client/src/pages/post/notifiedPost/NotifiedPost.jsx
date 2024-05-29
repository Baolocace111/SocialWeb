import "./notifiedPost.scss";
import { makeRequest } from "../../../axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Post from "../../../components/post/Post";

const NotifiedPost = () => {
   const { postId } = useParams();
   const { data: post } = useQuery(["group-post", postId], () =>
      makeRequest.get(`/posts/post/${postId}`).then((res) => res.data)
   );

   return (
      <div className="notifiedPost">
         {post && <Post post={post} />}
      </div>
   )
}

export default NotifiedPost