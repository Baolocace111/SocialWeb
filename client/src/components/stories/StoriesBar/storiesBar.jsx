import "./storiesBar.scss";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import moment from "moment";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import FlipCube from "../../loadingComponent/flipCube/FlipCube";
import { useLanguage } from "../../../context/languageContext";
const StoriesBar = ({ selectedUserId, onUserSelect }) => {
   const { trl, language } = useLanguage();
   useEffect(() => {
      if (language === "jp") moment.locale("ja");
      else if (language === "vn") moment.locale("vi");
      else moment.locale("en");
   }, [language]);
   const { data: stories } = useQuery(["stories"], () =>
      makeRequest.get("/stories/story").then((res) => res.data)
   );

   const [users, setUsers] = useState({});
   const [loadingUsers, setLoadingUsers] = useState(true);

   useEffect(() => {
      const fetchUser = async (userId) => {
         try {
            const response = await makeRequest.get(`users/find/${userId}`);
            const user = response.data;
            setUsers((prevUsers) => ({
               ...prevUsers,
               [userId]: user,
            }));
         } catch (error) {
            console.error("Error fetching user:", error);
         }
      };

      if (stories) {
         setLoadingUsers(true);
         const uniqueUserIds = [...new Set(stories.map((story) => story.userId))];

         const promises = uniqueUserIds.map((userId) => fetchUser(userId));

         Promise.all(promises)
            .then(() => setLoadingUsers(false))
            .catch(() => setLoadingUsers(false));
      }
   }, [stories]);

   const getLastStoryTime = (userId) => {
      const userStories = stories.filter((story) => story.userId === userId);
      if (userStories.length > 0) {
         const lastStory = userStories[userStories.length - 1];
         return moment(lastStory.createdAt).fromNow();
      }
      return "";
   };

   const getStoryCount = (userId) => {
      const userStories = stories.filter((story) => story.userId === userId);
      return userStories.length;
   };

   const uniqueUserIds =
      [...new Set(stories?.map((story) => story.userId))] || [];

   const handleClickUser = (userId) => {
      onUserSelect(userId);
   };

   return (
      <div className="storiesBar">
         <div className="menu">
            <span className="title">{trl("Tất cả tin")}</span>
            {loadingUsers && <FlipCube />}
            {uniqueUserIds.map((userId) => {
               const user = users[userId];
               const storyCount = getStoryCount(userId);
               const lastStoryTime = getLastStoryTime(userId);
               const userItemClass = userId === selectedUserId ? "user highlight" : "user";

               if (user) {
                  return (
                     <div className={userItemClass} key={userId} onClick={() => handleClickUser(userId)}>
                        <img
                           src={URL_OF_BACK_END + `users/profilePic/` + user.id}
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/upload/errorImage.png";
                           }}
                           alt={""}
                        />
                        <div className="details">
                           <span className="name">{user.name}</span>
                           <div
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: "15px",
                              }}
                           >
                              <span className="count">
                                 {storyCount}{" "}
                                 {trl("thẻ mới") + (storyCount > 1 ? trl("+s") : "")}
                              </span>
                              <span className="date">{lastStoryTime}</span>
                           </div>
                        </div>
                     </div>
                  );
               }
               return null;
            })}
         </div>
      </div>
   );
};

export default StoriesBar;
