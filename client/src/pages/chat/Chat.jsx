import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../../axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const friendId = parseInt(useLocation().pathname.split("/")[2]);
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await makeRequest.post("/messages", {
        friend_id: friendId,
        offset: offset,
      });
      setMessages([...messages, ...response.data]);
      setOffset(offset + 1);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  const handleShowMore = () => {
    fetchMessages();
  };

  const sendMessage = async () => {
    try {
      await makeRequest.post("/messages/send", {
        message: newMessage,
        ruserid: friendId,
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div>
      <h1>Message Page</h1>
      <div className="messages">
        {messages &&
          messages.map((message) => (
            <div key={message.id} className="message">
              <p>Sent at: {message.created_at}</p>
              <p>{message.message}</p>
              <p>{message.is_yours ? "Gửi bởi bạn" : "Gửi bởi đối phương"}</p>
            </div>
          ))}
        {loading && <p>Loading...</p>}
        {!loading && <button onClick={handleShowMore}>Show More</button>}
      </div>
      <div className="new-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
export default Chat;
