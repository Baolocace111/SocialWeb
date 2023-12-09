import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../axios";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserMinus, faHeartCircleCheck, faBan, faUserSlash } from "@fortawesome/free-solid-svg-icons";
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
      <div className="userTab">
        <img
          onClick={handleClicktoProfile}
          src={"/upload/" + user.profilePic}
          alt=""
        />
        <div onClick={handleClicktoProfile} className="username">
          {user.name}
        </div>
        <div className="buttonBox">
          {status === 0 ? (
            <Button onClick={SendRequest}>
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Kết bạn</span>
            </Button>
          ) : (
            <></>
          )}
          {status === 1 ? (
            <Button onClick={CancelRequest}>
              <FontAwesomeIcon icon={faUserMinus} />
              <span>Hủy lời mời</span>
            </Button>
          ) : (
            <></>
          )}
          {status === 2 ? (
            <>
              <Button onClick={AcceptRequest}>
                <FontAwesomeIcon icon={faHeartCircleCheck} />
                <span>Đồng ý</span>
              </Button>
              <Button className="deny-friend" onClick={DenyRequest}>
                <FontAwesomeIcon icon={faBan} />
                <span>Từ chối</span>
              </Button>
            </>
          ) : (
            <></>
          )}
          {status === 3 ?
            <Button className="delete-friend" onClick={Unfriend}>
              <FontAwesomeIcon icon={faUserSlash} />
              <span>Xóa bạn</span>
            </Button>
            :
            <></>
          }
          {status === -2 ? "Có lỗi xảy ra..." : <></>}
          {status === -3 ? "Đang tải..." : <></>}
        </div>
      </div>
    </>
  );
};
export default UserTab;
