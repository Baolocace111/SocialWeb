import "./post.scss";
import {
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopupWindow from "../PopupComponent/PopupWindow";
import {
  faTrashCan,
  faPen,
  faX,
  faLock,
  faEarthAmericas,
  faUserGroup,
  faUserNinja,
} from "@fortawesome/free-solid-svg-icons";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { TextareaAutosize } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";

import Comments from "../comments/Comments";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../axios";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import Description from "./desc";
import MiniPost from "./MiniPost";
import Private from "./Private";
import { Link } from "react-router-dom";
import ReactPlayer from 'react-player';

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [shareDesc, setShareDesc] = useState("");
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSeeEdit, setOpenSeeEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0); // State để lưu giá trị của Radio được chọn
  const privateRef = useRef(null);

  const isVideoContent = post.img ? post.img.endsWith('.mp4') || post.img.endsWith('.avi') || post.img.endsWith('.mov') : false;

  useEffect(() => {
    if (!openEdit) {
      setDeleteImage(false);
      setSelectedImage(URL_OF_BACK_END + `posts/videopost/` + post.id);
    }
  }, [openEdit, post.id]);

  //Handle openMenu
  const handleMenuClick = (event) => {
    if (post.userId === currentUser.id) {
      setMenuAnchor(event.currentTarget);
    }
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDialogOpen = () => {
    setOpenEdit(true);
    console.log(selectedImage);
  };
  const handleDialogClose = () => {
    setOpenEdit(false);
  };

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };
  const handleSeeDialogOpen = () => {
    setOpenSeeEdit(true);
    setSelectedValue(post.status);
  };
  const handleSeeDialogClose = () => {
    setOpenSeeEdit(false);
  };

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(URL_OF_BACK_END + `posts/videopost/` + post.id);
  const [desc, setDesc] = useState(post.desc);
  const handleImageChange = (e) => {
    if (deleteImage) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      console.log(selectedImage);
    }
  };
  //End handleOpenMenu

  const { currentUser } = useContext(AuthContext);
  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();
  //Use Mutation
  const shareMutation = useMutation(
    (data) => {
      return makeRequest.post("/posts/share", { post: data });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
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
      return makeRequest.put(`/posts/updateimage/${data.postId}`, data.formData);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
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
  //End Use Mutation

  const handleShare = () => {
    setShareDesc("");
    setShowSharePopup(!showSharePopup);
    setMenuAnchor(null);
  };
  const handleShareApi = () => {
    shareMutation.mutate({
      desc: shareDesc,
      shareId: post.id,
    });
    handleShare();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (deleteImage) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        await updateVideoMutation.mutateAsync({ postId: post.id, formData });
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    else {
      updateMutation.mutate({ postId: post.id, desc: desc });
    }
    setFile(null);
    setOpenEdit(false);
    setMenuAnchor(null);
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

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
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
          </div>
          <MoreHorizIcon
            style={{
              fontSize: "28px",
              cursor: "pointer",
              borderRadius: "50%",
              transition: "background-color 0.3s",
              alignItems: "center",
              padding: "3px",
            }}
            className="more"
            onClick={handleMenuClick}
          />
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
            <List>
              <ListItemButton onClick={handleDialogOpen}>
                <ListItemIcon
                  style={{ fontSize: "18px", marginRight: "-25px" }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </ListItemIcon>
                <ListItemText
                  primary="Chỉnh sửa bài viết"
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
                  primary="Chỉnh sửa đối tượng"
                  style={{ fontSize: "14px", marginRight: "50px" }}
                />
              </ListItemButton>
              <Divider />
              {post.userId === currentUser.id && (
                <ListItemButton onClick={handleDelete}>
                  <ListItemIcon
                    style={{ fontSize: "18px", marginRight: "-25px" }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Xóa bài viết"
                    style={{ fontSize: "14px", marginRight: "50px" }}
                  />
                </ListItemButton>
              )}
            </List>

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
                    Chỉnh sửa bài viết
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
                      src={"/upload/" + post.profilePic}
                      style={{
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                      }}
                      alt="User"
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
                  placeholder="Nhập nội dung mới của bạn"
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

                {selectedImage && !isVideoContent && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      style={{ position: "relative", display: "inline-flex" }}
                    >
                      <img
                        src={selectedImage}
                        alt=""
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
                        }}
                      >
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  </div>
                )}

                {deleteImage && (
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
                  Save
                </Button>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
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
                    Chỉnh sửa đối tượng
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
                        <Typography variant="h6">Công khai</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Ai trên TinySocial cũng sẽ nhìn thấy bài viết này
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
                        <Typography variant="h6">Bạn bè</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Bạn bè của bạn trên TinySocial
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
                        <Typography variant="h6">Bạn bè cụ thể</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Chỉ định riêng những người bạn muốn
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
                        <Typography variant="h6">Chỉ mình tôi</Typography>
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
                  Save
                </Button>
                <Button onClick={handleSeeDialogClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Popover>
        </div>
        <div className="content">
          <Description text={post.desc}></Description>
          <Link to={`/seepost/${post.id}`}>
            {post.type === 2 && isVideoContent ?
              <ReactPlayer url={URL_OF_BACK_END + `posts/videopost/` + post.id} playing={true} controls={true} className="react-player" />
              : <img src={URL_OF_BACK_END + `posts/videopost/` + post.id} alt="" />}
          </Link>
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
                  onClick={handleLike}
                />
              ) : (
                <FavoriteBorderOutlinedIcon
                  className="white-color-heart"
                  onClick={handleLike}
                />
              )}
              {data?.length} Likes
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              See Comments
            </div>
            <div className="item" onClick={() => handleShare()}>
              <ShareOutlinedIcon />
              Share
            </div>
            <PopupWindow handleClose={handleShare} show={showSharePopup}>
              <div>
                <EditIcon sx={{ marginRight: "8px", fontSize: "20px" }} />
                <span style={{ fontSize: "22px", fontWeight: "700" }}>
                  Share this post
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
                      src={"/upload/" + currentUser.profilePic}
                      style={{
                        borderRadius: "50%",
                        width: "45px",
                        height: "45px",
                      }}
                      alt="User"
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
                  placeholder="Nhập nội mô tả của bạn"
                  defaultValue={shareDesc}
                  onChange={(e) => setShareDesc(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    fontSize: "20px",
                    marginBottom: "-10px"
                  }}
                />
                <div style={{ pointerEvents: "none", display: "flex", justifyContent: "center" }}>
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
                <button className="share" onClick={handleShareApi}>
                  SHARE
                </button>
                <button className="cancel" onClick={handleShare}>
                  CANCEL
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

export default Post;