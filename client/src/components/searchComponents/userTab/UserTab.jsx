import { Link } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { Button } from "@mui/material";
import React from "react";

const UserTab = ({ user }) => {
  let componentToRender;
  let status;
  const setStatus = (number) => {
    status =number;
    //checkStatus();
  };
  
  setStatus(user.friendStatus);
  

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
        console.log("Success...");
        setStatus(0);
      })
      .catch((error) => {
        console.log(error);
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
  const checkStatus = () => {
    switch (status) {
      case 0:
        componentToRender = <Button onClick={SendRequest}>Kết bạn</Button>;
        break;
      case 1:
        componentToRender = (
          <Button onClick={CancelRequest}>Hủy lời mời</Button>
        );
        break;
      case 2:
        componentToRender = (
          <div>
            <Button onClick={AcceptRequest}>Đồng ý</Button>{" "}
            <Button onClick={DenyRequest}>Từ chối</Button>
          </div>
        );
        break;
      case 3:
        componentToRender = <Button onClick={Unfriend}>Unfriend</Button>;
        break;
      case -2:
        componentToRender = <div>Có lỗi xảy ra...</div>;
        break;
      case -3:
        componentToRender = <div>Đang tải...</div>;
        break;
      default:
        componentToRender = null;
        break;
    }
  };
  checkStatus();
  return (
    <div className="user-container">
      <Link to={`/profile/${user.id}`}>
        <img src={"/upload/"} alt="" />
        <span className="name">{user.name}</span>
      </Link>

      <div>{componentToRender}</div>
    </div>
  );
};
export default UserTab;
