import "./friendDashboard.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useLanguage } from "../../../context/languageContext";

const FriendDashboard = () => {
  const { trl } = useLanguage();
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadFriends = useCallback(async () => {
    try {
      const response = await makeRequest.post("/friendship/get_friends", {
        user_id: currentUser.id,
        offset: offset,
      });
      setFriends([...friends, ...response.data]);
      if (response.data.length !== 0) setOffset(offset + 10);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [currentUser.id, offset, friends]);

  const handleShowMore = () => {
    loadFriends();
  };
  if (loading) loadFriends();

  return (
    <div className="friend-dashboard">
      <div className="row">
        {friends.map((friend) => (
          <div className="card-friends" key={friend.id}>
            <img
              src={URL_OF_BACK_END + `users/profilePic/` + friend.id}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt="User"
            />
            <span>{friend.name}</span>
            <button className="accept" onClick={() => window.location.href = `/profile/${friend.id}`}>
              {trl("Xem hồ sơ")}
            </button>
          </div>
        ))}
      </div>
      {loading && <NineCube />}
      {!loading && friends.length > 0 && (
        <button onClick={handleShowMore}>{trl("Show More")}</button>
      )}
    </div>
  );
};
export default FriendDashboard;


