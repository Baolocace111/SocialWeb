import UserTab from "../../components/searchComponents/userTab/UserTab";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import NineCube from "../../components/loadingComponent/nineCube/NineCube";
import "./search.scss";

const Search = () => {
  const { searchText } = useParams();

  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get("/users/searchuser/" + searchText).then((res) => {
      return res.data;
    })
  );
  return (
    <div className="search-container">
      <div className="search-text">Mọi người</div>
      <div className="cards">
        {error ? (
          "Error!!!"
        ) : isLoading ? (
          <NineCube />
        ) : (
          data.map((user) => <UserTab user={user} key={user.id}></UserTab>)
        )}
      </div>
    </div>
  );
};
export default Search;
