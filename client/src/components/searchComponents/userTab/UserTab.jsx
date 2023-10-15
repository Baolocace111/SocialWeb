import { Link } from "react-router-dom";
const UserTab = ({ user }) => {
  return (
    <div className="user-container">
      <Link to={`/profile/${user.userId}`}>
        <img src={"/upload/"} alt="" />
        <span className="name">{user.name}</span>
      </Link>
      <button>Add friend</button>
    </div>
  );
};
export default UserTab;
