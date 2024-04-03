import "./groupsJoined.scss";
import React from "react";

const GroupJoined = ({ group }) => {
    return (
        <div className="card-invite">
            <img src={group.group_avatar} alt="User" />
            <span>{group.group_name}</span>
            <button className="accept">
                Xem nhóm
            </button>
        </div>
    )
}
export default GroupJoined;