import "./groupsBar.scss";
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faLightbulb, faGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const GroupsBar = () => {

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
                    <span>Nhóm</span>
                    <button className="icon">
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>
                <div className="menu">
                    <Link to={`/groups/discover`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className={`item ${isItemSelected('discover') ? 'selected' : ''}`} onClick={() => handleItemClick('discover')}>
                            <div className={`icon-button ${isItemSelected('discover') ? 'selected' : ''}`}>
                                <FontAwesomeIcon icon={faUserPlus} size="lg" />
                            </div>
                            <span>Khám phá</span>
                        </div>
                    </Link>
                    <Link to={`/groups/joins`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div className={`item ${isItemSelected('joins') ? 'selected' : ''}`} onClick={() => handleItemClick('joins')}>
                            <div className={`icon-button ${isItemSelected('joins') ? 'selected' : ''}`}>
                                <FontAwesomeIcon icon={faLightbulb} size="lg" />
                            </div>
                            <span>Nhóm của bạn</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default GroupsBar;
