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
      (storyId) => makeRequest.delete(`/stories/story/${storyId}`), {
      onSuccess: (data, storyId) => {
         queryClient.invalidateQueries("stories");
         // Cập nhật danh sách story sau khi xóa thành công
         const updatedStoryGroups = storyGroups.map(group => group.filter(story => story.id !== storyId));
         setStoryGroups(updatedStoryGroups);
      },
   });

   useEffect(() => {
      if (allStoriesData) {
         const groups = groupStoriesByUser(allStoriesData);
         setStoryGroups(groups);

         if (userId) {
            // User đã được chọn từ StoriesBar
            const userGroupIndex = groups.findIndex(
               group => group.some(story => story.userId === userId)
            );
            if (userGroupIndex !== -1) {
               setCurrentGroupIndex(userGroupIndex);
            }
         } else {
            // Không có user được chọn, hiển thị mặc định
            setCurrentGroupIndex(0);
         }
      }
   }, [allStoriesData, userId]);

   useEffect(() => {
      setShowNextButton(storyGroups.length > 1 || (storyGroups.length === 1 && storyGroups[0].length > 1));
      setShowPrevButton(currentGroupIndex > 0 || currentStoryIndex > 0);

      // Kiểm tra xem storyGroups[currentGroupIndex] có tồn tại và có phần tử ở currentStoryIndex không
      if (storyGroups[currentGroupIndex] && storyGroups[currentGroupIndex][currentStoryIndex]) {
         const activeStory = storyGroups[currentGroupIndex][currentStoryIndex];
         onActiveUserChange(activeStory.userId);
      }
   }, [storyGroups, currentGroupIndex, currentStoryIndex, onActiveUserChange]);

   const groupStoriesByUser = (stories) => {
      const groups = {};
      stories.forEach(story => {
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
      if (direction === 'next') {
         setCurrentStoryIndex(prevIndex => {
            const isLastStoryInGroup = prevIndex === storyGroups[currentGroupIndex].length - 1;
            const isLastGroup = currentGroupIndex === storyGroups.length - 1;

            if (!isLastStoryInGroup) {
               // Có story tiếp theo trong group hiện tại
               setShowPrevButton(true);
               return prevIndex + 1;
            } else if (!isLastGroup) {
               // Chuyển đến group tiếp theo
               setCurrentGroupIndex(prevGroupIndex => prevGroupIndex + 1);
               setShowPrevButton(true); // Có thể quay lại group trước
               return 0;
            } else {
               // Đây là story cuối cùng
               setShowNextButton(false);
            }
            return prevIndex;
         });
      } else if (direction === 'prev') {
         setCurrentStoryIndex(prevIndex => {
            if (prevIndex > 0) {
               // Có story trước đó trong group hiện tại
               setShowNextButton(true);
               return prevIndex - 1;
            } else if (currentGroupIndex > 0) {
               // Chuyển đến group trước
               setCurrentGroupIndex(prevGroupIndex => prevGroupIndex - 1);
               setShowNextButton(true); // Có thể tiến đến group tiếp theo
               return storyGroups[currentGroupIndex - 1].length - 1;
            } else {
               // Đây là story đầu tiên
               setShowPrevButton(false);
            }
            return prevIndex;
         });
      }
   };

   const handleDeleteClick = async () => {
      try {
         const currentStoryId = storyGroups[currentGroupIndex][currentStoryIndex]?.id;
         if (currentStoryId) {
            await deleteStoryMutation.mutateAsync(currentStoryId);
            setCurrentStoryIndex(Math.max(0, currentStoryIndex - 1));
         }
      } catch (error) {
         console.error("Error handling delete click:", error);
      }
   };

   const isCurrentUserStory = storyGroups[currentGroupIndex]?.some(story => story.userId === currentUser.id);

   return (
      <div className="story-page">
         <button className={`nav-button prev ${!showPrevButton && 'invisible'}`} onClick={() => handleStoryChange('prev')}>
            <FontAwesomeIcon icon={faAngleLeft} />
         </button>
         <div className="story-content">
            {isLoading && <FlipCube />}
            {storyGroups.length > 0 && (
               <Stories
                  key={`group_${currentGroupIndex}`}
                  storyContainerStyles={{ borderRadius: "10px", backgroundColor: "#303338" }}
                  stories={storyGroups[currentGroupIndex]}
                  height={680}
                  width={380}
                  defaultInterval={7000}
                  keyboardNavigation={true}
                  currentIndex={currentStoryIndex}
                  onStoryEnd={() => handleStoryChange('next')}
                  onNext={() => handleStoryChange('next')}
                  onPrevious={() => handleStoryChange('prev')}
                  loop={false}
               />
            )}
            {
               isCurrentUserStory && (
                  <div className="delete-button" onClick={handleDeleteClick}>
                     <span>Delete</span>
                  </div>
               )
            }
         </div>
         <button className={`nav-button next ${!showNextButton && 'invisible'}`} onClick={() => handleStoryChange('next')}>
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
