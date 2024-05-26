import "./postPage.scss";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import DetailedPost from "../../components/post/detailedPost/DetailedPost";
import ThreePointLoading from "../../components/loadingComponent/threepointLoading/ThreePointLoading";
import { useLanguage } from "../../context/languageContext";

const PostPage = () => {
  const { trl } = useLanguage();
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
    img: sharedPost ? sharedPost.img : "",
    id: sharedPost ? sharedPost.id : "",
  };

  return (
    <div className="postPage">
      {error ? (
        <div className="textbox">{trl("Something went wrong!")}</div>
      ) : isLoading ? (
        <ThreePointLoading />
      ) : data.createAt === 0 ? (
        <div className="textbox">{trl("Not found")}</div>
      ) : (
        <div className="post-page">
          {(data.type === 0 || data.type === 2 || data.type === 3) && (
            <DetailedPost post={data} />
          )}
          {data.type === 1 && sharedPost && (
            <DetailedPost post={sharedPostData} />
          )}
        </div>
      )}
    </div>
  );
};
export default PostPage;
