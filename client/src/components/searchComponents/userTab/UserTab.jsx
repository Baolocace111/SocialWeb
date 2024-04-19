import { useNavigate } from "react-router-dom";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUserMinus,
  faHeartCircleCheck,
  faBan,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./userTab.scss";
import { useLanguage } from "../../../context/languageContext";

const UserTab = ({ user }) => {
  const { trl } = useLanguage();
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
          src={URL_OF_BACK_END + `users/profilePic/` + user.id}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/upload/errorImage.png";
          }}
          alt={""}
        />
        <div onClick={handleClicktoProfile} className="username">
          {user.name}
        </div>
        <div className="buttonBox">
          {status === 0 ? (
            <Button onClick={SendRequest}>
              <FontAwesomeIcon icon={faUserPlus} />
              <span>{trl("Thêm bạn bè")}</span>
            </Button>
          ) : (
            <></>
          )}
          {status === 1 ? (
            <Button onClick={CancelRequest}>
              <FontAwesomeIcon icon={faUserMinus} />
              <span>{trl("Hủy lời mời")}</span>
            </Button>
          ) : (
            <></>
          )}
          {status === 2 ? (
            <>
              <Button onClick={AcceptRequest}>
                <FontAwesomeIcon icon={faHeartCircleCheck} />
                <span>{trl("Chấp nhận")}</span>
              </Button>
              <Button className="deny-friend" onClick={DenyRequest}>
                <FontAwesomeIcon icon={faBan} />
                <span>{trl("Từ chối")}</span>
              </Button>
            </>
          ) : (
            <></>
          )}
          {status === 3 ? (
            <Button className="delete-friend" onClick={Unfriend}>
              <FontAwesomeIcon icon={faUserSlash} />
              <span>{trl("Xóa bạn")}</span>
            </Button>
          ) : (
            <></>
          )}
          {status === -2 ? `${trl("Có lỗi xảy ra")}...` : <></>}
          {status === -3 ? `${trl("Loading")}...` : <></>}
        </div>
      </div>
    </>
  );
};
export default UserTab;
