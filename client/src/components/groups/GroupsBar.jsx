import "./groupsBar.scss";
import { useLanguage } from "../../context/languageContext";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faGear, faCompass } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const GroupsBar = () => {
    const { trl } = useLanguage();
    const location = useLocation();
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        const path = location.pathname;
        const pathSegments = path.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        setSelectedItem(lastSegment);
    }, [location.pathname]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };
    const isItemSelected = (item) => {
        return item === selectedItem;
    };
    return (
        <div className="groups-bar">
            <div className="container">
                <div className="groups-title">
                    <span>{trl("Nhóm")}</span>
                    <button className="icon">
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>
                <div className="menu">
                    <Link to={`/groups/discover`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className={`item ${isItemSelected('discover') ? 'selected' : ''}`} onClick={() => handleItemClick('discover')}>
                            <div className={`icon-button ${isItemSelected('discover') ? 'selected' : ''}`}>
                                <FontAwesomeIcon icon={faCompass} size="lg" />
                            </div>
                            <span>{trl("Khám phá")}</span>
                        </div>
                    </Link>
                    <Link to={`/groups/joins`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className={`item ${isItemSelected('joins') ? 'selected' : ''}`} onClick={() => handleItemClick('joins')}>
                            <div className={`icon-button ${isItemSelected('joins') ? 'selected' : ''}`}>
                                <FontAwesomeIcon icon={faLightbulb} size="lg" />
                            </div>
                            <span>{trl("Nhóm của bạn")}</span>
                        </div>
                    </Link>
                </div>
                <div
                    className="create"
                    onClick={() => {
                        window.location.href = `/groups/create`;
                    }}
                >
                    <span>{trl("+ Tạo nhóm mới")}</span>
                </div>
            </div>
        </div>
    );
};
export default GroupsBar;
