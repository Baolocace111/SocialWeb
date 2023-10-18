import UserTab from "../../components/searchComponents/userTab/UserTab";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
const Search = () => {
  const { searchText } = useParams();
  //Gọi api
  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get("/users/searchuser/" + searchText).then((res) => {
      return res.data;
    })
  );
  return (
    <div>
      <div>
        <span>Bạn đang tìm kiếm: {searchText}</span>
      </div>
      <div>
        {error ?"Error!!!":isLoading?"loading":data.map((user)=><UserTab user={user} key={user.id}></UserTab>)}
      </div>
    </div>
  );
};
export default Search;
