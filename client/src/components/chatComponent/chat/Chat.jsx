import React, { useState, useRef, useEffect } from "react";
import {
  URL_OF_BACK_END,
  WEBSOCKET_BACK_END,
  makeRequest,
} from "../../../axios";
import Message from "../message/Message";
import "./chat.scss";
import { Waypoint } from "react-waypoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NineCube from "../../loadingComponent/nineCube/NineCube";
import { faVideo, faX, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Chat = ({ friend, onRemoveChatBox }) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const friendId = friend.id;
  const [autoScrollToBottom, setAutoScrollToBottom] = useState(true);
  const [hasMoreOldMessages, setHasMoreOldMessages] = useState(true);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current && autoScrollToBottom) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      setAutoScrollToBottom(false);
    }
  }, [messages, autoScrollToBottom]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  if (!ws) {
    // Tạo kết nối WebSocket khi component được mount
    const socket = new WebSocket(WEBSOCKET_BACK_END + `/chat/${friendId}`);

    // Xử lý sự kiện khi mở kết nối
    socket.onopen = () => {
      //console.log("WebSocket connected");
    };

    // Xử lý sự kiện khi nhận tin nhắn từ server
    socket.onmessage = async (event) => {
      try {
        const response = await makeRequest.post("/messages", {
          friend_id: friendId,
          offset: 0,
        });
        await setMessages((prevMessages) => {
          const updatedMessages = removeDuplicateUnits([...prevMessages, ...response.data]);
          return updatedMessages;
        });
        setAutoScrollToBottom(true); // Tự động cuộn xuống dưới cùng cho tin nhắn mới
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

  const handleClickToCall = () => {
    window.open(`/call/${friendId}`, "_blank");
  };

  const fetchMessages = async () => {
    try {
      const response = await makeRequest.post("/messages", {
        friend_id: friendId,
        offset: offset,
      });
      const newMessages = response.data;
      setMessages((prevMessages) => {
        const updatedMessages = removeDuplicateUnits([...prevMessages, ...newMessages]);
        const newOffset = offset + 10;
        setOffset(newOffset);

        if (newMessages.length === 0) {
          setHasMoreOldMessages(false);
        }
        setLoading(false);
        if (!autoScrollToBottom && messageContainerRef.current && hasMoreOldMessages) {
          const newScrollPosition = 200; // Scroll down 200 pixels
          messageContainerRef.current.scrollTop = newScrollPosition;
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleShowMore = () => {
    setAutoScrollToBottom(false);
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
          await setMessages((prevMessages) => {
            const updatedMessages = removeDuplicateUnits([...prevMessages, ...response.data]);
            return updatedMessages;
          });
          setAutoScrollToBottom(true); // Tự động cuộn xuống dưới cùng cho tin nhắn mới
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="parent-container">
      <div className="top-box">
        <img
          src={URL_OF_BACK_END + `users/profilePic/` + friend.id}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/upload/errorImage.png";
          }}
          alt={""}
        />
        <div className="name">{friend.name}</div>
        <div className="actionButton">
          <button>
            <span>
              <FontAwesomeIcon icon={faVideo} onClick={handleClickToCall} />
            </span>
          </button>
          <button onClick={onRemoveChatBox}>
            <span>
              <FontAwesomeIcon icon={faX} />
            </span>
          </button>
        </div>
      </div>
      <div className="messages" ref={messageContainerRef}>
        {!loading && messages.length > 0 && (
          <Waypoint
            onEnter={handleShowMore}
          />
        )}
        {messages &&
          messages.map((message, index) => {
            const isLastInSequence =
              index === messages.length - 1 ||
              messages[index + 1].is_yours !== message.is_yours;

            const showAvatarForFriend = isLastInSequence && !message.is_yours;

            return (
              <Message
                key={message.id}
                messageShow={message}
                friendProfilePic={friend.id}
                showAvatar={showAvatarForFriend}
              />
            );
          })}
        {loading && <NineCube />}
      </div>
      <div className="new-message">
        <input
          type="text"
          value={newMessage}
          placeholder="Aa"
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="send-button" onClick={sendMessage}>
          <span>
            <FontAwesomeIcon icon={faPaperPlane} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chat;

function removeDuplicateUnits(arr) {
  // Loại bỏ các phần tử trùng lặp dựa trên id
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  // Chuyển mảng set thành mảng thông thường và sắp xếp theo createdAt tăng dần
  const sortedArr = Array.from(uniqueUnits.values()).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  // Trả về mảng đã sắp xếp và không có phần tử trùng lặp
  return sortedArr;
}
