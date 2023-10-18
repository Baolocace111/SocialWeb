import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
const UserTab = ({ user }) => {
  const { data, isLoading, isError } = useQuery("friendship", async () => {
    const response = await makeRequest.get("/friendship/22");
    return response.data;
  });
  return (
    <div className="user-container">
      <Link to={`/profile/${user.userId}`}>
        <img src={"/upload/"} alt="" />
        <span className="name">{user.name}</span>
      </Link>
      <span>{data}</span>
      <div>
        {isError ? (
          isError.valueOf()
        ) : isLoading ? (
          "loading"
        ) : data.value === -1 ? (
          " is you "
        ) : data.value === 0 ? (
          <button>Add Friend</button>
        ) : data.value === 1 ? (
          <button>Cancel Invitation</button>
        ) : data.value === 2 ? (
          <>
            <button>Accept</button>
            <button>Deny</button>
          </>
        ) : data.value === 3 ? (
          <button>Unfriend</button>
        ) : (
          "Lỗi mịa rồi"
        )}
      </div>
    </div>
  );
};
export default UserTab;
