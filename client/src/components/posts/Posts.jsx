import "./posts.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import ShowPosts from "./ShowPosts";

const Posts = ({ userId }) => {
   const [isLoadingMore, setisLoadingMore] = useState(false);

   const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useInfiniteQuery(
         ["posts", userId],
         ({ pageParam = 1 }) =>
            makeRequest
               .get(`/posts?userId=${userId}&offset=${pageParam}`)
               .then((res) => res.data),
         {
            getNextPageParam: (lastPage) => {
               if (lastPage.data.length === 0 || lastPage.next === -1) {
                  return undefined;
               }
               return lastPage.next;
            },
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            onSuccess: (newData) => {
               setisLoadingMore(false);
            },
            onSettled: (data, error) => {
               if (error) {
                  console.error("Query failed:", error);
               }
            },
         }
      );

   const handleWaypointEnter = () => {
      if (hasNextPage && !isLoadingMore) {
         setisLoadingMore(true);
         fetchNextPage();
      }
   };

   return (
      <div>
         <ShowPosts
            isLoading={isFetchingNextPage || isLoadingMore}
            error={error}
            posts={
               data
                  ? removeDuplicateUnits(data.pages.flatMap((page) => page.data))
                  : []
            }
         />
         {hasNextPage && <Waypoint onEnter={handleWaypointEnter} />}
      </div>
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
