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
import { Popover, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCircleExclamation, faGear, faCaretDown } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user" onClick={handleClick} style={{ cursor:"pointer" }}>
          <img
            src={"/upload/" + currentUser.profilePic}
            alt=""
          />
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
          style={{ maxWidth: "2000px", paddingLeft: "20px" }}
        >
          <List>
            <ListItemButton>
              <ListItemIcon style={{ marginRight: '-25px' }}>
                <FontAwesomeIcon icon={faGear} />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon style={{ marginRight: '-25px' }}>
                <FontAwesomeIcon icon={faCircleExclamation} />
              </ListItemIcon>
              <ListItemText primary="Ý kiến" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon style={{ marginRight: '-25px' }}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItemButton>
          </List>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
