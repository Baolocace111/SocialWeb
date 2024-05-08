import "./groupPost.scss";
import {
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen, faX } from "@fortawesome/free-solid-svg-icons";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
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

import Comments from "../../comments/Comments";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../../axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import Description from "../../post/desc";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import { useLanguage } from "../../../context/languageContext";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
const GroupPost = ({ post }) => {
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
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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
  };
  const handleDialogClose = () => {
    setOpenEdit(false);
  };

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    URL_OF_BACK_END + `posts/videopost/` + post.id
  );
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
        queryClient.invalidateQueries(["group-posts"]);
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
        queryClient.invalidateQueries(["group-posts"]);
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
        queryClient.invalidateQueries(["group-posts"]);
      },
    }
  );
  //End Use Mutation

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

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="group-post">
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
                  Save
                </Button>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Popover>
        </div>
        <div className="content">
          <Description text={post.desc}></Description>
          <Link to={`/seepost/${post.id}`}>
            {isVideoContent ? (
              <ReactPlayer
                key={post.id}
                url={URL_OF_BACK_END + `posts/videopost/` + post.id}
                playing={false}
                controls={true}
                className="react-player"
              />
            ) : (
              post.img && (
                <img
                  src={URL_OF_BACK_END + `posts/videopost/` + post.id}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/upload/errorImage.png";
                  }}
                  alt={""}
                />
              )
            )}
          </Link>
        </div>
        {!post.error && (
          <div className="post-info">
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
              {data?.length} {trl("Likes")}
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              {trl("See Comments")}
            </div>
          </div>
        )}
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default GroupPost;
