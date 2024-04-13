import "./posts.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import ShowPosts from "./ShowPosts";

const Posts = ({ userId }) => {
  const [isLoadingMore, setisLoadingMore] = useState(false);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['posts', userId],
    ({ pageParam = 1 }) => makeRequest.get(`/posts?userId=${userId}&offset=${pageParam}`).then((res) => res.data),
    {
      getNextPageParam: (lastPage) => (lastPage && lastPage.next !== undefined && lastPage.next !== -1) ? lastPage.next + 1 : undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      onSuccess: (newData) => {
        setisLoadingMore(false);
      },
      onSettled: (data, error) => {
        if (!error) {
          // Cập nhật state hoặc thực hiện các bước khác sau khi query hoàn thành mà không có lỗi.
        } else {
          console.error("Query failed:", error);
        }
      },
    }
  );

  const handleWaypointEnter = () => {
    if (hasNextPage && !isLoadingMore) {
      setisLoadingMore(true);
      const lastPage = data?.pages[data.pages.length - 1];
      if (lastPage && lastPage.next !== undefined && lastPage.next !== -1) {
        fetchNextPage({
          pageParam: lastPage.next,
        });
      }
    }
  }

  return (
    <>
      <ShowPosts isLoading={isFetchingNextPage || isLoadingMore} error={error} posts={data ? removeDuplicateUnits(data.pages.flatMap((page) => page.data)) : []} />
      {hasNextPage && (
        <Waypoint onEnter={handleWaypointEnter} />
      )}
    </>
  );
};

export default Posts;

function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();
  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }
  return Array.from(uniqueUnits.values());
}
