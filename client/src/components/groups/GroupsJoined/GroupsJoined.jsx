import "./groupsJoined.scss";
import React from "react";

const GroupJoined = ({ group }) => {
    return (
        <div className="card-invite">
            <img src={"https://img5.thuthuatphanmem.vn/uploads/2021/11/19/hinh-nen-nhom-anh-nen-team-dep_052422440.jpg"} alt="User" />
            <span>{group.group_name}</span>
            <button className="accept">
                Tham gia
            </button>
        </div>
    )
}
export default GroupJoined;