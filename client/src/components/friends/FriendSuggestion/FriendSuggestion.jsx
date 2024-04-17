import "./friendSuggestion.scss";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import React, { useState } from "react";
import { useLanguage } from "../../../context/languageContext";

const FriendSuggestion = ({ suggest }) => {
  const [status, setStatus] = useState(0);
  const { trl } = useLanguage();
  const SendRequest = async (userId) => {
    setStatus(-3);
    makeRequest
      .get("/friendship/addfriend/" + userId)
      .then((response) => {
        setStatus(1);
      })
      .catch((error) => {
        setStatus(-2);
      });
  };

  const CancelRequest = async (userId) => {
    setStatus(-3);
    makeRequest
      .get("/friendship/cancel/" + userId)
      .then((response) => {
        //console.log("Success...");
        setStatus(0);
      })
      .catch((error) => {
        //console.log(error);
        setStatus(-2);
      });
  };

  return (
    <div className="card-invite">
      <img
        src={URL_OF_BACK_END + `users/profilePic/` + suggest.id}
        alt="User"
      />
      <span>{suggest.name}</span>
      {status === 0 ? (
        <button className="accept" onClick={() => SendRequest(suggest.id)}>
          {trl("Thêm bạn bè")}
        </button>
      ) : (
        <></>
      )}
      {status === 1 ? (
        <button className="accept" onClick={() => CancelRequest(suggest.id)}>
          {trl("Hủy lời mời")}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
export default FriendSuggestion;
