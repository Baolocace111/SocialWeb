import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import SharedPost from "../post/SharedPost";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        <ThreePointLoading></ThreePointLoading>
      ) : Array.isArray(data) ? (
        data.map((post) => (
          <div key={post.id}>
            {post.type === 0 ? (
              <Post post={post} />
            ) : (
              <SharedPost post={post}></SharedPost>
            )}
          </div>
        ))
      ) : (
        "No data available"
      )}
    </div>
  );
};

export default Posts;
