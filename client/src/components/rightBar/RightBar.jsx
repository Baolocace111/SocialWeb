import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/authContext";
import axios from 'axios';
import "./rightBar.scss";

const RightBar = () => {

  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    axios.get('http://localhost:8800/api/users/getUsers')
      .then(response => {
        // Lọc danh sách người dùng để loại bỏ người dùng hiện tại
        const filteredUsers = response.data.filter(user => user.id !== currentUser.id);

        setUsers(filteredUsers); // Lưu danh sách người dùng đã lọc vào state
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [currentUser.id]);

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng đã theo dõi
    const userId = currentUser.id;

    axios.get(`http://localhost:8800/api/users/followed-users/${userId}`)
      .then(response => {
        setFollowedUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentUser.id]);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {users.map(user => (
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
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={`/upload/${user.profilePic}`} alt={user.name} />
                <div className="online" />
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
