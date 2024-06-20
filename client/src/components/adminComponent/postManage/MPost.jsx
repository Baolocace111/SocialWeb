import { useState, useEffect, useContext } from "react";
import { URL_OF_BACK_END } from "../../../axios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/authContext";
import { makeRequest } from "../../../axios";
import EditIcon from "@mui/icons-material/Edit";

import { TextareaAutosize } from "@mui/material";
import Description from "../../post/desc";
import Link from "@mui/material/Link";
import ReactPlayer from "react-player";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import PopupWindow from "../../PopupComponent/PopupWindow";
import MiniPost from "../../post/MiniPost";
import Comments from "../../comments/Comments";
import moment from "moment";
import { useLanguage } from "../../../context/languageContext";

const MPost = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [, setMenuAnchor] = useState(null);
  const [, setDeleteImage] = useState(false);
  const [shareDesc, setShareDesc] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [openEdit] = useState(false);

  const { trl, language } = useLanguage();
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

  useEffect(() => {
    if (!openEdit) {
      setDeleteImage(false);
      setSelectedImage(URL_OF_BACK_END + `posts/videopost/` + post.id);
    }
  }, [openEdit, post]);

  //Handle openMenu

  const [, setSelectedImage] = useState(
    URL_OF_BACK_END + `posts/videopost/` + post.id
  );

  //End handleOpenMenu

  const { currentUser } = useContext(AuthContext);
  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  //End Use Mutation

  const handleShare = () => {
    setShareDesc(trl(""));
    setShowSharePopup(!showSharePopup);
    setMenuAnchor(null);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
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
                {post.name} - {post.id}
              </span>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
        <div className="content">
          <Description text={post.desc} />
          {post.img && (
            <Link to={`/seepost/${post.id}`}>
              {isVideoContent ? (
                <ReactPlayer
                  url={URL_OF_BACK_END + `posts/videopost/` + post.id}
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
            </Link>
          )}
        </div>
        {!post.error && (
          <div className="info">
            <div className="item">
              {isLoading ? (
                "loading"
              ) : data.includes(currentUser.id) ? (
                <FavoriteOutlinedIcon
                  className="shake-heart"
                  style={{ color: "red" }}
                />
              ) : (
                <FavoriteBorderOutlinedIcon className="white-color-heart" />
              )}
              {data?.length < 2
                ? trl([data?.length, " ", "Like"])
                : trl([data?.length, " ", "Likes"])}
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              {trl("See Comments")}
            </div>

            <PopupWindow handleClose={handleShare} show={showSharePopup}>
              <div>
                <EditIcon sx={{ marginRight: "8px", fontSize: "20px" }} />
                <span style={{ fontSize: "22px", fontWeight: "700" }}>
                  {trl("Share this post")}
                </span>
              </div>
              <hr />
              <div className="popup-content">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    margin: "10px 0 15px 10px",
                  }}
                >
                  <div
                    style={{
                      paddingRight: "15px",
                      display: "flex",
                      flex: "0 0 auto",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={
                        URL_OF_BACK_END + `users/profilePic/` + currentUser.id
                      }
                      style={{
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/upload/errorImage.png";
                      }}
                      alt={""}
                    />
                    <div
                      style={{
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {currentUser.name}
                    </div>
                  </div>
                </div>
                <TextareaAutosize
                  minRows={2}
                  placeholder={trl("Nhập nội mô tả của bạn")}
                  defaultValue={shareDesc}
                  onChange={(e) => setShareDesc(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    fontSize: "20px",
                    marginBottom: "-10px",
                  }}
                />
                <div
                  style={{
                    pointerEvents: "none",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <MiniPost post={post}></MiniPost>
                </div>
              </div>
              <hr />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "20px",
                }}
              >
                <button className="share">{trl("SHARE")}</button>
                <button className="cancel" onClick={handleShare}>
                  {trl("CANCEL")}
                </button>
              </div>
            </PopupWindow>
          </div>
        )}
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};
export default MPost;
