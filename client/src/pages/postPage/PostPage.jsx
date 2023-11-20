import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../../components/post/Post";
const PostPage = () => {
  const { postId } = useParams();
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/post/" + postId).then((res) => {
      return res.data;
    })
  );
  return (
    <div>
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.length === 0
        ? "not found"
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};
export default PostPage;
