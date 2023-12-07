import "./searchBar.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faAddressCard, faTags } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  const isItemSelected = (item) => {
    return item === selectedItem;
  };

  return (
    <div className="search-bar">
      <div className="container">
        <span className="search-title">Kết quả tìm kiếm</span>
        <hr />
        <div className="menu">
          <span className="menu-title">Bộ lọc</span>
          <div className={`item ${isItemSelected('people') ? 'selected' : ''}`} onClick={() => handleItemClick('people')}>
            <div className={`icon-button ${isItemSelected('people') ? 'selected' : ''}`}>
              <FontAwesomeIcon className="icon" icon={faUserGroup} />
            </div>
            <span>Mọi người</span>
          </div>
          <div className={`item ${isItemSelected('post') ? 'selected' : ''}`} onClick={() => handleItemClick('post')}>
            <div className={`icon-button ${isItemSelected('post') ? 'selected' : ''}`}>
              <FontAwesomeIcon className="icon" icon={faAddressCard} />
            </div>
            <span>Bài viết</span>
          </div>
          <div className={`item ${isItemSelected('hashtag') ? 'selected' : ''}`} onClick={() => handleItemClick('hashtag')}>
            <div className={`icon-button ${isItemSelected('hashtag') ? 'selected' : ''}`}>
              <FontAwesomeIcon className="icon" icon={faTags} />
            </div>
            <span>Hashtag</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
