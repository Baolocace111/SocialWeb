import "./friendSuggestion.scss";
import { makeRequest } from "../../../axios";
import React, { useState } from "react";

const FriendSuggestion = ({ suggest }) => {
    const [status, setStatus] = useState(0);

    const SendRequest = async (userId) => {
        setStatus(-3);
        makeRequest.get("/friendship/addfriend/" + userId)
            .then((response) => {
                setStatus(1);
            }).catch((error) => {
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
            <img src={"/upload/" + suggest.profilePic} alt="User" />
            <span>{suggest.name}</span>
            {status === 0 ? (
                <button className="accept" onClick={() => SendRequest(suggest.id)}>
                    Thêm bạn bè
                </button>
            ) : (
                <></>
            )}
            {status === 1 ? (
                <button className="accept" onClick={() => CancelRequest(suggest.id)}>
                    Hủy lời mời
                </button>
            ) : (
                <></>
            )}
        </div>
    )
}
export default FriendSuggestion;