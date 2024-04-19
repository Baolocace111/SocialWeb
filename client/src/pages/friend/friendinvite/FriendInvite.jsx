import "./friendInvite.scss";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useState, useCallback } from "react";
import { useLanguage } from "../../../context/languageContext";

const FriendInvite = () => {
  const { trl } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchRequests = useCallback(async () => {
    try {
      const res = await makeRequest.post("/friendship/get_request_friend", {
        offset: offset,
      });
      setRequests(removeDuplicateUnits([...requests, ...res.data.list]));
      if (res.data.list.length !== 0) setOffset(offset + 10);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [offset, requests]);

  const handleShowMore = () => {
    fetchRequests();
  };
  const removeItemById = (idToRemove) => {
    setRequests((requests) =>
      requests.filter((request) => request.id !== idToRemove)
    );
  };

  const handleAccept = (user_id) => {
    makeRequest
      .get("/friendship/accept/" + user_id)
      .then((response) => {
        removeItemById(user_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeny = (user_id) => {
    makeRequest
      .get("/friendship/deny/" + user_id)
      .then((response) => {
        removeItemById(user_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (loading) fetchRequests();

  return (
    <div className="friend-invite">
      <div className="row">
        {requests.map((request) => (
          <div className="card-invite" key={request.id}>
            <img
              src={URL_OF_BACK_END + `users/profilePic/` + request.id}
              alt="User"
            />
            <span>{request.name}</span>
            <button className="accept" onClick={() => handleAccept(request.id)}>
              {trl("Chấp nhận")}
            </button>
            <button className="deny" onClick={() => handleDeny(request.id)}>
              {trl("Từ chối")}
            </button>
          </div>
        ))}
      </div>
      {loading && <NineCube />}
      {!loading && requests.length !== 0 && (
        <button onClick={handleShowMore}>{trl("Show More")}</button>
      )}
    </div>
  );
};
export default FriendInvite;

function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();
  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }
  return Array.from(uniqueUnits.values());
}
