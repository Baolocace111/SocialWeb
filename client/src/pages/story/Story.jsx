import "./story.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest, URL_OF_BACK_END } from "../../axios";
import moment from "moment";
import Stories from "react-insta-stories";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "moment/locale/ja";
import "moment/locale/vi";

const Story = ({ userId, onActiveUserChange }) => {
   const { currentUser } = useContext(AuthContext);
   const [storyGroups, setStoryGroups] = useState([]);
   const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
   const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
   const [showPrevButton, setShowPrevButton] = useState(false);
   const [showNextButton, setShowNextButton] = useState(true);

   const queryClient = useQueryClient();

   const { isLoading, data: allStoriesData } = useQuery(["stories"], async () => {
      const res = await makeRequest.get("/stories/story");
      return res.data;
   });

   const deleteStoryMutation = useMutation(
      (storyId) => makeRequest.delete(`/stories/story/${storyId}`),
      {
         onSuccess: (data, storyId) => {
            queryClient.invalidateQueries("stories");
            const updatedStoryGroups = storyGroups
               .map((group) => group.filter((story) => story.id !== storyId))
               .filter((group) => group.length > 0);
            setStoryGroups(updatedStoryGroups);

            // Update indices if necessary
            if (updatedStoryGroups.length <= currentGroupIndex) {
               setCurrentGroupIndex(Math.max(0, updatedStoryGroups.length - 1));
               setCurrentStoryIndex(0);
            } else if (updatedStoryGroups[currentGroupIndex].length <= currentStoryIndex) {
               setCurrentStoryIndex(Math.max(0, updatedStoryGroups[currentGroupIndex].length - 1));
            }
         },
      }
   );

   useEffect(() => {
      if (allStoriesData) {
         const groups = groupStoriesByUser(allStoriesData);
         setStoryGroups(groups);

         if (userId) {
            const userGroupIndex = groups.findIndex((group) =>
               group.some((story) => story.userId === userId)
            );
            if (userGroupIndex !== -1) {
               setCurrentGroupIndex(userGroupIndex);
            }
         } else {
            setCurrentGroupIndex(0);
         }
      }
   }, [allStoriesData, userId]);

   useEffect(() => {
      setShowNextButton(
         storyGroups.length > 1 || (storyGroups.length === 1 && storyGroups[0].length > 1)
      );
      setShowPrevButton(currentGroupIndex > 0 || currentStoryIndex > 0);

      if (storyGroups[currentGroupIndex] && storyGroups[currentGroupIndex][currentStoryIndex]) {
         const activeStory = storyGroups[currentGroupIndex][currentStoryIndex];
         onActiveUserChange(activeStory.userId);
      }
   }, [storyGroups, currentGroupIndex, currentStoryIndex, onActiveUserChange]);

   const groupStoriesByUser = (stories) => {
      const groups = {};
      stories.forEach((story) => {
         if (!groups[story.userId]) {
            groups[story.userId] = [];
         }
         groups[story.userId].push({
            id: story.id,
            userId: story.userId,
            header: {
               heading: story.name,
               subheading: moment(story.createdAt).fromNow(),
               profileImage: URL_OF_BACK_END + `users/profilePic/${story.userId}`,
            },
            url: URL_OF_BACK_END + `stories/image/${story.id}`,
            type: story.img.endsWith("mp4") || story.img.endsWith(".avi") || story.img.endsWith(".mov") ? "video" : "image",
         });
      });
      return Object.values(groups);
   };

   const handleStoryChange = (direction) => {
      if (direction === "next") {
         setCurrentStoryIndex((prevIndex) => {
            const isLastStoryInGroup = prevIndex === storyGroups[currentGroupIndex].length - 1;
            const isLastGroup = currentGroupIndex === storyGroups.length - 1;

            if (!isLastStoryInGroup) {
               setShowPrevButton(true);
               return prevIndex + 1;
            } else if (!isLastGroup) {
               setCurrentGroupIndex((prevGroupIndex) => prevGroupIndex + 1);
               setShowPrevButton(true);
               return 0;
            } else {
               setShowNextButton(false);
            }
            return prevIndex;
         });
      } else if (direction === "prev") {
         setCurrentStoryIndex((prevIndex) => {
            if (prevIndex > 0) {
               setShowNextButton(true);
               return prevIndex - 1;
            } else if (currentGroupIndex > 0) {
               setCurrentGroupIndex((prevGroupIndex) => prevGroupIndex - 1);
               setShowNextButton(true);
               return storyGroups[currentGroupIndex - 1].length - 1;
            } else {
               setShowPrevButton(false);
            }
            return prevIndex;
         });
      }
   };

   const handleDeleteClick = async () => {
      try {
         const currentStoryId = storyGroups[currentGroupIndex]?.[currentStoryIndex]?.id;
         if (currentStoryId) {
            await deleteStoryMutation.mutateAsync(currentStoryId);
            setCurrentStoryIndex(Math.max(0, currentStoryIndex - 1));
         }
      } catch (error) {
         console.error("Error handling delete click:", error);
      }
   };

   const isCurrentUserStory = storyGroups[currentGroupIndex]?.some((story) => story.userId === currentUser.id);

   return (
      <div className="story-page">
         <button
            className={`nav-button prev ${!showPrevButton && "invisible"}`}
            onClick={() => handleStoryChange("prev")}
         >
            <FontAwesomeIcon icon={faAngleLeft} />
         </button>
         <div className="story-content">
            {isLoading && <FlipCube />}
            {storyGroups.length > 0 && storyGroups[currentGroupIndex]?.length > 0 && (
               <Stories
                  key={`group_${currentGroupIndex}`}
                  storyContainerStyles={{ borderRadius: "10px", backgroundColor: "#303338" }}
                  stories={storyGroups[currentGroupIndex]}
                  height={680}
                  width={380}
                  defaultInterval={7000}
                  keyboardNavigation={true}
                  currentIndex={currentStoryIndex}
                  onStoryEnd={() => handleStoryChange("next")}
                  onNext={() => handleStoryChange("next")}
                  onPrevious={() => handleStoryChange("prev")}
                  loop={false}
               />
            )}
            {isCurrentUserStory && (
               <div className="delete-button" onClick={handleDeleteClick}>
                  <span>Delete</span>
               </div>
            )}
         </div>
         <button
            className={`nav-button next ${!showNextButton && "invisible"}`}
            onClick={() => handleStoryChange("next")}
         >
            <FontAwesomeIcon icon={faAngleRight} />
         </button>
         <Link to="/">
            <button className="close-button">
               <FontAwesomeIcon icon={faX} />
            </button>
         </Link>
      </div>
   );
};

export default Story;
