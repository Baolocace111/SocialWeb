import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";

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
        document.cookie = `accessToken=${res.data.accessToken};max-age=604800;domain=/`;
      })
      .catch((e) => {});
  };

  const logout = () => {
    setCurrentUser(null);
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
