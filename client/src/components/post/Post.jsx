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
import { faTrashCan, faPen, faX, faLock, faEarthAmericas, faUserGroup } from "@fortawesome/free-solid-svg-icons";
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
import Radio from '@mui/material/Radio';

import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Description from "./desc";
import MiniPost from "./MiniPost";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [shareDesc, setShareDesc] = useState("");
  //Handle openMenu
  const handleMenuClick = (event) => {
    if (post.userId === currentUser.id) {
      setMenuAnchor(event.currentTarget);
    }
  };
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [openSeeEdit, setOpenSeeEdit] = useState(false);
  const handleDialogOpen = () => {
    setOpenEdit(true);
  };
  const handleDialogClose = () => {
    setOpenEdit(false);
  };

  const [selectedValue, setSelectedValue] = useState(''); // State để lưu giá trị của Radio được chọn
  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };
  const handleSeeDialogOpen = () => {
    setOpenSeeEdit(true);
  };
  const handleSeeDialogClose = () => {
    setOpenSeeEdit(false);
  };

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/upload/" + post.img);
  const [desc, setDesc] = useState(post.desc);
  const handleImageChange = (e) => {
    if (deleteImage) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  //

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );
  const handleShare = () => {
    setShareDesc("");
    setShowSharePopup(!showSharePopup);
  };
  const queryClient = useQueryClient();

  //Use Mutation
  const Sharemtation = useMutation(
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
    (data) => {
      return makeRequest.put(`/posts/update/${data.postId}`, data);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleShareApi = () => {
    Sharemtation.mutate({
      desc: shareDesc,
      shareId: post.id,
    });
    handleShare();
  };
  //End use Mutation

  const handleUpdate = async (e) => {
    e.preventDefault();
    let imgUrl = post.img;
    if (file) imgUrl = await upload();
    updateMutation.mutate({ postId: post.id, desc, img: imgUrl });
    setFile(null);
    setOpenEdit(false);
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
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
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

                {selectedImage && (
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
                  <FontAwesomeIcon style={{ marginRight: "8px", fontSize: "20px" }} icon={faLock} />
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
                  }}>
                  <List>
                    <ListItemButton onClick={() => handleRadioChange('public')}>
                      <ListItemIcon style={{ fontSize: "23px", marginLeft: "-10px" }}>
                        <div
                          style={{
                            alignItems: "center", borderRadius: "50%",
                            backgroundColor: "#DADDE1", width: "52px", height: "52px",
                            justifyContent: "center", display: "flex"
                          }}>
                          <FontAwesomeIcon icon={faEarthAmericas} />
                        </div>
                      </ListItemIcon>
                      <ListItemText style={{ marginLeft: "20px", marginRight: "80px" }}>
                        <Typography variant="h6">Công khai</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Ai trên TinySocial cũng sẽ nhìn thấy bài viết này
                        </Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 'public'}
                          onChange={() => handleRadioChange('public')}
                          name="abc" />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton onClick={() => handleRadioChange('friends')}>
                      <ListItemIcon style={{ fontSize: "20px", marginLeft: "-10px" }}>
                        <div
                          style={{
                            alignItems: "center", borderRadius: "50%",
                            backgroundColor: "#DADDE1", width: "52px", height: "52px",
                            justifyContent: "center", display: "flex"
                          }}>
                          <FontAwesomeIcon icon={faUserGroup} />
                        </div>
                      </ListItemIcon>
                      <ListItemText style={{ marginLeft: "20px", marginRight: "80px" }}>
                        <Typography variant="h6">Bạn bè</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Bạn bè của bạn trên TinySocial
                        </Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 'friends'}
                          onChange={() => handleRadioChange('friends')}
                          name="abc" />
                      </ListItemIcon>
                    </ListItemButton>
                    <ListItemButton onClick={() => handleRadioChange('only-me')}>
                      <ListItemIcon style={{ fontSize: "20px", marginLeft: "-10px" }}>
                        <div
                          style={{
                            alignItems: "center", borderRadius: "50%",
                            backgroundColor: "#DADDE1", width: "52px", height: "52px",
                            justifyContent: "center", display: "flex"
                          }}>
                          <FontAwesomeIcon icon={faLock} />
                        </div>
                      </ListItemIcon>
                      <ListItemText style={{ marginLeft: "20px", marginRight: "80px" }}>
                        <Typography variant="h6">Chỉ mình tôi</Typography>
                      </ListItemText>
                      <ListItemIcon>
                        <Radio
                          checked={selectedValue === 'only-me'}
                          onChange={() => handleRadioChange('only-me')}
                          name="abc" />
                      </ListItemIcon>
                    </ListItemButton>
                  </List>
                </div>
              </DialogContent>
              <Divider />
              <DialogActions>
                <Button color="primary">
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
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
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
            <div>
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
                }}
              />
              <div style={{ pointerEvents: "none" }}>
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
              <button
                className="share"
                onClick={handleShareApi}
              >
                SHARE
              </button>
              <button
                className="cancel"
                onClick={handleShare}
              >
                CANCEL
              </button>
            </div>
          </PopupWindow>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div >
  );
};

export default Post;
