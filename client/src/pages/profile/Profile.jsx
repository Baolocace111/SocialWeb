import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faPenToSquare,
   faUserMinus,
   faUserPlus,
   faHeartCircleCheck,
   faBan,
   faUserSlash,
   faBell,
   faBellSlash
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import FriendList from "../../components/profileComponents/friendList/FriendList";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Update from "../../components/update/Update";
import Posts from "../../components/posts/Posts";
import ProfileInfo from "../../components/profileComponents/profileInfo/ProfileInfo";
import ImageContainer from "../../components/profileComponents/gallery/ImageContainer/ImageContainer";
import ProfileIntroduction from "../../components/profileComponents/introduction/ProfileIntroduction";

import Share from "../../components/share/Share";
import { ChatContext } from "../../components/navbar/ChatContext";
import { useLanguage } from "../../context/languageContext";
import UnderContruction from "../../components/loadingComponent/UnderContruction/UnderContruction";

const useStyles = makeStyles({
   root: {
      flexGrow: 1,
   },
});

const Profile = () => {
   const [openUpdate, setOpenUpdate] = useState(false);
   const { currentUser } = useContext(AuthContext);
   const { chattingUser, setChattingUser } = useContext(ChatContext);
   const [userId] = useState(Number(useParams().userId));
   const [isActionLoading, setIsActionLoading] = useState(false);
   const { trl } = useLanguage();
   const { isLoading, data } = useQuery(["user"], () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
         return res.data;
      })
   );

   const { isLoading: rIsLoading, data: relationshipData } = useQuery(
      ["relationship"],
      () =>
         makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
            return res.data;
         })
   );

   const { isLoading: countLoading, data: countData } = useQuery(
      ["friendCount"],
      () =>
         makeRequest
            .get(`/friendship/friend/count?user_id=${userId}`)
            .then((res) => {
               return res.data;
            })
   );

   const queryClient = useQueryClient();

   const mutation = useMutation(
      (following) => {
         setIsActionLoading(true);
         if (following)
            return makeRequest.delete("/relationships?userId=" + userId);
         return makeRequest.post("/relationships", { userId });
      },
      {
         onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["relationship"]);
            setIsActionLoading(false);
         },
      }
   );

   const handleFollow = () => {
      mutation.mutate(relationshipData.includes(currentUser.id));
   };

   const handleAddChatBox = (user) => {
      setChattingUser(removeDuplicateUnits([...chattingUser, ...[user]]));
   };

   /**Action in make friend**/
   const SendRequest = async () => {
      setIsActionLoading(true);
      try {
         await makeRequest.get("/friendship/addfriend/" + userId);
         queryClient.invalidateQueries(["user"]);
      } catch (error) {
         alert(error.response?.data);
      } finally {
         setIsActionLoading(false);
      }
   };

   const CancelRequest = async () => {
      setIsActionLoading(true);
      try {
         await makeRequest.get("/friendship/cancel/" + userId);
         queryClient.invalidateQueries(["user"]);
      } catch (error) {
         alert(error.response?.data);
      } finally {
         setIsActionLoading(false);
      }
   };

   const AcceptRequest = async () => {
      setIsActionLoading(true);
      try {
         await makeRequest.get("/friendship/accept/" + userId);
         queryClient.invalidateQueries(["user"]);
      } catch (error) {
         alert(error.response?.data);
      } finally {
         setIsActionLoading(false);
      }
   };

   const DenyRequest = async () => {
      setIsActionLoading(true);
      try {
         await makeRequest.get("/friendship/deny/" + userId);
         queryClient.invalidateQueries(["user"]);
      } catch (error) {
         alert(error.response?.data);
      } finally {
         setIsActionLoading(false);
      }
   };

   const Unfriend = async () => {
      setIsActionLoading(true);
      try {
         await makeRequest.get("/friendship/unfriend/" + userId);
         queryClient.invalidateQueries(["user"]);
      } catch (error) {
         alert(error.response?.data);
      } finally {
         setIsActionLoading(false);
      }
   };
   /**End methods**/

   const classes = useStyles();
   const [value, setValue] = useState(0);
   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   return (
      <div className="profile">
         {isLoading ? (
            <FlipCube />
         ) : (
            <>
               <div className="images">
                  <img
                     src={URL_OF_BACK_END + `users/coverPic/` + data.id}
                     onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/upload/errorImage.png";
                     }}
                     alt={""}
                     className="cover"
                  />
                  <div className="profilePicContainer">
                     <img
                        src={URL_OF_BACK_END + `users/profilePic/` + data.id}
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = "/upload/errorImage.png";
                        }}
                        alt={""}
                        className="profilePic"
                     />
                  </div>
               </div>

               <div className="uInfo">
                  <div className="center">
                     <div className="uNameContainer">
                        <span className="uName">{data.name}</span>
                     </div>
                     {countLoading ? (
                        <FlipCube />
                     ) : (
                        <span className="uFriends">
                           {countData}{" "}
                           {trl("người bạn") + (countData > 1 ? trl("+s") : "")}
                        </span>
                     )}
                  </div>
                  {rIsLoading ? (
                     <FlipCube />
                  ) : userId === currentUser.id ? (
                     <button className="edit" onClick={() => setOpenUpdate(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        {trl("Chỉnh sửa trang cá nhân")}
                     </button>
                  ) : (
                     <div className="action">
                        <div className="buttonBox">
                           {data?.friendshipStatus === 0 && !isActionLoading ? (
                              <Button onClick={SendRequest}>
                                 <FontAwesomeIcon icon={faUserPlus} />
                                 <span>{trl("Thêm bạn bè")}</span>
                              </Button>
                           ) : data?.friendshipStatus === 1 && !isActionLoading ? (
                              <Button onClick={CancelRequest}>
                                 <FontAwesomeIcon icon={faUserMinus} />
                                 <span>{trl("Hủy lời mời")}</span>
                              </Button>
                           ) : data?.friendshipStatus === 2 && !isActionLoading ? (
                              <div>
                                 <Button onClick={AcceptRequest}>
                                    <FontAwesomeIcon icon={faHeartCircleCheck} />
                                    <span>{trl("Chấp nhận")}</span>
                                 </Button>
                                 <Button className="deny-friend" onClick={DenyRequest}>
                                    <FontAwesomeIcon icon={faBan} />
                                    <span>{trl("Từ chối")}</span>
                                 </Button>
                              </div>
                           ) : data?.friendshipStatus === 3 && !isActionLoading ? (
                              <Button className="delete-friend" onClick={Unfriend}>
                                 <FontAwesomeIcon icon={faUserSlash} />
                                 <span>{trl("Xóa bạn")}</span>
                              </Button>
                           ) : (
                              <Button disabled={true}>
                                 <span>{trl("Loading")}...</span>
                              </Button>
                           )}
                        </div>
                        {relationshipData.includes(currentUser.id) ? (
                           <button className="follow" onClick={handleFollow}>
                              <FontAwesomeIcon icon={faBellSlash} size="xl" />
                              <span>{trl("Unfollow")}</span>
                           </button>
                        ) : (
                           <button className="follow" onClick={handleFollow}>
                              <FontAwesomeIcon icon={faBell} size="xl" />
                              <span>{trl("Follow")}</span>
                           </button>
                        )}
                        <button className="chat" onClick={() => handleAddChatBox(data)}>
                           <FontAwesomeIcon icon={faFacebookMessenger} size="xl" />
                           <span>{trl("Chat")}</span>
                        </button>
                     </div>
                  )}
               </div>

               <div className="menu">
                  <Paper
                     style={{
                        color: "inherit",
                        backgroundColor: "inherit",
                        borderRadius: "inherit",
                     }}
                     className={classes.root}
                  >
                     <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        centered
                     >
                        <Tab
                           style={{
                              fontWeight: "700",
                              color: value === 0 ? "#f50057" : "inherit",
                           }}
                           label={trl("Bài viết")}
                        />
                        <Tab
                           style={{
                              fontWeight: "700",
                              color: value === 1 ? "#f50057" : "inherit",
                           }}
                           label={trl("Suggestion")}
                        />
                        <Tab
                           style={{
                              fontWeight: "700",
                              color: value === 2 ? "#f50057" : "inherit",
                           }}
                           label={trl("Bạn bè")}
                        />
                        <Tab
                           style={{
                              fontWeight: "700",
                              color: value === 3 ? "#f50057" : "inherit",
                           }}
                           label={trl("Image")}
                        />
                        <Tab
                           style={{
                              fontWeight: "700",
                              color: value === 4 ? "#f50057" : "inherit",
                           }}
                           label={trl("Others")}
                        />
                     </Tabs>
                  </Paper>
               </div>

               {value === 0 && (
                  <div className="profileContainer">
                     <div className="profile-post">
                        <div className="column1">
                           <ProfileInfo
                              user_id={userId}
                              countData={countData}
                              onChangeValue={handleChange}
                           />
                        </div>
                        <div className="column2">
                           <div className="sharePostsContainer">
                              {userId === currentUser.id && <Share />}
                              <Posts userId={userId} />
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               {value === 1 && (
                  <div className="profileContainer">
                     <ProfileIntroduction userId={userId} />
                  </div>
               )}
               {value === 2 && (
                  <div className="profileContainer">
                     <FriendList user_id={userId} />
                  </div>
               )}
               {value === 3 && (
                  <div className="profileContainer">
                     <ImageContainer userId={userId} />
                  </div>
               )}
               {value === 4 && (
                  <div className="profileContainer">
                     <UnderContruction />
                  </div>
               )}
            </>
         )}
         {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      </div>
   );
};

export default Profile;

function removeDuplicateUnits(arr) {
   const uniqueUnits = new Map();

   for (const unit of arr) {
      uniqueUnits.set(unit.id, unit);
   }

   return Array.from(uniqueUnits.values());
}
