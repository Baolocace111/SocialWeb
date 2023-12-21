import "./rightBar.scss";

import React, { useState, useContext } from "react";
import { WEBSOCKET_BACK_END, makeRequest } from "../../axios";
import NineCube from "../loadingComponent/nineCube/NineCube";
import { ChatContext } from "../navbar/ChatContext";
const RightBar = () => {
  const [needReload, setNeedReload] = useState(true);
  const [error, setError] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const { chattingUser, setChattingUser } = useContext(ChatContext);
  const [ws, setWS] = useState(null);

  if (!ws) {
    const socket = new WebSocket(WEBSOCKET_BACK_END + `/index`);
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
