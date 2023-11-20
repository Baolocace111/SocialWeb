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
import axios from "axios";
import { useContext, useState } from "react";
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
import {
  faArrowRightFromBracket,
  faCircleExclamation,
  faGear,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import ListFriendRequest from "./ListFriendRequest";
import { makeRequest } from "../../axios";
import ListNotification from "./ListNotification";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [content, setContent] = useState("");
  const [request_number, setRequestNumber] = useState(0);
  const [ws, setWS] = useState(null);

  const update_request_number = async () => {
    try {
      const response = await makeRequest.get("/friendship/count");
      //console.log(response);
      setRequestNumber(response.data); // Hoặc request_number = response.data nếu đây là biến ngoài hàm
    } catch (error) {
      //console.error("Error fetching request count:", error);
      setRequestNumber(-1); // Xử lý lỗi và gán giá trị mặc định
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
      }
    };
    socket.onclose = () => {
      console.log("Closed");
    };
    setWS(socket);
  }

  update_request_number();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu API logout
      await axios.post("http://localhost:8800/api/auth/logout");

      // Đăng xuất người dùng
      logout();

      // Chuyển hướng về trang đăng nhập
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
    setAnchorEl(event.currentTarget.parentElement.parentElement);
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
      navigate(`/search/${searchText}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const PopoverStyle = {
    top: "10px",
  };

  return (
    <div className="navbar">
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
          <EmailOutlinedIcon
            className="icon"
            onClick={handlePopover}
            style={{ cursor: "pointer", fontSize: "28px" }}
            id="chat-icon"
          />
        </div>
        <div className="icon-container">
          <NotificationsOutlinedIcon
            className="icon"
            onClick={handlePopover}
            style={{ cursor: "pointer", fontSize: "28px" }}
            id="noti-icon"
          />
        </div>
        <div className="user-container">
          <div
            className="user"
            onClick={handlePopover}
            style={{ cursor: "pointer" }}
            id="profile"
          >
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
            <FontAwesomeIcon icon={faCaretDown} />
          </div>
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
          style={PopoverStyle}
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
        </Popover>
      </div>
    </div>
  );
};
export default Navbar;
