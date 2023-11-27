import "./post.scss";
import moment from "moment";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Comments from "../comments/Comments";
import {
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import Description from "./desc";
import FlipCube from "../loadingComponent/flipCube/FlipCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import ThreePointLoading from "../loadingComponent/threepointLoading/ThreePointLoading";
import { TextareaAutosize } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import MiniPost from "./MiniPost";

const SharedPost = ({ post }) => {
  //console.log(dataPost);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [openEdit, setOpenEdit] = useState(false);
  const [desc, setDesc] = useState(post.desc);
  const queryClient = useQueryClient();
  const handleDialogOpen = () => {
    setOpenEdit(true);
  };
  const handleDialogClose = () => {
    setOpenEdit(false);
  };
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };
  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    updateMutation.mutate({ postId: post.id, desc: desc });

    setOpenEdit(false);
    setMenuAnchor(null);
  };
  const updateMutation = useMutation(
    (data) => {
      return makeRequest.put(`/posts/share`, data);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const {
    isLoading: isLoading,
    error: error,
    data: data,
  } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );
  const {
    isLoading: isLoadingPost,
    error: errorPost,
    data: dataPost,
  } = useQuery(["post"], () =>
    makeRequest.get("/posts/post/" + post.img).then((res) => {
      return res.data;
    })
  );
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
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleMenuClick = (event) => {
    if (post.userId === currentUser.id) {
      setMenuAnchor(event.currentTarget);
    }
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
                  primary="Chỉnh sửa"
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
          {errorPost ? (
            "Something went wrong!!!"
          ) : isLoadingPost ? (
            <FlipCube />
          ) : (
            <MiniPost post={dataPost} />
          )}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              <ThreePointLoading></ThreePointLoading>
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
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};
export default SharedPost;
