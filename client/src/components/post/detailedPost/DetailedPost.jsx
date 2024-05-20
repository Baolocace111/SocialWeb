import "./detailedPost.scss";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThreePointLoading from "../../loadingComponent/threepointLoading/ThreePointLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import { Popover } from "@mui/material";
import PopupWindow from "../../PopupComponent/PopupWindow";
import DialogActions from "@mui/material/DialogActions";
import PostShare from "../../postPopup/shareComponent/PostShare";
import PostReporter from "../../postPopup/reportComponent/postReporter/PostReporter";
import {
  faX,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faDownLeftAndUpRightToCenter,
} from "@fortawesome/free-solid-svg-icons";
import DialogTitle from "@mui/material/DialogTitle";
import Description from "../desc";
import Comments from "../../comments/Comments";
import { TextareaAutosize } from "@mui/material";
import { makeRequest, URL_OF_BACK_END } from "../../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import DialogContent from "@mui/material/DialogContent";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { useLanguage } from "../../../context/languageContext";
import { useEffect } from "react";
import { useState } from "react";
import { List } from "@mui/material";
import Radio from "@mui/material/Radio";
import Dialog from "@mui/material/Dialog";
import { ListItemButton } from "@mui/material";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import { ListItemText, ListItemIcon } from "@mui/material";
import {
  faPen,
  faLock,
  faTrashCan,
  faEarthAmericas,
  faUserGroup,
  faUserNinja,
} from "@fortawesome/free-solid-svg-icons";
import Divider from "@mui/material/Divider";
import Private from "../Private";
import { useRef } from "react";
const DetailedPost = ({ post }) => {
  const { trl, language } = useLanguage();
  const [desc, setDesc] = useState(post.desc);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSeeEdit, setOpenSeeEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    URL_OF_BACK_END + `posts/videopost/` + post.id
  );
  const handleShare = () => {
    setShowSharePopup(!showSharePopup);
  };
  const privateRef = useRef(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const isVideoContent = post.img
    ? post.img.endsWith(".mp4") ||
      post.img.endsWith(".avi") ||
      post.img.endsWith(".mov")
    : false;

  const [file, setFile] = useState(null);
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);
  const handleImageChange = (e) => {
    if (deleteImage) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      console.log(selectedImage);
    }
  };
  const handleSave = () => {
    if (privateRef.current && privateRef.current.savePrivate) {
      privateRef.current.savePrivate();
    }
    const updatedSelectedValue = selectedValue === 3 ? 2 : selectedValue;
    updateSeeMutation.mutate({ postId: post.id, status: updatedSelectedValue });
    setOpenSeeEdit(false);
    setMenuAnchor(null);
  };
  const updateSeeMutation = useMutation(
    (data) => {
      return makeRequest.put(`/posts/private/${data.postId}`, data);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const { currentUser } = useContext(AuthContext);
  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };
  const handleUpdate = async (e) => {
    updateMutation.mutate({ postId: post.id, desc: desc });
    if (deleteImage) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        await updateVideoMutation.mutateAsync({ postId: post.id, formData });
      } catch (error) {
        console.error(error);
      }
    }
    window.location.reload();
    setFile(null);
    setOpenEdit(false);
    setMenuAnchor(null);
  };
  const updateMutation = useMutation(
    async (data) => {
      try {
        return await makeRequest.put(`/posts/updatedesc`, data);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const updateVideoMutation = useMutation(
    async (data) => {
      return await makeRequest.put(
        `/posts/updateimage/${data.postId}`,
        data.formData
      );
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const queryClient = useQueryClient();
  const handleDialogOpen = () => {
    setOpenEdit(true);
  };
  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };
  const handleDialogClose = () => {
    setOpenEdit(false);
  };
  const handleReport = () => {
    setShowReportPopup(!showReportPopup);
  };
  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleSeeDialogClose = () => {
    setOpenSeeEdit(false);
  };
  const navigate = useNavigate();
  const handleCloseClick = () => {
    navigate(-1);
  };
  const handleSeeDialogOpen = () => {
    setOpenSeeEdit(true);
    setSelectedValue(post.status);
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
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
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
          <div className="more" onClick={handleMenuClick}>
            <MoreHorizIcon />
          </div>
          <Popover
            open={Boolean(menuAnchor)}
            anchorEl={menuAnchor}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {post.userId === currentUser.id ? (
              <List>
                <ListItemButton onClick={handleDialogOpen}>
                  <ListItemIcon
                    style={{ fontSize: "18px", marginRight: "-25px" }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </ListItemIcon>
                  <ListItemText
                    primary={trl("Chỉnh sửa bài viết")}
                    style={{ fontSize: "14px", marginRight: "50px" }}
                  />
                </ListItemButton>
                <Divider />
                <ListItemButton onClick={handleSeeDialogOpen}>
                  <ListItemIcon
                    style={{ fontSize: "18px", marginRight: "-25px" }}
                  >
                    <FontAwesomeIcon icon={faLock} />
                  </ListItemIcon>
                  <ListItemText
                    primary={trl("Chỉnh sửa đối tượng")}
                    style={{ fontSize: "14px", marginRight: "50px" }}
                  />
                </ListItemButton>
                <Divider />

                <ListItemButton onClick={handleDelete}>
                  <ListItemIcon
                    style={{ fontSize: "18px", marginRight: "-25px" }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </ListItemIcon>
                  <ListItemText
                    primary={trl("Xóa bài viết")}
                    style={{ fontSize: "14px", marginRight: "50px" }}
                  />
                </ListItemButton>
              </List>
            ) : (
              <List>
                <ListItemButton className="item" onClick={() => handleReport()}>
                  <ListItemIcon
                    style={{ fontSize: "18px", marginRight: "-25px" }}
                  >
                    <ReportOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={trl("Report")}
                    style={{ fontSize: "14px", marginRight: "50px" }}
                  />
                </ListItemButton>
              </List>
            )}

            <Dialog open={openEdit} onClose={handleDialogClose}>
              <DialogTitle
                sx={{ m: 0, p: 2, display: "flex", mt: "-5px", mb: "-10px" }}
              >
                <Typography
                  variant="title1"
                  style={{ flexGrow: 1, textAlign: "center" }}
                >
                  <EditIcon sx={{ marginRight: "8px", fontSize: "20px" }} />
                  <span style={{ fontSize: "22px", fontWeight: "700" }}>
                    {trl("Chỉnh sửa bài viết")}
                  </span>
                </Typography>
              </DialogTitle>
              <Divider />
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    margin: "-10px 0 15px -10px",
                  }}
                >
                  <div
                    style={{
                      paddingRight: "15px",
                      display: "flex",
                      flex: "0 0 auto",
                    }}
                  >
                    <img
                      src={URL_OF_BACK_END + `users/profilePic/` + post.userId}
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
                  </div>
                  <div
                    style={{
                      flex: "1",
                    }}
                  >
                    <div style={{ fontWeight: "700" }}>{post.name}</div>
                    <span>{moment(post.createdAt).fromNow()}</span>
                  </div>
                </div>
                <TextareaAutosize
                  minRows={2}
                  placeholder={trl("Nhập nội mô tả của bạn")}
                  defaultValue={post.desc}
                  onChange={(e) => setDesc(e.target.value)}
                  style={{
                    width: "550px",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    fontSize: "20px",
                  }}
                />

                {post.img && selectedImage && !isVideoContent && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      style={{ position: "relative", display: "inline-flex" }}
                    >
                      <img
                        src={selectedImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/upload/errorImage.png";
                        }}
                        alt={""}
                        style={{ maxWidth: "400px" }}
                      />
                      <button
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          cursor: "pointer",
                          zIndex: "1",
                        }}
                        onClick={() => {
                          setSelectedImage(null);
                          setDeleteImage(true);
                          console.log(file);
                        }}
                      >
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  </div>
                )}

                {deleteImage && !selectedImage && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      handleImageChange(e);
                    }}
                  />
                )}
              </DialogContent>
              <Divider />
              <DialogActions>
                <Button onClick={handleUpdate} color="primary">
                  {trl("Save")}
                </Button>
                <Button onClick={handleDialogClose} color="secondary">
                  {trl("Cancel")}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openSeeEdit} onClose={handleSeeDialogClose}>
              <DialogTitle
                sx={{ m: 0, p: 2, display: "flex", mt: "-5px", mb: "-10px" }}
              >
                <Typography
                  variant="title1"
                  style={{ flexGrow: 1, textAlign: "center" }}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "8px", fontSize: "20px" }}
                    icon={faLock}
                  />
                  <span style={{ fontSize: "22px", fontWeight: "700" }}>
                    {trl("Chỉnh sửa đối tượng")}
                  </span>
                </Typography>
              </DialogTitle>
              <Divider />
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    margin: "-10px 0 0 0",
                    flexDirection: "column",
                  }}
                >
                  <List>
                    <ListItemButton
                      selected={selectedValue === 0}
                      onClick={() => handleRadioChange(0)}
                    >
                      <ListItemIcon
                        style={{ fontSize: "21px", marginLeft: "-10px" }}
                      >
                        <div
                          style={{
                            alignItems: "center",
                            borderRadius: "50%",
                            backgroundColor: "#DADDE1",
                            width: "52px",
                            height: "52px",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          <FontAwesomeIcon icon={faEarthAmericas} />
                        </div>
                      </ListItemIcon>
                      <ListItemText
                        style={{ marginLeft: "20px", marginRight: "80px" }}
                      >
                        <Typography variant="h6">{trl("Công khai")}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {trl(
                            "Ai trên TinySocial cũng sẽ nhìn thấy bài viết này"
                          )}
                        </Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 0}
                          onChange={() => handleRadioChange(0)}
                          name="abc"
                        />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton
                      selected={selectedValue === 1}
                      onClick={() => handleRadioChange(1)}
                    >
                      <ListItemIcon
                        style={{ fontSize: "18px", marginLeft: "-10px" }}
                      >
                        <div
                          style={{
                            alignItems: "center",
                            borderRadius: "50%",
                            backgroundColor: "#DADDE1",
                            width: "52px",
                            height: "52px",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          <FontAwesomeIcon icon={faUserGroup} />
                        </div>
                      </ListItemIcon>
                      <ListItemText
                        style={{ marginLeft: "20px", marginRight: "80px" }}
                      >
                        <Typography variant="h6">{trl("Bạn bè")}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {trl("Bạn bè của bạn trên TinySocial")}
                        </Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 1}
                          onChange={() => handleRadioChange(1)}
                          name="abc"
                        />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton
                      selected={selectedValue === 2}
                      onClick={() => handleRadioChange(2)}
                    >
                      <ListItemIcon
                        style={{ fontSize: "20px", marginLeft: "-10px" }}
                      >
                        <div
                          style={{
                            alignItems: "center",
                            borderRadius: "50%",
                            backgroundColor: "#DADDE1",
                            width: "52px",
                            height: "52px",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          <FontAwesomeIcon icon={faUserNinja} />
                        </div>
                      </ListItemIcon>
                      <ListItemText
                        style={{ marginLeft: "20px", marginRight: "80px" }}
                      >
                        <Typography variant="h6">
                          {trl("Bạn bè cụ thể")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {trl("Chỉ định riêng những người bạn muốn")}
                        </Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 2}
                          onChange={() => handleRadioChange(2)}
                          name="abc"
                        />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton
                      selected={selectedValue === 3}
                      onClick={() => handleRadioChange(3)}
                    >
                      <ListItemIcon
                        style={{ fontSize: "18px", marginLeft: "-10px" }}
                      >
                        <div
                          style={{
                            alignItems: "center",
                            borderRadius: "50%",
                            backgroundColor: "#DADDE1",
                            width: "52px",
                            height: "52px",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          <FontAwesomeIcon icon={faLock} />
                        </div>
                      </ListItemIcon>
                      <ListItemText
                        style={{ marginLeft: "20px", marginRight: "80px" }}
                      >
                        <Typography variant="h6">
                          {trl("Chỉ mình tôi")}
                        </Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 3}
                          onChange={() => handleRadioChange(3)}
                          name="abc"
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  </List>
                  {selectedValue === 2 ? (
                    <Private ref={privateRef} post_id={post.id}></Private>
                  ) : (
                    ""
                  )}
                </div>
              </DialogContent>
              <Divider />
              <DialogActions>
                <Button onClick={handleSave} color="primary">
                  {trl("Save")}
                </Button>
                <Button onClick={handleSeeDialogClose} color="secondary">
                  {trl("Cancel")}
                </Button>
              </DialogActions>
            </Dialog>
          </Popover>
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
        <PopupWindow handleClose={handleShare} show={showSharePopup}>
          <PostShare
            post={post}
            setShowSharePopup={setShowSharePopup}
            showSharePopup={showSharePopup}
          />
        </PopupWindow>
        <PopupWindow show={showReportPopup} handleClose={handleReport}>
          <PostReporter
            post={post}
            setShowReportPopup={setShowReportPopup}
            showReportPopup={showReportPopup}
          />
        </PopupWindow>
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
