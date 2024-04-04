import React from "react";
import { useNavigate } from "react-router-dom";
import "./groupsJoined.scss";

const GroupJoined = ({ group }) => {
    const navigate = useNavigate();

    const viewGroup = () => {
        navigate(`/groups/${group.group_id}`);
    };

    return (
        <div className="card-invite">
            <img src={group.group_avatar} alt={group.group_name} />
            <span>{group.group_name}</span>
            <button className="accept" onClick={viewGroup}>
                Xem nhóm
            </button>
        </div>
    );
};

export default GroupJoined;