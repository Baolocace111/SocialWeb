import "./searchBar.scss";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faAddressCard,
  faTags,
  faChampagneGlasses,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../../../context/languageContext";

const SearchBar = () => {
  const { searchText } = useParams();
  const { trl } = useLanguage();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const path = location.pathname;
    const pathSegments = path.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    setSelectedItem(lastSegment);
  }, [location.pathname, searchText]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item === "hashtag")
      window.location.href = `/search/${searchText}/hashtag`;
    if (item === "post") window.location.href = `/search/${searchText}/post`;
    if (item === "groups")
      window.location.href = `/search/${searchText}/groups`;
  };
  const isItemSelected = (item) => {
    return item === selectedItem;
  };

  return (
    <div className="search-bar">
      <div className="container">
        <span className="search-title">{trl("Kết quả tìm kiếm")}</span>
        <hr />
        <div className="menu">
          <span className="menu-title">{trl("Bộ lọc")}</span>
          <Link
            to={`/search/${searchText}/people`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className={`item ${isItemSelected("people") ? "selected" : ""}`}
              onClick={() => handleItemClick("people")}
            >
              <div
                className={`icon-button ${
                  isItemSelected("people") ? "selected" : ""
                }`}
              >
                <FontAwesomeIcon className="icon" icon={faUserGroup} />
              </div>
              <span>{trl("Mọi người")}</span>
            </div>
          </Link>
          <div
            className={`item ${isItemSelected("post") ? "selected" : ""}`}
            onClick={() => handleItemClick("post")}
          >
            <div
              className={`icon-button ${
                isItemSelected("post") ? "selected" : ""
              }`}
            >
              <FontAwesomeIcon className="icon" icon={faAddressCard} />
            </div>
            <span>{trl("Bài viết")}</span>
          </div>
          <div
            className={`item ${isItemSelected("hashtag") ? "selected" : ""}`}
            onClick={() => handleItemClick("hashtag")}
          >
            <div
              className={`icon-button ${
                isItemSelected("hashtag") ? "selected" : ""
              }`}
            >
              <FontAwesomeIcon className="icon" icon={faTags} />
            </div>
            <span>Hashtag</span>
          </div>
          <div
            className={`item ${isItemSelected("groups") ? "selected" : ""}`}
            onClick={() => handleItemClick("groups")}
          >
            <div
              className={`icon-button ${
                isItemSelected("groups") ? "selected" : ""
              }`}
            >
              <FontAwesomeIcon className="icon" icon={faChampagneGlasses} />
            </div>
            <span>{trl("Nhóm")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
