import React, { useState, useCallback } from "react";
import { makeRequest } from "../../../axios";
import "./ProfileInfo.scss";
import FlipCube from "../../loadingComponent/flipCube/FlipCube";

const ProfileInfo = ({ user_id, countData, onChangeValue }) => {
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

    if (loading) loadFriends();

    const handleClick = () => {
        onChangeValue(null, 2);
    };

    return (
        <div className="info-list">
            <div className="friend-container">
                <div className="title">
                    <div className="friend-title">
                        <span>Bạn bè</span>
                        <div className="count">{countData ? `${countData} người bạn` : ""}</div>
                    </div>
                    <button className="option" onClick={handleClick}>Xem tất cả bạn bè</button>
                </div>
                <div className="content">
                    <div className="row">
                        {friends.map((friend) => (
                            <div className="user" key={friend.id}>
                                <img src={"/upload/" + friend.profilePic} alt="" />
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
