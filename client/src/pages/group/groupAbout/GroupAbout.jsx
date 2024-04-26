import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../context/languageContext";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEye, faLock, faUsersLine } from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import { URL_OF_BACK_END } from "../../../axios.js";
import "./groupAbout.scss";

const GroupAbout = () => {
    const { trl } = useLanguage();
    const { groupId } = useParams();
    const [activeTab, setActiveTab] = useState("intro");
    const [joinStatus, setJoinStatus] = useState(null);

    const { data: groupData, isLoading: isGroupLoading, error: groupError } = useQuery(['group-details', groupId], () =>
        makeRequest.get(`/groups/${groupId}`).then(res => res.data[0])
    );

    useEffect(() => {
        if (groupData) {
            setJoinStatus(groupData.join_status);
        }
    }, [groupData]);

    const { data: members, isLoading: isMembersLoading, error: membersError } = useQuery(['group-members', groupId], () =>
        makeRequest.get(`/joins/groups/${groupId}/users`).then(res => res.data)
    );

    const handleJoinGroup = async () => {
        try {
            await makeRequest.post("/joins/join", {
                groupId: groupId,
            });
            setJoinStatus(0);
        } catch (error) {
            console.error("Error joining group:", error.response ? error.response.data : error.message);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (isGroupLoading || isMembersLoading) return <NineCube />;
    if (groupError) return <div className="error-message">Lỗi: {groupError.message}</div>;
    if (membersError) return <div className="error-message">Lỗi: {membersError.message}</div>;

    const getDefaultOrUploadedAvatar = () => {
        const defaultAvatar =
            "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

        return groupData.group_avatar === defaultAvatar
            ? groupData.group_avatar
            : `${URL_OF_BACK_END}groups/${groupId}/avatar`;
    };

    return (
        <div className="group-about">
            <div className="group-header">
                <div className="group-cover">
                    <img
                        src={getDefaultOrUploadedAvatar()}
                        alt={groupData.group_name}
                    />
                </div>
                <div className="group-info">
                    <span className="group-name">{groupData.group_name}</span>
                    <div className="group-privacy">
                        <FontAwesomeIcon
                            icon={faLock}
                            size="xs"
                            style={{ marginRight: "5px" }}
                        />
                        <span>{trl("Nhóm Riêng tư")}</span>
                        <FontAwesomeIcon
                            icon={faCircle}
                            style={{ fontSize: "2px", margin: "0 5px" }}
                        />
                        <span className="member">{members.length + trl(" thành viên")}</span>
                        <div className="activity">
                            {joinStatus === null ?
                                <div className="invite" onClick={handleJoinGroup}>
                                    <FontAwesomeIcon icon={faUsersLine} />
                                    <span>{trl("Tham gia")}</span>
                                </div>
                                : <div className="invite">
                                    <FontAwesomeIcon icon={faUsersLine} />
                                    <span>{trl("Chờ duyệt")}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="group-tabs">
                    <div className="tab-container">
                        <button
                            className={`tab ${activeTab === "intro" ? "active" : ""}`}
                            onClick={() => handleTabChange("intro")}
                        >
                            {trl("Giới thiệu")}
                        </button>
                        <button
                            className={`tab ${activeTab === "discussion" ? "active" : ""}`}
                            onClick={() => handleTabChange("discussion")}
                        >
                            {trl("Thảo luận")}
                        </button>
                    </div>
                </div>
            </div>
            <div className="group-body">
                <div className="group-intro">
                    <span className="title">{trl("Giới thiệu")}</span>
                    <span className="intro">{groupData.group_intro}</span>
                    <div className="intro-privacy">
                        <FontAwesomeIcon icon={faLock} style={{ marginTop: "4px" }} />
                        <div className="content">
                            <span className="intro-title">{trl("Riêng tư")}</span>
                            <span className="intro-content">
                                {trl("Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.")}
                            </span>
                        </div>
                    </div>
                    <div className="intro-privacy">
                        <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px", marginRight: "-4px" }} />
                        <div className="content">
                            <span className="intro-title">{trl("Hiển thị")}</span>
                            <span className="intro-content">
                                {trl("Ai cũng có thể tìm thấy nhóm này.")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupAbout;
