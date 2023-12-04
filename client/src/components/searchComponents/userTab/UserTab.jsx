import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { Button } from "@mui/material";
import React, { useState } from "react";
import "./userTab.scss";

const UserTab = ({ user }) => {
  const [status, setStatus] = useState(user.friendStatus);
  const navigate = useNavigate();
  const SendRequest = async () => {
    setStatus(-3);
    makeRequest
      .get("/friendship/addfriend/" + user.id)
      .then((response) => {
        setStatus(1);
      })
      .catch((error) => {
        setStatus(-2);
      });
  };
  const CancelRequest = async () => {
    setStatus(-3);

    makeRequest
      .get("/friendship/cancel/" + user.id)
      .then((response) => {
        //console.log("Success...");
        setStatus(0);
      })
      .catch((error) => {
        //console.log(error);
        setStatus(-2);
      });
  };
  const AcceptRequest = async () => {
    setStatus(-3);
    makeRequest
      .get("/friendship/accept/" + user.id)
      .then((response) => {
        setStatus(3);
      })
      .catch((error) => {
        setStatus(-2);
      });
  };
  const DenyRequest = async () => {
    setStatus(-3);
    makeRequest
      .get("/friendship/deny/" + user.id)
      .then((response) => {
        setStatus(0);
      })
      .catch((error) => {
        setStatus(-2);
      });
  };
  const Unfriend = async () => {
    setStatus(-3);
    makeRequest
      .get("/friendship/unfriend/" + user.id)
      .then((response) => {
        setStatus(0);
      })
      .catch((error) => {
        setStatus(-2);
      });
  };
  const handleClicktoProfile = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <>
      <div className="userContainer">
        <div className="buttonBox">
          {status === 0 ? (
            <Button onClick={SendRequest}>Kết bạn</Button>
          ) : (
            <></>
          )}
          {status === 1 ? (
            <Button onClick={CancelRequest}>Hủy lời mời</Button>
          ) : (
            <></>
          )}
          {status === 2 ? (
            <>
              <Button onClick={AcceptRequest}>Đồng ý</Button>
              <Button onClick={DenyRequest}>Từ chối</Button>
            </>
          ) : (
            <></>
          )}
          {status === 3 ? <Button onClick={Unfriend}>Unfriend</Button> : <></>}
          {status === -2 ? "Có lỗi xảy ra..." : <></>}
          {status === -3 ? "Đang tải..." : <></>}
        </div>
        <img
          onClick={handleClicktoProfile}
          src={"/upload/" + user.profilePic}
          alt=""
        />
        <div onClick={handleClicktoProfile} className="username">
          {user.name}
        </div>
      </div>
    </>
  );
};
export default UserTab;
