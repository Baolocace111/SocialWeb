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
import {
  faTrashCan,
  faPen,
  faLock,
  faEarthAmericas,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
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
import Radio from "@mui/material/Radio";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest, URL_OF_BACK_END } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import MiniPost from "./MiniPost";
import { useLanguage } from "../../context/languageContext";
import { useEffect } from "react";
const SharedPost = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSeeEdit, setOpenSeeEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState(""); // State để lưu giá trị của Radio được chọn
  const [desc, setDesc] = useState(post.desc);
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
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );
  const {
    isLoading: isLoadingPost,
    error: errorPost,
    data: dataPost,
  } = useQuery(["shared-post" + post.id], () =>
    makeRequest.get("/posts/post/" + post.img).then((res) => {
      return res.data;
    })
  );

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleMenuClick = (event) => {
    if (post.userId === currentUser.id) {
      setMenuAnchor(event.currentTarget);
    }
  };
  const handleDialogOpen = () => {
    setOpenEdit(true);
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

  //Use Mutation
  const updateMutation = useMutation(
    (data) => {
      return makeRequest.put(`/posts/updatedesc`, data);
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
  //End Use Mutation

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
  const handleSave = () => {
    updateSeeMutation.mutate({ postId: post.id, status: selectedValue });
    setOpenSeeEdit(false);
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
              {post.userId === currentUser.id && (
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
                  }}
                >
                  <List>
                    <ListItemButton
                      selected={selectedValue === 0}
                      onClick={() => handleRadioChange(0)}
                    >
                      <ListItemIcon
                        style={{ fontSize: "23px", marginLeft: "-10px" }}
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
                          checked={selectedValue === 2}
                          onChange={() => handleRadioChange(2)}
                          name="abc"
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  </List>
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
                className="shake-heart"
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
                className="white-color-heart"
                onClick={handleLike}
              />
            )}
            {data?.length < 2
              ? trl([data?.length, " ", "Like"])
              : trl([data?.length, " ", "Likes"])}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {trl("See Comments")}
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};
export default SharedPost;
