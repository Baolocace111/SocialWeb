import Post from "../post/Post";
import "./posts.scss";

import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import SharedPost from "../post/SharedPost";
import { useLanguage } from "../../context/languageContext";
const ShowPosts = ({ isLoading, error, posts, hidden }) => {
  const { trl } = useLanguage();
  const handledPosts = posts ? posts.filter((post) => post !== null) : [];

  return (
    <div className="posts">
      {error ? (
        <h1> {trl("Something went wrong!")}</h1>
      ) : isLoading && handledPosts?.length === 0 ? (
        <ThreePointLoading />
      ) : Array.isArray(handledPosts) ? (
        handledPosts
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
