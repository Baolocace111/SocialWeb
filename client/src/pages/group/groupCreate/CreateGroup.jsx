import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEye, faLock, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import './createGroup.scss';
import Share from '../../../components/share/Share';

const CreateGroup = ({ groupName, groupPrivacy }) => {
    const [activeTab, setActiveTab] = useState('intro');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    let introContent;
    if (groupPrivacy === 'Riêng tư') {
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
    } else if (groupPrivacy === 'Công khai') {
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
        <div className="create-group-preview">
            <div className='preview'>
                <div className='group-header'>
                    <div className="group-cover">
                        <img src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/08/hinh-nen-anime-dep.jpg" alt="Group Cover" />
                    </div>
                    <div className="group-info">
                        <h1 className="group-name">{groupName || 'Tên nhóm'}</h1>
                        <p className="group-privacy">
                            {groupPrivacy ? ('Nhóm ' + groupPrivacy) : "Quyền riêng tư"}
                            <FontAwesomeIcon icon={faCircle} style={{ fontSize: "2px", margin: "0 5px" }} />
                            <span className='member'>{'1 thành viên'}</span>
                        </p>
                    </div>
                    <div className="group-tabs disabled">
                        <button className={`tab ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => handleTabChange('intro')}>
                            Giới thiệu
                        </button>
                        <button className={`tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>
                            Bài viết
                        </button>
                        <button className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => handleTabChange('members')}>
                            Thành viên
                        </button>
                    </div>
                </div>
                <div className="group-body disabled">
                    <div className="post-block">
                        <Share />
                    </div>
                    <div className="group-intro">
                        <span className="title">Giới thiệu</span>
                        {introContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
