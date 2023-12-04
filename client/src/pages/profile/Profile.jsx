import "./profile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FriendList from "../../components/profileComponents/friendList/FriendList";
import FlipCube from "../../components/loadingComponent/flipCube/FlipCube";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userId] = useState(Number(useParams().userId));

  const { isLoading, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };
  const handleChat = () => {
    navigate(`/chat/${userId}`);
  };


  const classes = useStyles();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="profile">
      {isLoading ? (
        <FlipCube />
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <div className="profilePicContainer">
              <img src={"/upload/" + data.profilePic} alt="" className="profilePic" />
            </div>
          </div>

          <div className="uInfo">
            <div className="center">
              <span className="uName">{data.name}</span>
              <span className="uFriends">44 bạn bè</span>
            </div>
            {rIsLoading ? (
              "loading"
            ) : userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>
                <FontAwesomeIcon icon={faPenToSquare} />
                Chỉnh sửa trang cá nhân
              </button>
            ) : (
              <div>
                <button onClick={handleFollow}>
                  {relationshipData.includes(currentUser.id)
                    ? "Following"
                    : "Follow"}
                </button>
                <button onClick={handleChat}>Chat</button>
              </div>
            )}
          </div>

          <div className="menu">
            <Paper className={classes.root}>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="secondary"
                centered
              >
                <Tab style={{ fontWeight: "700" }} label="Bài viết" />
                <Tab style={{ fontWeight: "700" }} label="Giới thiệu" />
                <Tab style={{ fontWeight: "700" }} label="Bạn bè" />
                <Tab style={{ fontWeight: "700" }} label="Hình ảnh" />
                <Tab style={{ fontWeight: "700" }} label="Xem thêm" />
              </Tabs>
            </Paper>
          </div>

          {value === 0 && (
            <div className="profileContainer">
              <Posts userId={userId} />
            </div>
          )}
          {value === 1 && (
            <div className="profileContainer">
              <span>Đang xây dựng</span>
            </div>
          )}
          {value === 2 && (
            <div className="profileContainer">
              <FriendList user_id={userId} />
            </div>
          )}
          {value === 3 && (
            <div className="profileContainer">
              <span>Đang xây dựng</span>
            </div>
          )}
          {value === 4 && (
            <div className="profileContainer">
              <span>Đang xây dựng</span>
            </div>
          )}
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
