import "./miniPost.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import Description from "./desc";

const MiniPost = ({ post }) => {

  return (
    <div className="mini-post">
      <div className="mini-container">
        <div className="mini-content">
          <img src={"/upload/" + post.img} onClick={() => window.location.href = `/seepost/${post.id}`} alt="" />
        </div>
        <div className="userInfo">
          <img src={"/upload/" + post.profilePic} alt="" />
          <div className="details">
            <Link
              target="_blank"
              to={`/profile/${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="name">{post.name}</span>
            </Link>
            <span className="date">{moment(post.createdAt).fromNow()}</span>
          </div>
        </div>
        <Description text={post.desc}></Description>
      </div>
    </div>
  );
};

export default MiniPost;
