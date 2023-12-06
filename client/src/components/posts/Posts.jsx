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
  // <div className="posts">
  //   {error ? (
  //     "Something went wrong!"
  //   ) : isLoading ? (
  //     <ThreePointLoading></ThreePointLoading>
  //   ) : Array.isArray(data) ? (
  //     data.map((post) => (
  //       <div key={post.id}>
  //         {post.type === 0 ? (
  //           <Post post={post} />
  //         ) : (
  //           <SharedPost post={post}></SharedPost>
  //         )}
  //       </div>
  //     ))
  //   ) : (
  //     "No data available"
  //   )}
  // </div>
};

export default Posts;
