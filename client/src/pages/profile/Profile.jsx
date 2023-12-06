import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import FriendList from "../../components/profileComponents/friendList/FriendList";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Chat from "../../components/chatComponent/chat/Chat";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [chattingUser, setChattingUser] = useState([]);
  const [userId] = useState(Number(useParams().userId));

  const { isLoading, data, error } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );
  if (error) window.location.href = "/error";

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
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  const handleAddChatBox = (user) => {
    setChattingUser(removeDuplicateUnits([...chattingUser, ...[user]]));
  };
  const handleRemoveChatBoxById = (userIdToRemove) => {
    // Lọc ra các user có id khác userIdToRemove
    const updatedChattingUsers = chattingUser.filter(
      (user) => user.id !== userIdToRemove
    );

    // Cập nhật state với mảng đã được lọc
    setChattingUser(updatedChattingUsers);
  };

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
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <div className="profilePicContainer">
              <img
                src={"/upload/" + data.profilePic}
                alt=""
                className="profilePic"
              />
            </div>
          </div>

          <div className="uInfo">
            <div className="center">
              <span className="uName">{data.name}</span>
              {countLoading ? (
                <FlipCube />
              ) : (
                <span className="uFriends">{countData} bạn bè</span>
              )}
            </div>
            {rIsLoading ? (
              <FlipCube />
            ) : userId === currentUser.id ? (
              <button className="edit" onClick={() => setOpenUpdate(true)}>
                <FontAwesomeIcon icon={faPenToSquare} />
                Chỉnh sửa trang cá nhân
              </button>
            ) : (
              <div className="action">
                <button className="follow" onClick={handleFollow}>
                  {relationshipData.includes(currentUser.id) ? (
                    <>
                      <FontAwesomeIcon icon={faUserMinus} />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
                <button className="chat" onClick={() => handleAddChatBox(data)}>
                  <FontAwesomeIcon icon={faFacebookMessenger} size="xl" />
                  <span>Chat</span>
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
                  label="Bài viết"
                />
                <Tab
                  style={{
                    fontWeight: "700",
                    color: value === 1 ? "#f50057" : "inherit",
                  }}
                  label="Giới thiệu"
                />
                <Tab
                  style={{
                    fontWeight: "700",
                    color: value === 2 ? "#f50057" : "inherit",
                  }}
                  label="Bạn bè"
                />
                <Tab
                  style={{
                    fontWeight: "700",
                    color: value === 3 ? "#f50057" : "inherit",
                  }}
                  label="Hình ảnh"
                />
                <Tab
                  style={{
                    fontWeight: "700",
                    color: value === 4 ? "#f50057" : "inherit",
                  }}
                  label="Xem thêm"
                />
              </Tabs>
            </Paper>
          </div>

          {value === 0 && (
            <div className="profileContainer">
              <Posts userId={userId} />
            </div>
          )}
          {value === 1 && (
            <div className="profileContainer">
              <span>Đang xây dựng</span>
            </div>
          )}
          {value === 2 && (
            <div className="profileContainer">
              <FriendList user_id={userId} />
            </div>
          )}
          {value === 3 && (
            <div className="profileContainer">
              <span>Đang xây dựng</span>
            </div>
          )}
          {value === 4 && (
            <div className="profileContainer">
              <span>Đang xây dựng</span>
            </div>
          )}
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}

      {chattingUser.length === 0 ? (
        <div className="chat-boxes"></div>
      ) : (
        <div className="chat-boxes">
          {chattingUser.map((user) => (
            <div className="chat-box" key={user.id}>
              <Chat
                friend={user}
                onRemoveChatBox={() => handleRemoveChatBoxById(user.id)}
              ></Chat>
            </div>
          ))}
        </div>
      )}
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
