import "./miniPost.scss";
import { URL_OF_BACK_END } from "../../axios";
import { Link } from "react-router-dom";
import moment from "moment";
import Description from "./desc";
import ReactPlayer from "react-player/lazy";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import { useEffect } from "react";
import { useLanguage } from "../../context/languageContext";
const MiniPost = ({ post }) => {
  const { language } = useLanguage();
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);
  const isVideoContent = post.img
    ? post.img.endsWith(".mp4") ||
      post.img.endsWith(".avi") ||
      post.img.endsWith(".mov")
    : false;

  return (
    <div className="mini-post">
      <div className="mini-container">
        <div className="mini-content">
          <Link to={`/seepost/${post.id}`}>
            {post.type === 2 && isVideoContent ? (
              <ReactPlayer
                key={post.id}
                url={URL_OF_BACK_END + "posts/videopost/" + post.id}
                playing={false}
                controls={true}
                width="100%"
                height="auto"
                className="react-player"
              />
            ) : (
              <img
                src={URL_OF_BACK_END + `posts/videopost/` + post.id}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt={""}
              />
            )}
          </Link>
        </div>
        <div className="userInfo">
          <img
            src={
              post.userId
                ? URL_OF_BACK_END + `users/profilePic/` + post.userId
                : "/upload/deadskull.png"
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={""}
          />
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
