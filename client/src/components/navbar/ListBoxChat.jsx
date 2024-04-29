import { useContext } from "react";
import "./listBoxChat.scss";
import Chat from "../chatComponent/chat/Chat";
import { ChatContext } from "./ChatContext";
const ListBoxChat = () => {
  const { chattingUser, setChattingUser } = useContext(ChatContext);

  //setChattingUser([]);
  const handleRemoveChatBoxById = (userIdToRemove) => {
    // Lọc ra các user có id khác userIdToRemove
    const updatedChattingUsers = chattingUser.filter(
      (user) => user.id !== userIdToRemove
    );
    setChattingUser(updatedChattingUsers); // Cập nhật trạng thái của context với danh sách user đã lọc

    // Điều này sẽ tự động dẫn đến việc render lại ListBoxChat với danh sách user mới, loại bỏ chat-box tương ứng
  };
  return (
    <div>
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
    </div>
  );
};
export default ListBoxChat;
