import "./searchBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faHashtag,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
const SearchBar = ({ search }) => {
  const handleUser = () => {
    if (search.num !== 0) {
      //navigator(`/search/${search.text}`);
      window.open(`/search/${search.text}`, "_blank");
    }
  };
  const handleText = () => {
    if (search.num !== 1) {
      //navigator(`/post/${search.text}`);
      window.open(`/post/${search.text}`, "_blank");
    }
  };
  const handleHashtag = () => {
    if (search.num !== 2) {
      //navigator(`/hashtag/${search.text}`);
      window.open(`/hashtag/${search.text}`, "_blank");
    }
  };
  return (
    <>
      <div className="searchbar">
        <div className="c-text">Chọn</div>
        <div className="line"></div>
        <div
          className={search.num === 0 ? "chose-box" : "normal-box"}
          onClick={handleUser}
        >
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div
          className={search.num === 1 ? "chose-box" : "normal-box"}
          onClick={handleText}
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </div>
        <div
          className={search.num === 2 ? "chose-box" : "normal-box"}
          onClick={handleHashtag}
        >
          <FontAwesomeIcon icon={faHashtag} />
        </div>
      </div>
    </>
  );
};
export default SearchBar;
