import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { Button } from "@mui/material";
import { sendFriendRequest } from "../../../../../api/services/FriendshipService";
const UserTab = ({ user }) => {
  let componentToRender;
  sendFriendRequest=(userid)=>{
    
  }
  switch (user.friendStatus) {
    case 0:
      componentToRender = <Button onClick={() => sendFriendRequest(user.id)}>Kết bạn</Button>;
      break;
    case 1:
      componentToRender = <Button>Hủy lời mời</Button>;
      break;
    case 2:
      componentToRender = <div><Button>Đồng ý</Button> <Button>Từ chối</Button></div>;
      break;
    case 3:
      componentToRender = <Button>Unfriend</Button>;
      break;
    default:
      componentToRender = null;
      break;
  }
  
  return (
    <div className="user-container">
      <Link to={`/profile/${user.userId}`}>
        <img src={"/upload/"} alt="" />
        <span className="name">{user.name}</span>
      </Link>

      <div>{componentToRender}</div>
    </div>
  );
};
export default UserTab;
