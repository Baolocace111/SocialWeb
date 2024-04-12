import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../axios.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEye, faLock, faEarthAmericas, faPen, faUpload, faImage } from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import GroupShare from "../../../components/groups/GroupShare/GroupShare.jsx";
import { URL_OF_BACK_END } from "../../../axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./groupDetail.scss";
import GroupPosts from "../../../components/groups/GroupPosts/GroupPosts.jsx";

const GroupDetail = () => {
    const { groupId } = useParams();
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');

    const [showPopover, setShowPopover] = useState(false);
    const togglePopover = () => {
        setShowPopover(!showPopover);
    };

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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setSelectedImageFile(file);
        }
        togglePopover();
    };

    const queryClient = useQueryClient();

    const groupAvatarMutation = useMutation(
        (image) => {
            return makeRequest.put(`/groups/${groupId}/update/avatar`, image);
        },
        {
            onSuccess: (data) => {
                // Invalidate and refetch
                setSelectedImage(null);
                setSelectedImageFile(null);
                queryClient.invalidateQueries(['group-detail', groupId]);
            },
        }
    );

    const handleSave = async () => {
        if (!selectedImageFile) return;

        const formData = new FormData();
        formData.append('file', selectedImageFile);

        try {
            await groupAvatarMutation.mutateAsync(formData);
            window.location.reload();
        } catch (error) {
            console.error('Error while uploading image:', error);
        }
    };

    const handleCancel = () => {
        setSelectedImage(null);
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
        introContent = null;
    }

    const getDefaultOrUploadedAvatar = () => {
        const defaultAvatar = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

        return groupData.group_avatar === defaultAvatar
            ? groupData.group_avatar
            : `${URL_OF_BACK_END}groups/${groupId}/avatar`;
    };

    return (
        <div className="group-detail">
            <div className="group-header">
                <div className="group-cover">
                    {selectedImage && (
                        <div className="cover-toolbar">
                            <div className="option">
                                <button className="button cancel" onClick={handleCancel}>Hủy</button>
                                <button className="button save" onClick={handleSave}>Lưu thay đổi</button>
                            </div>
                        </div>
                    )}
                    <img src={selectedImage || getDefaultOrUploadedAvatar()} alt={groupData.group_name} />
                    <div className="edit-box">
                        {!selectedImage && (
                            <button className="edit-button" onClick={togglePopover}>
                                <FontAwesomeIcon icon={faPen} style={{ marginRight: "5px" }} />
                                Chỉnh sửa
                            </button>
                        )}
                        {showPopover && (
                            <div className="popover">
                                <div className="popover-item">
                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="file-upload" />
                                    <label htmlFor="file-upload" style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                                        <FontAwesomeIcon icon={faUpload} style={{ marginRight: "10px" }} />
                                        Tải ảnh lên
                                    </label>
                                </div>
                                <div className="popover-item"><FontAwesomeIcon icon={faImage} style={{ marginRight: "10px" }} />Chọn từ ảnh minh họa</div>
                            </div>
                        )}
                    </div>
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
                    <GroupShare />
                    <GroupPosts groupId={groupId} />
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