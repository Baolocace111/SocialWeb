import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest, URL_OF_BACK_END } from "../../axios";
import moment from "moment";
import Stories from "react-insta-stories";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "moment/locale/ja";
import "moment/locale/vi";

const UserStoryPage = () => {
   const { currentUser } = useContext(AuthContext);
   const [storyGroups, setStoryGroups] = useState([]);
   const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
   const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

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
      }
   }, [allStoriesData]);

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
               // Chuyển đến story tiếp theo trong nhóm hiện tại
               return prevIndex + 1;
            } else if (!isLastGroup) {
               // Chuyển đến nhóm tiếp theo và bắt đầu từ story đầu tiên
               setCurrentGroupIndex(prevGroupIndex => prevGroupIndex + 1);
               return 0;
            }
            // Xử lý nếu đây là story cuối cùng trong nhóm cuối cùng
            // Bạn có thể đặt lại về nhóm đầu tiên hoặc xử lý theo cách khác
            return prevIndex;
         });
      } else if (direction === 'prev') {
         setCurrentStoryIndex(prevIndex => {
            const isFirstStoryInGroup = prevIndex === 0;
            const isFirstGroup = currentGroupIndex === 0;

            if (!isFirstStoryInGroup) {
               // Quay lại story trước đó trong nhóm hiện tại
               return prevIndex - 1;
            } else if (!isFirstGroup) {
               // Quay lại nhóm trước đó và chuyển đến story cuối cùng
               setCurrentGroupIndex(prevGroupIndex => {
                  // Nếu đang ở nhóm đầu tiên, trở về nhóm cuối cùng
                  const newGroupIndex = prevGroupIndex === 0 ? storyGroups.length - 1 : prevGroupIndex - 1;
                  // Chuyển đến story cuối cùng của nhóm mới
                  setCurrentStoryIndex(storyGroups[newGroupIndex].length - 1);
                  return newGroupIndex;
               });
               // Không cần cập nhật currentStoryIndex ở đây vì nó đã được cập nhật trong setCurrentGroupIndex
               return prevIndex;
            }
            // Xử lý nếu đây là story đầu tiên trong nhóm đầu tiên
            // Bạn có thể đặt lại về nhóm cuối cùng hoặc xử lý theo cách khác
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
      <div className="story-content">
         {isLoading && <FlipCube />}
         {storyGroups.length > 0 && (
            <Stories
               key={`group_${currentGroupIndex}`}
               storyContainerStyles={{ borderRadius: "10px" }}
               stories={storyGroups[currentGroupIndex]}
               height={680}
               width={380}
               defaultInterval={9000}
               keyboardNavigation={true}
               currentIndex={currentStoryIndex}
               onStoryEnd={() => handleStoryChange('next')}
               onNext={() => handleStoryChange('next')}
               onPrevious={() => handleStoryChange('prev')}
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
   );
};

export default UserStoryPage;
