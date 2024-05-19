import "./story.scss";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest, URL_OF_BACK_END } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Stories from "react-insta-stories";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";
import "moment/locale/ja";
import "moment/locale/vi";

const UserStoryPage = () => {
   const userId = parseInt(useLocation().pathname.split("/")[2]);
   const { currentUser } = useContext(AuthContext);

   const { data: userData, isLoading: isUserDataLoading } = useQuery(
      ["users", userId],
      async () => {
         const res = await makeRequest.get(`users/find/${userId}`);
         return res.data;
      }
   );

   const { data: storiesData, isLoading: isStoriesLoading } = useQuery(
      ["stories"],
      async () => {
         const res = await makeRequest.get("/stories/story");
         return res.data;
      }
   );

   const deleteStory = async (storyId) => {
      try {
         console.log('Deleting story with ID:', storyId);
         await makeRequest.delete(`/stories/story/${storyId}`);
      } catch (error) {
         console.error("Error deleting story:", error);
      }
   };

   const handleDeleteClick = async (storyId) => {
      console.log(stories);
      try {
         await deleteStory(storyId);
      } catch (error) {
         console.error("Error handling delete click:", error);
      }
   };

   const isCurrentUserStory = userId === currentUser.id;

   const customHeader = (story) => {
      return (
         <div className="custom-header">
            <img src={story.profileImage} alt="User" />
            <div className="header-content">
               <span>{story.heading}</span>
               <span className="subheading">{story.subheading}</span>
            </div>
         </div>
      );
   };

   if (isUserDataLoading || isStoriesLoading) {
      return <FlipCube />;
   }

   const stories = storiesData
      .filter((story) => story.userId === userId)
      .map((story) => {
         const mediaType =
            story.img.endsWith("mp4") ||
               story.img.endsWith(".avi") ||
               story.img.endsWith(".mov")
               ? "video"
               : "image";
         return {
            id: story.id,
            header: {
               heading: userData.name,
               subheading: moment(story.createdAt).fromNow(),
               profileImage: URL_OF_BACK_END + `users/profilePic/${story.userId}`,
            },
            url: URL_OF_BACK_END + `stories/image/${story.id}`,
            type: mediaType,
         };
      });


   return (
      <div className="story-content">
         <Stories
            storyContainerStyles={{ borderRadius: "10px" }}
            stories={stories}
            header={customHeader}
            height={680}
            width={380}
            defaultInterval={9000}
            loop={true}
            keyboardNavigation={true}
         />
         {isCurrentUserStory && stories.map((story, index) => (
            <div className="delete-button" key={index} onClick={() => handleDeleteClick(story.id)}>
               <span>Delete</span>
            </div>
         ))}
      </div>
   );
};

export default React.memo(UserStoryPage);
