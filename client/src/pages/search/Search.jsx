import UserTab from "../../components/searchComponents/userTab/UserTab";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/searchComponents/searchBar/SearchBar";
import "./search.scss";
const Search = () => {
  const { searchText } = useParams();
  const search = { num: 0, text: searchText };
  //Gọi api
  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get("/users/searchuser/" + searchText).then((res) => {
      return res.data;
    })
  );
  return (
    <div>
      <SearchBar search={search}></SearchBar>
      <div className="search-container">
        <div className="search-text">Mọi người: {searchText}</div>
        <div className="cards">
          {error
            ? "Error!!!"
            : isLoading
            ? "loading"
            : data.map((user) => <UserTab user={user} key={user.id}></UserTab>)}
        </div>
      </div>
    </div>
  );
};
export default Search;
