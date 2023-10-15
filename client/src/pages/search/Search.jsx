import UserTab from "../../components/searchComponents/userTab/UserTab";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
const Search = () => {
  const { searchText } = useParams();
  // //Dòng này chỉ để test
  // const userJson = '{"userId": 123, "name": "John Doe", "profileImage": "/upload/avatar.jpg"}';
  // const user= JSON.parse(userJson);

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
