import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import "./rightBar.scss";
import Chat from "../chatComponent/chat/Chat";

const RightBar = () => {
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [chattingUser, setChattingUser] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:8800/api/users/getUsers")
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

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng đã theo dõi
    const userId = currentUser.id;

    axios
      .get(`http://localhost:8800/api/users/followed-users/${userId}`)
      .then((response) => {
        setFollowedUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser.id]);
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
          {followedUsers.map((user) => (
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
          ))}
        </div>
      </div>
      {chattingUser.length === 0 ? (
        <div className="chat-boxes"></div>
      ) : (
        <div className="chat-boxes">
          {chattingUser.map((user) => (
            <div className="chat-box" key={user.id}>
              <div
                className="closeButton"
                onClick={() => handleRemoveChatBoxById(user.id)}
              >
                <span>X</span>
              </div>
              <Chat friend={user}></Chat>
            </div>
          ))}
        </div>
      )}
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
