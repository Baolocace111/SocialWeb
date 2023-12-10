import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import {
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListBoxChat from "./ListBoxChat";
import {
  faArrowRightFromBracket,
  faCircleExclamation,
  faGear,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import ListFriendRequest from "./ListFriendRequest";
import { makeRequest } from "../../axios";
import ListNotification from "./ListNotification";
import ListMessages from "./ListMessages";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [content, setContent] = useState("");
  const [request_number, setRequestNumber] = useState(0);
  const [notification_number, setNotificationNumber] = useState(0);
  const [ws, setWS] = useState(null);

  const update_request_number = async () => {
    try {
      const response = await makeRequest.get("/friendship/count");

      setRequestNumber(response.data); // Hoặc request_number = response.data nếu đây là biến ngoài hàm
    } catch (error) {
      setRequestNumber(-1); // Xử lý lỗi và gán giá trị mặc định
    }
  };
  const update_notification_number = async () => {
    try {
      const res = await makeRequest.get("/notifications/count");
      setNotificationNumber(res.data);
    } catch (error) {
      setNotificationNumber(-1);
    }
  };

  if (!ws) {
    const socket = new WebSocket(`ws://localhost:3030/index`);
    socket.onopen = () => {
      console.log("Connected");
    };
    socket.onmessage = (event) => {
      if (event.data === "A Request has sent or cancelled") {
        update_request_number();
      } else if (event.data === "New notification") {
        //console.log("OK");
        update_notification_number();
      } else if (event.data === "New message or seen") {
        updateMessage();
      }
    };
    socket.onclose = () => {
      console.log("Closed");
    };
    setWS(socket);
  }

  update_request_number();
  update_notification_number();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post("/auth/logout");
      logout();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePopover = (event) => {
    event.stopPropagation();
    const iconId = event.currentTarget.id;
    let contentType = null;
    switch (iconId) {
      case "friend-icon":
        contentType = "friend";
        break;
      case "chat-icon":
        contentType = "chat";
        break;
      case "noti-icon":
        contentType = "noti";
        break;
      case "profile":
        contentType = "profile";
        break;
      default:
        break;
    }
    iconId === "profile" ? setAnchorEl(event.currentTarget.parentElement.parentElement)
      : setAnchorEl(event.currentTarget.parentElement.parentElement.parentElement);
    setContent(contentType);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      window.location.href = `/search/${searchText}/people`;
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  ///Show messages in navbar
  const [mess, setMess] = useState(null);
  let [messLoading, setMessLoading] = useState(true);
  const [messError, setMessError] = useState(null);
  const updateMessage = () => {
    //console.log("call");
    makeRequest
      .get("/messages/lastest")
      .then((res) => {
        setMess(res.data);
      })
      .catch((err) => {
        setMessError(err);
      })
      .finally(() => {
        //console.log("call");
        setMessLoading(false);
      });
  };
  useEffect(() => {
    if (messLoading) {
      updateMessage();
    }
  }, [messLoading]);

  return (
    <div className="navbar">
      <ListBoxChat></ListBoxChat>
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>TinySocial</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon onClick={handleSearch} />
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <div className="right">
        <div className="icon-container">
          <div className={request_number !== 0 ? "number" : "non-number"}>
            {request_number > 9 ? "9+" : request_number}
          </div>
          <PersonOutlinedIcon
            className="icon"
            onClick={handlePopover}
            style={{ cursor: "pointer", fontSize: "28px" }}
            id="friend-icon"
          />
        </div>
        <div className="icon-container">
          {messError ? (
            <div className="number">X</div>
          ) : messLoading ? (
            <div className="number">...</div>
          ) : (
            <div className={mess.number !== 0 ? "number" : "non-number"}>
              {mess.number > 9 ? "9+" : mess.number}
            </div>
          )}
          <EmailOutlinedIcon
            className="icon"
            onClick={handlePopover}
            style={{ cursor: "pointer", fontSize: "28px" }}
            id="chat-icon"
          />
        </div>
        <div className="icon-container">
          <div className={notification_number !== 0 ? "number" : "non-number"}>
            {notification_number > 9 ? "9+" : notification_number}
          </div>
          <NotificationsOutlinedIcon
            className="icon"
            onClick={handlePopover}
            style={{ cursor: "pointer", fontSize: "28px" }}
            id="noti-icon"
          />
        </div>
        <div className="user-container" onClick={handlePopover} style={{ cursor: "pointer" }} id="profile">
          <img src={"/upload/" + currentUser.profilePic} alt="" />
          <span>{currentUser.name}</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {content === "profile" && (
            <List>
              <ListItemButton>
                <ListItemIcon
                  style={{ fontSize: "20px", marginRight: "-25px" }}
                >
                  <FontAwesomeIcon icon={faGear} />
                </ListItemIcon>
                <ListItemText
                  primary="Cài đặt riêng tư"
                  style={{ marginRight: "100px" }}
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon
                  style={{ fontSize: "20px", marginRight: "-25px" }}
                >
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </ListItemIcon>
                <ListItemText
                  primary="Đóng góp ý kiến"
                  style={{ marginRight: "100px" }}
                />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon
                  style={{ fontSize: "20px", marginRight: "-25px" }}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </ListItemIcon>
                <ListItemText
                  primary="Đăng xuất"
                  style={{ marginRight: "100px" }}
                />
              </ListItemButton>
            </List>
          )}
          {content === "friend" && <ListFriendRequest></ListFriendRequest>}

          {content === "noti" && <ListNotification></ListNotification>}

          {content === "chat" && mess && (
            <ListMessages ListMessages={mess.list}></ListMessages>
          )}
        </Popover>
      </div>
    </div>
  );
};
export default Navbar;
