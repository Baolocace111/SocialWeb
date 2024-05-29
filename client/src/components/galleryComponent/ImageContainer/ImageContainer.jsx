import "./imageContainer.scss";
import { useLanguage } from "../../../context/languageContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import ThreePointLoading from "../../loadingComponent/threepointLoading/ThreePointLoading";
import { makeRequest } from "../../../axios";
import { Waypoint } from "react-waypoint";
import { useState } from "react";
import ImagePost from "../ImagePost/ImagePost";

const ImageContainer = ({ userId }) => {
   const { trl } = useLanguage();
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const fetchImages = async ({ pageParam = 1 }) => {
      const requestBody = {
         userid: userId,
         page: pageParam,
      };
      const res = await makeRequest.post(`/posts/user/image`, requestBody);
      return res.data;
   };

   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useInfiniteQuery(
      ["user-images", userId],
      fetchImages,
      {
         getNextPageParam: (lastPage) => lastPage.next !== -1 ? lastPage.next : undefined,
         refetchOnWindowFocus: false,
      }
   );

   const handleWaypointEnter = () => {
      if (hasNextPage && !isLoadingMore) {
         setIsLoadingMore(true);
         fetchNextPage();
      }
   };

   return (
      <div className="image-container">
         <span className="title">{trl("Ảnh")}/{trl("Video")}</span>
         <ImagePost
            isLoading={isFetchingNextPage || isLoadingMore}
            images={data ? data.pages.flatMap((page) => page.posts) : []}
         />
         {hasNextPage && <Waypoint onEnter={handleWaypointEnter} />}
         {isLoadingMore && <ThreePointLoading />}
      </div>
   );
};

export default ImageContainer;