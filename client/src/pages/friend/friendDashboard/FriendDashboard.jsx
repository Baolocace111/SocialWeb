import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import FriendList from "../../../components/profileComponents/friendList/FriendList";
const FriendDashBoard = () => {
  const { currentUser } = useContext(AuthContext);
  return <FriendList user_id={currentUser.id} />;
};
export default FriendDashBoard;
