import { useContext, useState } from "react";
import "./listBoxChat.scss";
import Chat from "../chatComponent/chat/Chat";
import ChatContextProvider, { ChatContext } from "./ChatContext";
const ListBoxChat = () => {
  const { chattingUser, setChattingUser } = useContext(ChatContext);

  //setChattingUser([]);
  const handleRemoveChatBoxById = (userIdToRemove) => {
    // Lọc ra các user có id khác userIdToRemove
    // Bên trong hàm handleRemoveChatBoxById
    const updatedChattingUsers = chattingUser.filter(
      (user) => user.id !== userIdToRemove
    );
    setChattingUser([...updatedChattingUsers]); // Tạo ra một mảng mới chứa các user đã lọc

    // Điều này đảm bảo tính không thay đổi bằng cách spread các user đã lọc vào một mảng mới trước khi cập nhật trạng thái của context.
  };
  return (
    <>
      {chattingUser && chattingUser.length === 0 ? (
        <div className="chat-boxes"></div>
      ) : (
        <div className="chat-boxes">
          {chattingUser.map((user) => (
            <div className="chat-box" key={user.id}>
              <Chat
                friend={user}
                onRemoveChatBox={() => handleRemoveChatBoxById(user.id)}
              ></Chat>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default ListBoxChat;
