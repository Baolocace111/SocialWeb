import React, { useState, useCallback } from "react";
import { makeRequest } from "../../../axios";
import "./friendList.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FlipCube from "../../loadingComponent/flipCube/FlipCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const FriendList = ({ user_id }) => {
  const [friends, setFriends] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadFriends = useCallback(async () => {
    try {
      const response = await makeRequest.post("/friendship/get_friends", {
        user_id: user_id,
        offset: offset,
      });
      //console.log(offset);
      setFriends([...friends, ...response.data]);
      if (response.data.length !== 0) setOffset(offset + 10);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [user_id, offset, friends]);

  const handleShowMore = () => {
    loadFriends();
  };
  if (loading) loadFriends();

  return (
    <div className="friend-list">
      <div className="menu">
        <span className="title">Bạn bè</span>
        <div className="input-container">
          <input type="text" placeholder="Tìm bạn..." className="input-field" />
          <span className="icon-container">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
        </div>
        <div className="find-friend">
          <span>Lời mời kết bạn</span>
          <span>Tìm bạn bè</span>
        </div>
        <button className="more">
          <MoreHorizIcon />
        </button>
      </div>

      <div className="container">
        <div className="row">
          {friends.map((friend) => (
            <div className="user" key={friend.id}>
              <img src={"/upload/" + friend.profilePic} alt="" />
              <div className="details">
                <span
                  className="name"
                  onClick={() => {
                    window.location.href = `/profile/${friend.id}`;
                  }}
                >
                  {friend.name}
                </span>
              </div>
              <div className="moreIcon">
                <MoreHorizIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading && <FlipCube />}
      {!loading && friends.length < 2 && <button onClick={handleShowMore}>Show More</button>}
    </div>
  );
};

export default FriendList;
