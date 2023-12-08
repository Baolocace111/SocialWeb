import React, { useState } from "react";

// Tạo một context mới
export const ChatContext = React.createContext();
const ChatContextProvider = ({ children }) => {
  const [chattingUser, setChattingUser] = useState([]);
  return (
    <ChatContext.Provider value={{ chattingUser, setChattingUser }}>
      {children}
    </ChatContext.Provider>
  );
};
export default ChatContextProvider;
