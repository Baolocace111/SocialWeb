import React, { useState } from 'react';
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faEye, faLock, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import './createGroup.scss';
import Share from '../../../components/share/Share';

const CreateGroup = ({ groupName, groupPrivacy }) => {
    const { trl } = useLanguage();
    const [activeTab, setActiveTab] = useState('intro');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    let introContent;
    if (groupPrivacy === trl("Riêng tư")) {
        introContent = (
            <>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faLock} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">{trl("Riêng tư")}</span>
                        <span className="intro-content">{trl("Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.")}</span>
                    </div>
                </div>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">{trl("Hiển thị")}</span>
                        <span className="intro-content">{trl("Ai cũng có thể tìm thấy nhóm này.")}</span>
                    </div>
                </div>
            </>
        );
    } else if (groupPrivacy === trl("Công khai")) {
        introContent = (
            <>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faEarthAmericas} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">{trl("Công khai")}</span>
                        <span className="intro-content">{trl("Ai cũng nhìn thấy mọi người trong nhóm và những gì họ đăng.")}</span>
                    </div>
                </div>
                <div className="intro-privacy">
                    <FontAwesomeIcon icon={faEye} style={{ marginTop: "4px" }} />
                    <div className="content">
                        <span className="intro-title">{trl("Hiển thị")}</span>
                        <span className="intro-content">{trl("Ai cũng có thể tìm thấy nhóm này.")}</span>
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
                        <h1 className="group-name">{groupName || trl("Tên nhóm")}</h1>
                        <p className="group-privacy">
                            {groupPrivacy ? (trl("Nhóm ") + groupPrivacy) : trl("Quyền riêng tư")}
                            <FontAwesomeIcon icon={faCircle} style={{ fontSize: "2px", margin: "0 5px" }} />
                            <span className='member'>{trl("1 thành viên")}</span>
                        </p>
                    </div>
                    <div className="group-tabs disabled">
                        <button className={`tab ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => handleTabChange('intro')}>
                            {trl("Giới thiệu")}
                        </button>
                        <button className={`tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>
                            {trl("Bài viết")}
                        </button>
                        <button className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => handleTabChange('members')}>
                            {trl("Thành viên")}
                        </button>
                    </div>
                </div>
                <div className="group-body disabled">
                    <div className="post-block">
                        <Share />
                    </div>
                    <div className="group-intro">
                        <span className="title">{trl("Giới thiệu")}</span>
                        {introContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
