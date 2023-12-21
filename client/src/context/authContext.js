import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";
import Cookies from "universal-cookie";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    await makeRequest
      .post("/auth/login", inputs, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Thay đổi domain tương ứng của ứng dụng React của bạn
        },
      })
      .then((res) => {
        setCurrentUser(res.data);
        const cookies = new Cookies();
        removeAllCookies();
        cookies.set("accessToken", res.data.token, { path: "/" });
        //document.cookie = `accessToken=${res.data.accessToken};max-age=604800;domain=/`;
      });
  };

  const logout = () => {
    setCurrentUser(null);
    removeAllCookies();
    localStorage.removeItem("user");
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ setCurrentUser, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Xóa tất cả cookies
const removeAllCookies = () => {
  // Khởi tạo đối tượng Cookies
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  Object.keys(allCookies).forEach((cookieName) => {
    cookies.remove(cookieName);
  });
};
