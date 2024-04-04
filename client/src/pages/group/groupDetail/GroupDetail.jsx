import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../axios.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEye, faLock, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import Share from "../../../components/share/Share.jsx";
import { URL_OF_BACK_END } from "../../../axios.js";
import "./groupDetail.scss";

const GroupDetail = () => {
    const { groupId } = useParams();
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await makeRequest.get(`/groups/${groupId}`);
                setGroupData(response.data[0]); // Assuming the API returns an array
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        const fetchMembers = async () => {
            try {
                const membersResponse = await makeRequest.get(`/joins/groups/${groupId}/users`);
                setMembers(membersResponse.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchGroupData();
        fetchMembers();
    }, [groupId]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (loading) return <NineCube />;
    if (error) return <div className="error-message">Lỗi: {error.message}</div>;
    if (!groupData) return <div>Không tìm thấy thông tin nhóm.</div>;

    let introContent;
    if (groupData.privacy_level === 0) {
        introContent = (
            <>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faLock} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">Riêng tư</span>
                        <span className="intro-content">Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.</span>
                    </div>
                </div>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">Hiển thị</span>
                        <span className="intro-content">Ai cũng có thể tìm thấy nhóm này.</span>
                    </div>
                </div>
            </>
        );
    } else if (groupData.privacy_level === 1) {
        introContent = (
            <>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faEarthAmericas} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">Công khai</span>
                        <span className="intro-content">Ai cũng nhìn thấy mọi người trong nhóm và những gì họ đăng</span>
                    </div>
                </div>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">Hiển thị</span>
                        <span className="intro-content">Ai cũng có thể tìm thấy nhóm này.</span>
                    </div>
                </div>
            </>
        );
    } else {
        introContent = null; // hoặc bạn có thể đặt một thông điệp mặc định
    }

    return (
        <div className="group-detail">
            <div className="group-header">
                <div className="group-cover">
                    <img src={groupData.group_avatar} alt={groupData.group_name} />
                </div>
                <div className="group-info">
                    <h1 className="group-name">{groupData.group_name}</h1>
                    <p className="group-privacy">
                        {
                            groupData.privacy_level === 0 ?
                                <FontAwesomeIcon icon={faLock} size="xs" style={{ marginRight: "5px" }} />
                                : <FontAwesomeIcon icon={faEarthAmericas} size="xs" style={{ marginRight: "5px" }} />
                        }
                        {groupData.privacy_level === 0 ? 'Nhóm Riêng tư' : 'Nhóm Công khai'}
                        <FontAwesomeIcon icon={faCircle} style={{ fontSize: "2px", margin: "0 5px" }} />
                        <span className='member'>{members.length + ' thành viên'}</span>
                    </p>
                </div>
                <div className="group-members">
                    <div className="members">
                        {members.map(member => (
                            <img key={member.id} src={`${URL_OF_BACK_END}users/profilePic/${member.id}`} alt={member.username} />
                        ))}
                    </div>
                    <div className="invite">
                        <span>+ Mời</span>
                    </div>
                </div>
                <div className="group-tabs">
                    <div className="tab-container">
                        <button className={`tab ${activeTab === 'discussion' ? 'active' : ''}`} onClick={() => handleTabChange('discussion')}>
                            Thảo luận
                        </button>
                        <button className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => handleTabChange('members')}>
                            Thành viên
                        </button>
                        <button className={`tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => handleTabChange('events')}>
                            Sự kiện
                        </button>
                        <button className={`tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => handleTabChange('files')}>
                            File
                        </button>
                    </div>
                </div>
            </div>
            <div className="group-body">
                <div className="post-block">
                    <Share />
                </div>
                <div className="group-intro">
                    <span className="title">Giới thiệu</span>
                    {introContent}
                </div>
            </div>
        </div>
    );
};

export default GroupDetail;