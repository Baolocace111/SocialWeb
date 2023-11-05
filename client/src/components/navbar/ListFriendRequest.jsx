import React, { useEffect, useState, useCallback } from "react";
import { makeRequest } from "../../axios";

const ListFriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clickable, setClickable] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await makeRequest.post("/friendship/get_request_friend", {
        offset: offset,
      });
      //   console.log(offset);
      //   console.log(res.data);
      setRequests([...requests, ...res.data]);
      if (res.data.length !== 0) setOffset(offset + 10);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [offset, requests]);

  const handleShowMore = () => {
    fetchRequests();
  };

  const handleAccept = (user_id) => {
    makeRequest
      .get("/friendship/accept/" + user_id)
      .then((response) => {
        setClickable(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeny = (user_id) => {
    makeRequest
      .get("/friendship/deny/" + user_id)
      .then((response) => {
        setClickable(false);
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
            <img
              src={"/upload/" + request.profilePic}
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
              alt="User 1"
            />
          </div>
          <div
            style={{
              flex: "1",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ marginBottom: "10px" }}>{request.name}</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 10px 1fr",
              }}
            >
              {clickable ? (
                <>
                  <button onClick={() => handleAccept(request.id)}>
                    Chấp nhận
                  </button>
                  <div></div>
                  <button onClick={() => handleDeny(request.id)}>
                    Từ chối
                  </button>
                </>
              ) : (
                ""
              )}
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
