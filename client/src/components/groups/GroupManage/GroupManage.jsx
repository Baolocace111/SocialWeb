import "./groupManage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faHouse, faLayerGroup, faUserPlus, faClock, faHeadset, faCircle, faLock, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import NineCube from "../../../components/loadingComponent/nineCube/NineCube.jsx";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../../context/authContext.js";
import { Link, useParams, useLocation } from 'react-router-dom';
import { URL_OF_BACK_END, makeRequest } from '../../../axios';

const GroupManage = () => {
    const { currentUser } = useContext(AuthContext);
    const { groupId } = useParams();
    const location = useLocation();
    const [groupDetails, setGroupDetails] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeDropdown_1, setActiveDropdown_1] = useState('adminTools_1');
    const [activeDropdown_2, setActiveDropdown_2] = useState('adminTools_2');
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };
    const isItemSelected = (item) => {
        return item === selectedItem;
    };

    useEffect(() => {
        const path = location.pathname;
        const pathSegments = path.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        !isNaN(lastSegment) ? setSelectedItem(null) : setSelectedItem(lastSegment);
    }, [location.pathname]);

    useEffect(() => {
        // Lấy thông tin nhóm
        makeRequest.get(`/groups/${groupId}`)
            .then(response => {
                setGroupDetails(response.data[0]);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching group details:", error);
                setError(error);
                setLoading(false);
            });

        // Lấy thông tin người dùng trong nhóm
        makeRequest.get(`/joins/groups/${groupId}/users`)
            .then(response => {
                setGroupUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching group users:", error);
                setError(error);
                setLoading(false);
            });
    }, [groupId]);

    // Hàm để toggle dropdown
    const toggleDropdown_1 = (dropdownName) => {
        if (activeDropdown_1 === dropdownName) {
            setActiveDropdown_1(null);
        } else {
            setActiveDropdown_1(dropdownName);
        }
    };
    const toggleDropdown_2 = (dropdownName) => {
        if (activeDropdown_2 === dropdownName) {
            setActiveDropdown_2(null);
        } else {
            setActiveDropdown_2(dropdownName);
        }
    };

    const getDefaultOrUploadedAvatar = () => {
        const defaultAvatar = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg";

        return groupDetails.group_avatar === defaultAvatar
            ? groupDetails.group_avatar
            : `${URL_OF_BACK_END}groups/${groupId}/avatar`;
    };

    if (loading) return <NineCube />;
    if (error) return <div className="error-message">Lỗi: {error.message}</div>;
    if (!groupDetails) return <div>Không tìm thấy thông tin nhóm.</div>;

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
                    {currentUser.id === groupDetails.created_by && (
                        <>
                            <div className="menu-box">
                                <Link to={`/groups/${groupId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className={`menu-item ${(isItemSelected('main-page') || isItemSelected(null)) ? 'selected' : ''}`} onClick={() => handleItemClick('main-page')}>
                                        <FontAwesomeIcon icon={faHouse} style={{ marginRight: "10px" }} />
                                        <span>Trang chủ nhóm</span>
                                    </div>
                                </Link>
                                <Link to={`/groups/${groupId}/overview`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <div className={`menu-item ${isItemSelected('overview') ? 'selected' : ''}`} onClick={() => handleItemClick('overview')}>
                                        <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: "10px" }} />
                                        <span>Tổng quan</span>
                                    </div>
                                </Link>
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
                                        <Link to={`/groups/${groupId}/member-requests`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <div className={`dropdown-item ${isItemSelected('member-requests') ? 'selected' : ''}`} onClick={() => handleItemClick('member-requests')}>
                                                <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "10px" }} />
                                                <span>Yêu cầu làm thành viên</span>
                                            </div>
                                        </Link>
                                        <Link to={`/groups/${groupId}/pending_posts`} style={{ textDecoration: "none", color: "inherit" }}>
                                            <div className={`dropdown-item ${isItemSelected('pending_posts') ? 'selected' : ''}`} onClick={() => handleItemClick('pending_posts')}>
                                                <FontAwesomeIcon icon={faClock} style={{ marginRight: "10px" }} />
                                                <span>Bài viết đang chờ</span>
                                            </div>
                                        </Link>
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
                        </>
                    )}
                </div>
                <div className="finish-manage">
                </div>
            </div>
        </div>
    );
};

export default GroupManage;