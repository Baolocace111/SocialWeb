import React from "react";
import { useNavigate } from "react-router-dom";
import { URL_OF_BACK_END } from "../../../axios";
import "./groupsJoined.scss";

const GroupJoined = ({ group }) => {
    const navigate = useNavigate();

    const viewGroup = () => {
        navigate(`/groups/${group.group_id}`);
    };

    const getDefaultOrUploadedAvatar = () => {
        const defaultAvatar = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

        return group.group_avatar === defaultAvatar
            ? group.group_avatar
            : `${URL_OF_BACK_END}groups/${group.group_id}/avatar`;
    };

    return (
        <div className="card-invite">
            <img src={getDefaultOrUploadedAvatar()} alt={group.group_name} />
            <span>{group.group_name}</span>
            <button className="accept" onClick={viewGroup}>
                Xem nhóm
            </button>
        </div>
    );
};

export default GroupJoined;