import Post from "../post/Post";
import "./posts.scss";

import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import SharedPost from "../post/SharedPost";
import { useLanguage } from "../../context/languageContext";
const ShowPosts = ({ isLoading, error, posts, hidden }) => {
  const { trl } = useLanguage();
  return (
    <div className="posts">
      {error ? (
        <h1> {trl("Something went wrong!")}</h1>
      ) : isLoading && posts?.lenght === 0 ? (
        <ThreePointLoading />
      ) : Array.isArray(posts) ? (
        posts
          .filter((post) => post.type !== 3)
          .map((post) => (
            <div key={post.id}>
              {post.type === 2 || post.type === 0 ? (
                <Post post={post} hidden={hidden} />
              ) : (
                <SharedPost post={post} hidden={hidden} />
              )}
            </div>
          ))
      ) : (
        <h1>{trl("No data available")}</h1>
      )}
    </div>
  );
};
export default ShowPosts;
