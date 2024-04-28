import "./detailedPost.scss";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThreePointLoading from "../../loadingComponent/threepointLoading/ThreePointLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";

import Description from "../desc";
import Comments from "../../comments/Comments";
import { makeRequest, URL_OF_BACK_END } from "../../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { useLanguage } from "../../../context/languageContext";
import { useEffect } from "react";
const DetailedPost = ({ post }) => {
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") moment.locale("ja");
    if (language === "vn") moment.locale("vi");
    else moment.locale("en");
  }, []);
  const { currentUser } = useContext(AuthContext);
  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const handleCloseClick = () => {
    navigate(-1);
  };

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  return (
    <div className="detail-post">
      <div className="image-area">
        <div className="action-button">
          <FontAwesomeIcon onClick={handleCloseClick} icon={faX} />
          {post.type === 0 ? (
            <div className="zoom">
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
            </div>
          ) : (
            <div></div>
          )}
        </div>
        {isVideo(post.img) ? (
          <ReactPlayer
            url={URL_OF_BACK_END + "posts/videopost/" + post.id}
            playing={true}
            controls={true}
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
      </div>
      <div className="content-area">
        <div className="userInfo">
          <img
            src={URL_OF_BACK_END + `users/profilePic/` + post.userId}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={""}
          />
          <div className="details">
            <span
              className="name"
              onClick={() => {
                window.location.href = `/profile/${post.userId}`;
              }}
            >
              {post.name}
            </span>
            <span className="date">{moment(post.createdAt).fromNow()}</span>
          </div>
          <div className="more">
            <MoreHorizIcon />
          </div>
        </div>
        <div className="post-content">
          <Description text={post.desc}></Description>
        </div>
        <div className="post-info">
          <div className="item">
            {isLoading ? (
              <ThreePointLoading />
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length < 2
              ? trl([data?.length, " ", "Like"])
              : trl([data?.length, " ", "Likes"])}
          </div>
          <div className="item">
            <TextsmsOutlinedIcon />
            {trl("See Comments")}
          </div>
        </div>
        <div className="post-comment">
          <Comments postId={post.id} />
        </div>
      </div>
    </div>
  );
};
export default DetailedPost;

function isVideo(img) {
  const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".mkv"];
  const fileExtension = img.substring(img.lastIndexOf("."));
  return videoExtensions.includes(fileExtension.toLowerCase());
}
