import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";

import "./rightBar.scss";

import { makeRequest } from "../../axios";
import NineCube from "../loadingComponent/nineCube/NineCube";
import { ChatContext } from "../navbar/ChatContext";
const RightBar = () => {
  const [users, setUsers] = useState([]);
  const [needReload, setNeedReload] = useState(true);
  const [error, setError] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const { chattingUser, setChattingUser } = useContext(ChatContext);
  const [ws, setWS] = useState(null);
  const { currentUser } = useContext(AuthContext);
  if (!ws) {
    const socket = new WebSocket(`ws://localhost:3030/index`);
    socket.onopen = () => {
      console.log("Connected");
    };
    socket.onmessage = (event) => {
      //console.log(event.data);
      if (
        event.data === "A user is offline" ||
        event.data === "A user is online"
      ) {
        setNeedReload(true);
      }
    };
    socket.onclose = () => {
      console.log("Closed");
    };
    setWS(socket);
  }
  useEffect(() => {
    makeRequest
      .get("/users/getUsers")
      .then((response) => {
        // Lọc danh sách người dùng để loại bỏ người dùng hiện tại
        const filteredUsers = response.data.filter(
          (user) => user.id !== currentUser.id
        );

        setUsers(filteredUsers); // Lưu danh sách người dùng đã lọc vào state
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [currentUser.id]);
  if (needReload && !error) {
    makeRequest
      .get("/friendship/online")
      .then((res) => {
        setFollowedUsers(res.data);
        setNeedReload(false);
      })
      .catch((error) => {
        setError(true);
      });
  }
  const handleAddChatBox = (user) => {
    //console.log(user);
    setChattingUser(removeDuplicateUnits([...chattingUser, ...[user]]));
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {users.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={`/upload/${user.profilePic}`} alt={user.name} />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button>Follow</button>
                <button>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
        <div className="item">
          <span>Online Friends</span>
          {needReload ? (
            <NineCube></NineCube>
          ) : error ? (
            "Something went wrong!!!"
          ) : (
            followedUsers.map((user) => (
              <div
                className="user"
                key={user.id}
                onClick={() => handleAddChatBox(user)}
              >
                <div className="userInfo">
                  <img src={`/upload/${user.profilePic}`} alt={user.name} />
                  <div className="online" />
                  <span>{user.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  return Array.from(uniqueUnits.values());
}
