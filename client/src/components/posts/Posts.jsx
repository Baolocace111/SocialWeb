import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

import ShowPost from "./ShowPosts";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  return (
    <>
      <ShowPost isLoading={isLoading} error={error} posts={data}></ShowPost>
    </>
  );
};

export default Posts;
