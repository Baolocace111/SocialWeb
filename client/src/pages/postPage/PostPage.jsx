import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import DetailedPost from "../../components/post/detailedPost/DetailedPost";
import ThreePointLoading from "../../components/loadingComponent/threepointLoading/ThreePointLoading";

const PostPage = () => {
  const { postId } = useParams();
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts/post/" + postId).then((res) => {
      return res.data;
    })
  );
  return (
    <div>
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        <ThreePointLoading />
      ) : data.length === 0 ? (
        "not found"
      ) : (
        <div className="post-page">
          <DetailedPost post={data} />
        </div>
      )}
    </div>
  );
};
export default PostPage;
