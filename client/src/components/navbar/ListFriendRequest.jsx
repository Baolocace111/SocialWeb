import React, { useEffect, useState, useCallback } from "react";
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const ListFriendRequest = () => {
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
    <div style={{ width: "300px" }}>
      {requests.map((request) => (
        <div style={{ display: "flex", margin: "15px 10px" }} key={request.id}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "15px",
              flex: "0 0 auto",
            }}
          >
            <Link
              to={`/profile/${request.id}`}
              style={{ cursor: "pointer" }}
              target="_blank"
            >
              <img
                src={"/upload/" + request.profilePic}
                style={{ borderRadius: "50%", width: "50px", height: "50px" }}
                alt="User 1"
              />
            </Link>
          </div>
          <div
            style={{
              flex: "1",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <Link
                to={`/profile/${request.id}`}
                style={{ cursor: "pointer" }}
                target="_blank"
              >
                {request.name}
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 10px 1fr",
              }}
            >
              <>
                <button onClick={() => handleAccept(request.id)}>
                  Chấp nhận
                </button>
                <div></div>
                <button onClick={() => handleDeny(request.id)}>Từ chối</button>
              </>
            </div>
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!loading && <button onClick={handleShowMore}>Show More</button>}
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
