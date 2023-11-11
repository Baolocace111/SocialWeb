import "./searchBar.scss";

const SearchBar = ({ search }) => {
  return (
    <>
      <div className="searchbar">
        <div className="c-text">Chọn</div>
        <div className="line"></div>
        <div className={search.num === 0 ? "normal-box" : "chose-box"}></div>
        <div className={search.num === 1 ? "normal-box" : "chose-box"}></div>
        <div className={search.num === 2 ? "normal-box" : "chose-box"}></div>
      </div>
    </>
  );
};
export default SearchBar;
