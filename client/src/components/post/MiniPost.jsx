import "./miniPost.scss";
import { URL_OF_BACK_END } from "../../axios";
import { Link } from "react-router-dom";
import moment from "moment";
import Description from "./desc";
import ReactPlayer from "react-player";

const MiniPost = ({ post }) => {

  return (
    <div className="mini-post">
      <div className="mini-container">
        <div className="mini-content">
          <Link to={`/seepost/${post.id}`}>
            {post.type === 2 ?
              <ReactPlayer
                url={URL_OF_BACK_END + "posts/videopost/" + post.id}
                playing={true}
                controls={true}
                width="100%"
                height="auto"
                className="react-player" />
              : <img src={"/upload/" + post.img} alt="" />}
          </Link>
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
