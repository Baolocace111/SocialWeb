import "./searchBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faHashtag,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
const SearchBar = ({ search }) => {
  const navigator = useNavigate();
  const handleUser = () => {
    if (search.num !== 0) {
      navigator(`/search/${search.text}`);
    }
  };
  const handleText = () => {
    if (search.num !== 1) {
      navigator(`/post/${search.text}`);
    }
  };
  const handleHashtag = () => {
    if (search.num !== 2) {
      navigator(`/hashtag/${search.text}`);
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
