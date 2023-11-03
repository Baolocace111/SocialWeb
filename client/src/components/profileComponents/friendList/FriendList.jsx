import React, { useState, useEffect } from "react";
import { makeRequest } from "../../../axios";
import { Link } from "react-router-dom";
const FriendList = ({ user_id }) => {
  const [friends, setFriends] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriends();
  }, [offset]);

  const loadFriends = async () => {
    try {
      const response = await makeRequest.post("/friendship/get_friends", {
        user_id: user_id,
        offset: offset,
      });
      setFriends([...friends, ...response.data]);
      setOffset(offset + 1);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  const handleShowMore = () => {
    loadFriends();
  };

  return (
    <div className="friend-list">
      <h1>Friends List</h1>
      <ul>
        {friends.map((friend) => (
          <div className="user">
            <div className="userInfo">
              <img src={"/upload/" + friend.profilePic} alt="" />
              <div className="details">
                <Link
                  to={`/profile/${friend.userId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{friend.name}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!loading && <button onClick={handleShowMore}>Show More</button>}
    </div>
  );
};
export default FriendList;
