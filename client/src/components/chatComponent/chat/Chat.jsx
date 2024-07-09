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
import {
  faVideo,
  faX,
  faMinimize,
  faPaperPlane,
  faMaximize,
} from "@fortawesome/free-solid-svg-icons";
import BallInBar from "../../loadingComponent/ballInBar/BallInBar";
import { useLanguage } from "../../../context/languageContext";
import { faImages } from "@fortawesome/free-solid-svg-icons";
const Chat = ({ friend, onRemoveChatBox }) => {
  const { trl } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [isFull, setIsFull] = useState(true);
  const wsRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const friendId = friend.id;
  const [file, setFile] = useState(null);
  const [autoScrollToBottom, setAutoScrollToBottom] = useState(true);
  const [hasMoreOldMessages, setHasMoreOldMessages] = useState(true);
  const messageContainerRef = useRef(null);
  const [selectedMessage, SetSelectedMessage] = useState(null);
  const messageRefs = useRef({});

  const handleCloseChatBox = () => {
    if (wsRef.current) wsRef.current.close();
    if (onRemoveChatBox) onRemoveChatBox();
  };
  const scrollToMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];

    if (messageElement) {
      SetSelectedMessage(messageId);
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.focus();
    } else {
      setError(messageId + "-" + trl("Not found"));
    }
  };
  const getMessageById = (id) => {
    // Tìm kiếm tin nhắn trong danh sách messages
    if (!id) return null;
    const message = messages.find((msg) => msg.id === id);
    if (message) {
      return message;
    }

    try {
      // Nếu không tìm thấy, gọi API để lấy dữ liệu tin nhắn từ server
      const response = makeRequest.get(`/messages/mess/${id}`);
      return response.data;
    } catch (error) {
      setError(id + " - " + trl("Not found"));
      return null;
    }
  };

  useEffect(() => {
    if (messageContainerRef.current && autoScrollToBottom) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
      setAutoScrollToBottom(false);
    }
  }, [messages, autoScrollToBottom]);

  useEffect(() => {
    fetchMessages(true);
    setupWebSocket();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Clear error message after 3 seconds
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);
  const handleClickToCall = () => {
    window.open(`/call/${friendId}`, "_blank");
  };
  const setupWebSocket = () => {
    if (!wsRef.current) {
      const socket = new WebSocket(WEBSOCKET_BACK_END + `/chat/${friendId}`);
      socket.onopen = () => {};
      socket.onmessage = async (event) => {
        if (event.data === "clear") {
          setMessages([]);
        }
        try {
          const response = await makeRequest.post("/messages", {
            friend_id: friendId,
            offset: 0,
          });
          setMessages((prevMessages) => {
            const updatedMessages = removeDuplicateUnits([
              ...response.data,
              ...prevMessages,
            ]);
            return updatedMessages;
          });
          //setAutoScrollToBottom(true);
        } catch (error) {
          setError(
            trl("Failed to fetch messages:") + trl(error.response?.data)
          );
        }
      };
      socket.onclose = () => {};
      wsRef.current = socket;
    }
  };

  const fetchMessages = async (initial = false) => {
    setLoading(true);
    try {
      const response = await makeRequest.post("/messages", {
        friend_id: friendId,
        offset: initial ? 0 : offset,
      });
      const newMessages = response.data;
      setMessages((prevMessages) => {
        const updatedMessages = initial
          ? removeDuplicateUnits(newMessages)
          : removeDuplicateUnits([...prevMessages, ...newMessages]);
        return updatedMessages;
      });
      setOffset((prevOffset) => prevOffset + 10);
      if (newMessages.length === 0) {
        setHasMoreOldMessages(false);
      }
      setLoading(false);
      if (!initial && messageContainerRef.current && hasMoreOldMessages) {
        const newScrollPosition = 200;
        messageContainerRef.current.scrollTop = newScrollPosition;
      }
    } catch (error) {
      setError(trl("Failed to fetch messages:") + trl(error.response?.data));
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setAutoScrollToBottom(false);
    fetchMessages();
  };

  const reloadMessages = () => {
    setOffset(0);
    setHasMoreOldMessages(true);
    fetchMessages(true);
  };

  const sendMessage = async () => {
    if ((newMessage !== "" || file) && !sending) {
      setSending(true);
      try {
        if (!file) {
          await makeRequest.post("/messages/send", {
            message: newMessage,
            ruserid: friendId,
            replyid: selectedMessage,
          });
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("ruserid", friendId);
          if (selectedMessage) formData.append("replyid", selectedMessage);
          await makeRequest.post("/messages/sendimage", formData);
        }
        setNewMessage("");
        setFile(null);
        SetSelectedMessage(null);
        reloadMessages();
        setSending(false);
      } catch (error) {
        setSending(false);
        setError(trl("Failed to send message:") + trl(error.response?.data));
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={`parent-container ${isFull ? "full" : ""}`}>
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
          <button
            onClick={() => {
              setIsFull(!isFull);
            }}
          >
            <span>
              <FontAwesomeIcon icon={isFull ? faMinimize : faMaximize} />
            </span>
          </button>
          <button onClick={handleCloseChatBox}>
            <span>
              <FontAwesomeIcon icon={faX} />
            </span>
          </button>
        </div>
      </div>
      <div className="messages" ref={messageContainerRef}>
        {!loading && messages.length > 0 && hasMoreOldMessages && (
          <Waypoint onEnter={handleShowMore} />
        )}
        {messages &&
          messages.map((message, index) => {
            const isLastInSequence =
              index === messages.length - 1 ||
              messages[index + 1].is_yours !== message.is_yours;
            const showAvatarForFriend = isLastInSequence && !message.is_yours;

            return (
              <div
                className={
                  "message" +
                  (selectedMessage === message.id ? " selected" : "")
                }
                key={message.id}
                ref={(el) => (messageRefs.current[message.id] = el)}
              >
                <Message
                  messageShow={message}
                  setLoading={setSending}
                  friendProfilePic={friend.id}
                  showAvatar={showAvatarForFriend}
                  reload={reloadMessages}
                  setError={setError}
                  selectMessage={() => {
                    if (selectedMessage === message.id)
                      SetSelectedMessage(null);
                    else SetSelectedMessage(message.id);
                  }}
                  scrollTo={scrollToMessage}
                  replyMessage={getMessageById(message.replyid)}
                />
              </div>
            );
          })}
        {loading && <NineCube />}
      </div>
      <div className="new-message">
        {sending && (
          <div className="loadingpopup">
            <BallInBar />
          </div>
        )}
        {error && <div className="errortab">{error}</div>}
        {file ? (
          <div className="preview">
            {isImage(file) ? (
              <img
                className="file"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt={""}
                src={URL.createObjectURL(file)}
              />
            ) : (
              <video className="file" src={URL.createObjectURL(file)} />
            )}
          </div>
        ) : (
          <input
            type="text"
            value={newMessage}
            placeholder="Aa"
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        )}

        <input
          type="file"
          id={`messagefor${friendId}`}
          accept="image/*, video/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (isImageAndVideo(selectedFile)) {
              setFile(selectedFile);
            } else {
              alert(trl("Unacceptable file"));
            }
          }}
        />
        {file && (
          <button className="close-button" onClick={() => setFile(null)}>
            <FontAwesomeIcon icon={faX} />
          </button>
        )}
        <label htmlFor={`messagefor${friendId}`} hidden={file ? true : false}>
          <div className="item">
            <FontAwesomeIcon icon={faImages} color="blue" size="xl" />
          </div>
        </label>
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
  const uniqueUnits = new Map();
  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }
  const sortedArr = Array.from(uniqueUnits.values()).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedArr;
}
function isImageAndVideo(file) {
  return (
    file &&
    (file["type"].split("/")[0] === "image" ||
      file["type"].split("/")[0] === "video")
  );
}
function isImage(file) {
  return file && file["type"].split("/")[0] === "image";
}
