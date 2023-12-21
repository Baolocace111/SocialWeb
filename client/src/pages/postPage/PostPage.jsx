import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

  const [sharedPost, setSharedPost] = useState(null);

  useEffect(() => {
    if (data && data.type === 1) {
      makeRequest.get("/posts/post/" + data.img).then((res) => {
        setSharedPost(res.data);
      });
    }
  }, [data]);

  const sharedPostData = {
    ...data,
    img: sharedPost ? sharedPost.img : '',
    id: sharedPost ? sharedPost.id : '',
  };

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
          {(data.type === 0 || data.type === 2) && <DetailedPost post={data} />}
          {data.type === 1 && sharedPost && <DetailedPost post={sharedPostData} />}
        </div>
      )}
    </div>
  );
};
export default PostPage;
