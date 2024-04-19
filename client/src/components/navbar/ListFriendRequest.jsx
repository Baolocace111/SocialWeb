import React, { useState, useCallback } from "react";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
import { Link } from "react-router-dom";
import NineCube from "../loadingComponent/nineCube/NineCube";
import { useLanguage } from "../../context/languageContext";
import "./listFriendRequest.scss";
const ListFriendRequest = () => {
  const { trl } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ws, setWS] = useState(null);
  //const [clickable, setClickable] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await makeRequest.post("/friendship/get_request_friend", {
        offset: offset,
      });
      //   console.log(offset);
      //   console.log(res.data);
      setRequests(removeDuplicateUnits([...requests, ...res.data.list]));
      if (res.data.list.length !== 0) setOffset(offset + 10);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [offset, requests]);

  if (!ws) {
    const socket = new WebSocket(`ws://localhost:3030/index`);
    socket.onopen = () => {
      console.log("Connected");
    };
    socket.onmessage = async (event) => {
      if (event.data === "A Request has sent or cancelled") {
        try {
          const res = await makeRequest.post("/friendship/get_request_friend", {
            offset: 0,
          });
          //   console.log(offset);
          //console.log(res);
          setRequests(removeDuplicateUnits([...requests, ...res.data.list]));
        } catch (error) {
          console.error("Failed to fetch friends:", error);
        }
      }
    };
    socket.onclose = () => {
      console.log("Closed");
    };
    setWS(socket);
  }

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
        //setClickable(false);
        //setOffset(offset - 10);
        removeItemById(user_id);
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const handleDeny = (user_id) => {
    makeRequest
      .get("/friendship/deny/" + user_id)
      .then((response) => {
        //setClickable(false);
        //setOffset(offset - 10);
        //fetchRequests();
        removeItemById(user_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (loading) fetchRequests();
  return (
    <div className="listFriendRequest-container">
      {requests.map((request) => (
        <div className="listFriendRequest-item" key={request.id}>
          <div className="listFriendRequest-avatarWrapper">
            <Link
              to={`/profile/${request.id}`}
              className="listFriendRequest-profileLink"
              target="_blank"
            >
              <img
                src={URL_OF_BACK_END + `users/profilePic/` + request.id}
                className="listFriendRequest-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt={request.name}
              />
            </Link>
          </div>
          <div className="listFriendRequest-requestDetails">
            <div className="listFriendRequest-requestName">
              <Link
                to={`/profile/${request.id}`}
                className="listFriendRequest-profileLink"
                target="_blank"
              >
                {request.name}
              </Link>
            </div>
            <div className="listFriendRequest-actionButtons">
              <button
                className="listFriendRequest-acceptButton"
                onClick={() => handleAccept(request.id)}
              >
                {trl("Chấp nhận")}
              </button>
              <div className="listFriendRequest-buttonSpacer"></div>
              <button
                className="listFriendRequest-denyButton"
                onClick={() => handleDeny(request.id)}
              >
                {trl("Từ chối")}
              </button>
            </div>
          </div>
        </div>
      ))}
      {loading && <NineCube />}
      {!loading && (
        <button
          className="listFriendRequest-showMoreButton"
          onClick={handleShowMore}
        >
          {trl("Show More")}
        </button>
      )}
    </div>
  );
};

export default ListFriendRequest;
function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();
  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }
  return Array.from(uniqueUnits.values());
}
