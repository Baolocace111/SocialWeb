import Post from "../post/Post";
import "./posts.scss";

import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import SharedPost from "../post/SharedPost";
const ShowPosts = ({ isLoading, error, posts }) => {
  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        <ThreePointLoading />
      ) : Array.isArray(posts) ? (
        posts
          .filter((post) => post.type !== 3)
          .map((post) => (
            <div key={post.id}>
              {post.type === 2 || post.type === 0 ? (
                <Post post={post} />
              ) : (
                <SharedPost post={post} />
              )}
            </div>
          ))
      ) : (
        "No data available"
      )}
    </div>
  );
};
export default ShowPosts;