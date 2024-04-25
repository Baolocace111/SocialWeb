import "./groupPosts.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import ShowGroupPosts from "./ShowGroupPosts";

const GroupPosts = ({ groupId }) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
        ['group-posts', groupId],
        ({ pageParam = 1 }) => makeRequest.get(`/posts/${groupId}/group-posts?offset=${pageParam}`).then((res) => res.data),
        {
            getNextPageParam: (lastPage) => lastPage.next !== -1 ? lastPage.next : undefined,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            onSuccess: (newData) => {
                setIsLoadingMore(false);
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
            setIsLoadingMore(true);
            fetchNextPage();
        }
    }

    return (
        <>
            <ShowGroupPosts isLoading={isFetchingNextPage || isLoadingMore} error={error} posts={data ? removeDuplicateUnits(data.pages.flatMap((page) => page.posts)) : []} />
            {hasNextPage && (
                <Waypoint onEnter={handleWaypointEnter} />
            )}
        </>
    );
};

export default GroupPosts;

function removeDuplicateUnits(arr) {
    const uniqueUnits = new Map();
    for (const unit of arr) {
        uniqueUnits.set(unit.id, unit);
    }
    return Array.from(uniqueUnits.values());
}
