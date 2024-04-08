import "./groupManage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faHouse, faLayerGroup, faUserPlus, faClock, faHeadset, faCircle, faLock, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { URL_OF_BACK_END, makeRequest } from '../../../axios';

const GroupManage = () => {
    const { groupId } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);

    const [activeDropdown_1, setActiveDropdown_1] = useState(null);
    const [activeDropdown_2, setActiveDropdown_2] = useState(null);
    const [selectedItem, setSelectedItem] = useState('');

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };
    const isItemSelected = (item) => {
        return item === selectedItem;
    };

    useEffect(() => {
        // Lấy thông tin nhóm
        makeRequest.get(`/groups/${groupId}`)
            .then(response => {
                setGroupDetails(response.data[0]);
            })
            .catch(error => {
                console.error("Error fetching group details:", error);
            });

        // Lấy thông tin người dùng trong nhóm
        makeRequest.get(`/joins/groups/${groupId}/users`)
            .then(response => {
                setGroupUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching group users:", error);
            });
    }, [groupId]);

    // Hàm để toggle dropdown
    const toggleDropdown_1 = (dropdownName) => {
        if (activeDropdown_1 === dropdownName) {
            setActiveDropdown_1(null); // Đóng dropdown nếu nó đang mở
        } else {
            setActiveDropdown_1(dropdownName); // Mở dropdown
        }
    };
    const toggleDropdown_2 = (dropdownName) => {
        if (activeDropdown_2 === dropdownName) {
            setActiveDropdown_2(null); // Đóng dropdown nếu nó đang mở
        } else {
            setActiveDropdown_2(dropdownName); // Mở dropdown
        }
    };

    const getDefaultOrUploadedAvatar = () => {
        const defaultAvatar = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

        return groupDetails.group_avatar === defaultAvatar
            ? groupDetails.group_avatar
            : `${URL_OF_BACK_END}groups/${groupId}/avatar`;
    };

    return (
        <div className="group-manage">
            <div className="container">
                {groupDetails && (
                    <div className="manage-title">
                        <img src={getDefaultOrUploadedAvatar()} alt={groupDetails.group_name} className="cover-image" />
                        <div className="group-info">
                            <h2 className="group-name">{groupDetails.group_name}</h2>
                            <div className="privacy">
                                {
                                    groupDetails.privacy_level === 0 ?
                                        <FontAwesomeIcon icon={faLock} size="xs" style={{ marginRight: "7px" }} />
                                        : <FontAwesomeIcon icon={faEarthAmericas} size="xs" style={{ marginRight: "7px" }} />
                                }
                                {groupDetails.privacy_level === 0 ? 'Nhóm Riêng tư' : 'Nhóm Công khai'}
                                <FontAwesomeIcon icon={faCircle} style={{ fontSize: "2px", margin: "0 5px" }} />
                                <span className="member-count">{groupUsers.length} thành viên</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="manage-section">
                    <div className="menu-box">
                        <div className={`menu-item ${isItemSelected('main-page') ? 'selected' : ''}`} onClick={() => handleItemClick('main-page')}>
                            <FontAwesomeIcon icon={faHouse} style={{ marginRight: "10px" }} />
                            <span>Trang chủ nhóm</span>
                        </div>
                        <div className={`menu-item ${isItemSelected('overall') ? 'selected' : ''}`} onClick={() => handleItemClick('overall')}>
                            <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: "10px" }} />
                            <span>Tổng quan</span>
                        </div>
                    </div>
                    <div className="dropdown-box">
                        <div className="dropdown-menu">
                            <div className="dropdown-header" onClick={() => toggleDropdown_1('adminTools_1')}>
                                <span>Công cụ quản trị</span>
                                {activeDropdown_1 === 'adminTools_1' ? (
                                    <FontAwesomeIcon icon={faAngleUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faAngleDown} />
                                )}
                            </div>
                            <div className={`dropdown-content ${activeDropdown_1 === 'adminTools_1' ? 'show' : ''}`}>
                                <div className={`dropdown-item ${isItemSelected('member-requests') ? 'selected' : ''}`} onClick={() => handleItemClick('member-requests')}>
                                    <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "10px" }} />
                                    <span>Yêu cầu làm thành viên</span>
                                </div>
                                <div className={`dropdown-item ${isItemSelected('waiting-posts') ? 'selected' : ''}`} onClick={() => handleItemClick('waiting-posts')}>
                                    <FontAwesomeIcon icon={faClock} style={{ marginRight: "10px" }} />
                                    <span>Bài viết đang chờ</span>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown-menu">
                            <div className="dropdown-header" onClick={() => toggleDropdown_2('adminTools_2')}>
                                <span>Trung tâm hỗ trợ</span>
                                {activeDropdown_2 === 'adminTools_2' ? (
                                    <FontAwesomeIcon icon={faAngleUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faAngleDown} />
                                )}
                            </div>
                            <div className={`dropdown-content ${activeDropdown_2 === 'adminTools_2' ? 'show' : ''}`}>
                                <div className={`dropdown-item ${isItemSelected('support') ? 'selected' : ''}`} onClick={() => handleItemClick('support')}>
                                    <FontAwesomeIcon icon={faHeadset} style={{ marginRight: "10px" }} />
                                    <span>Nhắn tin trợ giúp</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="finish-manage">
                </div>
            </div>
        </div>
    );
};

export default GroupManage;