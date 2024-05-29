import { useLanguage } from "../../../context/languageContext";
import "./imageContainer.scss";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";

const ImageContainer = ({ userid }) => {
  const { trl } = useLanguage();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["imagePostid", userid],
    ({ pageParam = 1 }) =>
      makeRequest
        .post("/posts/user/image", {
          userid,
          page: pageParam,
        })
        .then((res) => {
          console.log(res.data);
          return res.data;
        }),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        if (lastPage.posts.length === 0 || lastPage.next === -1) {
          return undefined;
        }
        return lastPage.next;
      },
    }
  );

  return (
    <div className="imageContainer">
      <div className="menu">
        <span>{trl("Gallery")}</span>
      </div>
      <div className="container">
        <div className="row">
          <div>
            {isFetching ? (
              <div>Loading...</div>
            ) : Error ? (
              <div>Error: {error}</div>
            ) : (
              data.pages.map((page, index) => (
                <div key={index}>
                  {page.posts.map((postId) => (
                    <div key={postId}>Post ID: {postId}</div>
                  ))}
                </div>
              ))
            )}
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageContainer;
