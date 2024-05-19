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
const Chat = ({ friend, onRemoveChatBox }) => {
  const [messages, setMessages] = useState([]);
  const [isFull, setIsFull] = useState(true);
  const wsRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const friendId = friend.id;
  const [autoScrollToBottom, setAutoScrollToBottom] = useState(true);
  const [hasMoreOldMessages, setHasMoreOldMessages] = useState(true);
  const messageContainerRef = useRef(null);
  const handleCloseChatBox = () => {
    if (wsRef.current) wsRef.current.close();
    if (onRemoveChatBox) onRemoveChatBox();
  };

  useEffect(() => {
    if (messageContainerRef.current && autoScrollToBottom) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
      setAutoScrollToBottom(false);
    }
  }, [messages, autoScrollToBottom]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!wsRef.current) {
      const socket = new WebSocket(WEBSOCKET_BACK_END + `/chat/${friendId}`);

      socket.onopen = () => {};

      socket.onmessage = async (event) => {
        try {
          const response = await makeRequest.post("/messages", {
            friend_id: friendId,
            offset: 0,
          });
          await setMessages((prevMessages) => {
            const updatedMessages = removeDuplicateUnits([
              ...prevMessages,
              ...response.data,
            ]);
            return updatedMessages;
          });
          setAutoScrollToBottom(true);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      };

      socket.onclose = () => {};

      wsRef.current = socket;
    }
  }, [friendId]);

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
        const updatedMessages = removeDuplicateUnits([
          ...prevMessages,
          ...newMessages,
        ]);
        const newOffset = offset + 10;
        setOffset(newOffset);

        if (newMessages.length === 0) {
          setHasMoreOldMessages(false);
        }
        setLoading(false);
        if (
          !autoScrollToBottom &&
          messageContainerRef.current &&
          hasMoreOldMessages
        ) {
          const newScrollPosition = 200;
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
    if (newMessage !== "" && !sending) {
      await setSending(true);
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
            const updatedMessages = removeDuplicateUnits([
              ...prevMessages,
              ...response.data,
            ]);
            return updatedMessages;
          });
          setSending(false);
          setAutoScrollToBottom(true);
        } catch (error) {
          setSending(false);
          console.error("Failed to fetch messages:", error);
        }
      } catch (error) {
        setSending(false);
        console.error("Failed to send message:", error);
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
        {!loading && messages.length > 0 && (
          <Waypoint onEnter={handleShowMore} />
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
        {sending && (
          <div className="loadingpopup">
            <BallInBar></BallInBar>
          </div>
        )}
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
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  const sortedArr = Array.from(uniqueUnits.values()).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return sortedArr;
}
