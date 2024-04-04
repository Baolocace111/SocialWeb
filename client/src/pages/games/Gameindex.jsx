import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
const Gameindex = () => {
  //const { currentUser } = useContext(AuthContext);

  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <Outlet></Outlet>
    </div>
  );
};
export default Gameindex;
