import React, { useEffect, useState } from "react";
import { makeRequest } from "../../axios";

const ListFriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchRequests();
  }, []);
  const fetchRequests = async () => {
    try {
      const res = await makeRequest.post("/friendship/get_request_friend", {
        offset: offset,
      });
      console.log(res.data);
      setRequests([...requests, ...res.data]);
      setOffset(offset + 1);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };
  const handleShowMore = () => {
    fetchRequests();
  };
  const handleAccept = () => {};
  const handleDeny = () => {};
  return (
    <div>
      {requests.map((request) => (
        <div style={{ width: "300px" }} key={request.id}>
          <div style={{ display: "flex", margin: "15px 10px" }}>
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
                <button onClick={handleAccept}>Chấp nhận</button>
                <div></div>
                <button onClick={handleDeny}>Từ chối</button>
              </div>
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
