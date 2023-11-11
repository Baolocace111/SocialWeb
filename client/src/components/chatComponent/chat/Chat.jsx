import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../../../axios";
import Message from "../message/Message";
import "./chat.scss";
const Chat = ({ friend }) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const friendId = friend.id;
  if (!ws) {
    // Lấy cookies từ document.cookie hoặc từ các nguồn khác nếu cần
    const token = document.cookie.accessToken;
    // Tạo kết nối WebSocket khi component được mount
    const socket = new WebSocket(`ws://localhost:3030?token=${token}`); // Đặt URL của WebSocket server của bạn ở đây

    // Xử lý sự kiện khi mở kết nối
    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    // Xử lý sự kiện khi nhận tin nhắn từ server
    socket.onmessage = async (event) => {
      try {
        const response = await makeRequest.post("/messages", {
          friend_id: friendId,
          offset: 0,
        });
        await setMessages(
          removeDuplicateUnits([...messages, ...response.data])
        );
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    // Xử lý sự kiện khi đóng kết nối
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Lưu đối tượng WebSocket vào state để sử dụng ở các phương thức khác
    setWs(socket);

    // Clear up effect khi component unmount
    return () => {
      socket.close();
    };
  }

  const fetchMessages = async () => {
    try {
      const response = await makeRequest.post("/messages", {
        friend_id: friendId,
        offset: offset,
      });

      await setMessages(removeDuplicateUnits([...messages, ...response.data]));

      if (response.data.length !== 0) setOffset(offset + 10);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  const handleShowMore = () => {
    fetchMessages();
  };

  const sendMessage = async () => {
    if (newMessage !== "")
      try {
        await makeRequest.post("/messages/send", {
          message: newMessage,
          ruserid: friendId,
        });
        setNewMessage("");
        try {
          const response = await makeRequest.post("/messages", {
            friend_id: friendId,
            offset: 0,
          });
          await setMessages(
            removeDuplicateUnits([...messages, ...response.data])
          );
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
  };
  if (loading) fetchMessages();
  return (
    <div className="parent-container">
      <div className="top-box">
        <img src={"/upload/" + friend.profilePic} alt="" />
        <div className="name">{friend.name}</div>
      </div>
      <div className="messages">
        {!loading && (
          <div className="showMore" onClick={handleShowMore}>
            Show More
          </div>
        )}
        {messages &&
          messages.map((message) => (
            <Message key={message.id} messageShow={message}></Message>
          ))}
        {loading && <p>Loading...</p>}
      </div>
      <div className="new-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="send-button" onClick={sendMessage}>
          S
        </div>
      </div>
    </div>
  );
};

export default Chat;
function removeDuplicateUnits(arr) {
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  return Array.from(uniqueUnits.values());
}
