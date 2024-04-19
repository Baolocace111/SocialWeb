import React, { useState, useCallback } from "react";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import "./ProfileInfo.scss";
import FlipCube from "../../loadingComponent/flipCube/FlipCube";
import { useLanguage } from "../../../context/languageContext";

const ProfileInfo = ({ user_id, countData, onChangeValue }) => {
  const [friends, setFriends] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trl } = useLanguage();
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

  if (loading) loadFriends();

  const handleClick = () => {
    onChangeValue(null, 2);
  };

  return (
    <div className="info-list">
      <div className="friend-container">
        <div className="title">
          <div className="friend-title">
            <span>{trl("Bạn bè")}</span>
            <div className="count">
              {countData
                ? `${countData} ${
                    trl("người bạn") + (countData > 1 ? trl("+s") : "")
                  }`
                : ""}
            </div>
          </div>
          <button className="option" onClick={handleClick}>
            {trl("Xem tất cả bạn bè")}
          </button>
        </div>
        <div className="content">
          <div className="row">
            {friends.map((friend) => (
              <div className="user" key={friend.id}>
                <img
                  src={URL_OF_BACK_END + `users/profilePic/` + friend.id}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/upload/errorImage.png";
                  }}
                  alt={""}
                />
                <span
                  className="name"
                  onClick={() => {
                    window.location.href = `/profile/${friend.id}`;
                  }}
                >
                  {friend.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {loading && <FlipCube />}
    </div>
  );
};

export default ProfileInfo;
