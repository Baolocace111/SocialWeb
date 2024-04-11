import React, { useState } from "react";

// Tạo một context mới
export const ChatContext = React.createContext();
const ChatContextProvider = ({ children }) => {
  const [chattingUser, setChattingUser] = useState([]);
  const [ws, setWS] = useState(null);
  return (
    <ChatContext.Provider value={{ chattingUser, setChattingUser, ws, setWS }}>
      {children}
    </ChatContext.Provider>
  );
};
export default ChatContextProvider;
