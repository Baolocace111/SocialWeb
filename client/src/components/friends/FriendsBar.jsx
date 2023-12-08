import "./friendsBar.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faLightbulb, faGear } from "@fortawesome/free-solid-svg-icons";

const FriendsBar = () => {
    const [selectedItem, setSelectedItem] = useState('');

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };
    const isItemSelected = (item) => {
        return item === selectedItem;
    };
    return (
        <div className="friends-bar">
            <div className="container">
                <div className="friends-title">
                    <span>Bạn bè</span>
                    <button className="icon">
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>
                <div className="menu">
                    <div className={`item ${isItemSelected('invite') ? 'selected' : ''}`} onClick={() => handleItemClick('invite')}>
                        <div className={`icon-button ${isItemSelected('invite') ? 'selected' : ''}`}>
                            <FontAwesomeIcon icon={faUserPlus} size="lg" />
                        </div>
                        <span>Lời mời kết bạn</span>
                    </div>
                    <div className={`item ${isItemSelected('suggest') ? 'selected' : ''}`} onClick={() => handleItemClick('suggest')}>
                        <div className={`icon-button ${isItemSelected('suggest') ? 'selected' : ''}`}>
                            <FontAwesomeIcon icon={faLightbulb} size="lg" />
                        </div>
                        <span>Gợi ý</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FriendsBar;
