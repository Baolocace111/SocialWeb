import "./carogame.scss";
import { useState } from "react";
import { WEBSOCKET_BACK_END } from "../../axios";
import { URL_OF_BACK_END } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
import { useLanguage } from "../../context/languageContext";
import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
const Carogame = () => {
  const [ws, setWs] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [yourTurn, SetYourTurn] = useState(false);
  const [squares, setSquares] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [findPopup, setFindPopup] = useState(false);
  const [winPopup, setWinPopup] = useState(false);
  const [losePopup, setLosePopup] = useState(false);
  const [popupMessage, setPopupmessage] = useState(null);
  const { trl } = useLanguage();
  const [messages, setMessages] = useState([]);
  const intervalRef = useRef(null);
  const [oppMessages, setOppMessages] = useState([]);
  const intervalOppRef = useRef(null);

  // Hàm thêm tin nhắn mới
  const addMessage = (message) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, message];
      if (newMessages.length > 5) {
        newMessages.shift(); // Xóa tin nhắn đầu tiên nếu danh sách có nhiều hơn 5 tin nhắn
      }
      return newMessages;
    });
  };
  const addOppMessage = (message) => {
    setOppMessages((prevMessages) => {
      const newMessages = [...prevMessages, message];
      if (newMessages.length > 5) {
        newMessages.shift(); // Xóa tin nhắn đầu tiên nếu danh sách có nhiều hơn 5 tin nhắn
      }
      return newMessages;
    });
  };

  // Hàm thiết lập lại interval
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setMessages((prevMessages) => {
        if (prevMessages.length > 0) {
          const newMessages = prevMessages.slice(1); // Xóa tin nhắn đầu tiên
          return newMessages;
        }
        return prevMessages;
      });
    }, 5000);
  };
  // Hàm thiết lập lại interval
  const resetOppInterval = () => {
    if (intervalOppRef.current) {
      clearInterval(intervalOppRef.current);
    }
    intervalOppRef.current = setInterval(() => {
      setOppMessages((prevMessages) => {
        if (prevMessages.length > 0) {
          const newMessages = prevMessages.slice(1); // Xóa tin nhắn đầu tiên
          return newMessages;
        }
        return prevMessages;
      });
    }, 5000);
  };

  // Mỗi khi messages thay đổi, thiết lập lại interval
  useEffect(() => {
    resetOppInterval();
    return () => clearInterval(intervalOppRef.current);
  }, [oppMessages]);
  // Mỗi khi messages thay đổi, thiết lập lại interval
  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, [messages]);

  const closeFindPopup = () => {
    if (ws && !gameStarted) ws.close();
    setFindPopup(false);
  };
  const closeWinPopup = () => {
    //if (ws && !gameStarted) ws.close();
    setWinPopup(false);
  };
  const closeLosePopup = () => {
    //if (ws && !gameStarted) ws.close();
    setLosePopup(false);
  };
  const handleStartGame = () => {
    setFindPopup(true);
    const websocket = new WebSocket(`${WEBSOCKET_BACK_END}/caro`);
    websocket.onopen = () => {
      websocket.onmessage = (message) => {
        // Xử lý tin nhắn từ server
        const data = JSON.parse(message.data);

        // Cập nhật trạng thái trò chơi dựa trên dữ liệu từ server
        if (data.type === "start") {
          makeRequest.get("/users/find/" + data.oppkey).then((res) => {
            setOpponent(res.data);
          });
          setSquares(data.board);
          setPlayer(data.player);
          if (data.player === 1) SetYourTurn(true);
          setGameStarted(true);
          setFindPopup(false);
        } else if (data.type === "win" || data.type === "lose") {
          setPopupmessage(data.message);
          if (data.type === "win") {
            setWinPopup(true);
          } else {
            setLosePopup(true);
          }
          setPlayer(null);
          setWs(null);
          setGameStarted(false);
          SetYourTurn(false);
          setOpponent(null);
        } else if (data.type === "opponentMove") {
          SetYourTurn(true);
          setSquares(data.board);
          //setSquare(data.row, data.col, player === 1 ? 2 : 1);
        } else if (data.type === "yourmove") {
          SetYourTurn(false);
          setSquares(data.board);
          //setSquare(data.row, data.col, player === 2 ? 2 : 1);
        } else if (data.type === "chat") {
          if (data.message) addOppMessage(data.message);
        }
      };
      websocket.onclose = () => {
        setOpponent(null);
        setPlayer(null);
        setWs(null);
        setGameStarted(false);
        SetYourTurn(false);
      };
      setWs(websocket);
    };
  };

  const handleSquareClick = (row, col, cell) => {
    if (ws && yourTurn && cell === 0) {
      ws.send(JSON.stringify({ type: "move", row, col }));
    }
  };

  const handleBackToStartScreen = () => {
    setGameStarted(false);
    setPlayer(null);
    ws.close();
    setWs(null);
    setGameStarted(false);
    SetYourTurn(false);
  };
  // useEffect(() => {

  // }, [player]);

  return (
    <div className="caroapp">
      <div className="carotitle">
        <h1>Caro Game</h1>
        <h2>
          {player === 1 ? "X" : player === 2 ? "O" : ""}{" "}
          {yourTurn ? trl("- Your turn") : ""}{" "}
        </h2>
      </div>
      <PlayerBar
        isleft={true}
        player={{ name: currentUser.name, id: currentUser.id }}
        ws={ws}
        addMessage={addMessage}
        messages={messages}
      ></PlayerBar>
      <PlayerBar
        isleft={false}
        player={opponent ? { name: opponent.name, id: opponent.id } : null}
        messages={oppMessages}
      ></PlayerBar>
      <PopupWindow show={findPopup} handleClose={closeFindPopup}>
        <div className="findingPopup">
          {" "}
          <h1>{trl("Finding your opponent...")}</h1>
          <button onClick={closeFindPopup}>{trl("Cancel")}</button>
        </div>
      </PopupWindow>
      <PopupWindow show={winPopup} handleClose={closeWinPopup}>
        <div className="titlePopup">
          <h1>{trl("VICTORY")}</h1>
        </div>
        <div className="messagePopup">
          <h2>{popupMessage && trl(popupMessage)}</h2>
        </div>
        <div className="btnPopup">
          <button onClick={closeWinPopup}>{trl("Tuyệt vời")}</button>
        </div>
      </PopupWindow>
      <PopupWindow show={losePopup} handleClose={closeLosePopup}>
        <div className="titlePopup">
          <h1>{trl("DEFEAT")}</h1>
        </div>
        <div className="messagePopup">
          <h2>{popupMessage && trl(popupMessage)}</h2>
        </div>
        <div className="btnPopup">
          <button onClick={closeLosePopup}>OKAYYY...</button>
        </div>
      </PopupWindow>
      {!gameStarted ? (
        <StartScreen onStartGame={handleStartGame} />
      ) : (
        <div className="carogamescreen">
          <div className="game-board-wrapper">
            <div className="game-board">
              {squares &&
                squares.map((row, rowIndex) => (
                  <div key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <Square
                        key={`${rowIndex}-${colIndex}`}
                        className="square"
                        value={cell === 0 ? "" : cell === 1 ? "X" : "O"}
                        onClick={() => {
                          handleSquareClick(rowIndex, colIndex, cell);
                        }}
                      ></Square>
                    ))}
                  </div>
                ))}
            </div>
          </div>
          <div className="caro-button">
            <button onClick={handleBackToStartScreen}> {trl("Back")} </button>
          </div>
        </div>
      )}
    </div>
  );
};
const PlayerBar = ({ player, isleft, ws, addMessage, messages }) => {
  const [newMessage, setNewMessage] = useState("");
  const sendMessage = () => {
    const data = {
      type: "chat",
      message: newMessage,
    };
    setNewMessage("");
    ws.send(JSON.stringify(data));
    addMessage(newMessage);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <div className={isleft ? "caroplayerbar left" : "caroplayerbar right"}>
      {player ? (
        <div className="carouserbox">
          <div className="carouserinfo">
            <img
              src={URL_OF_BACK_END + `users/profilePic/` + player.id}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={""}
            />
            <span>{player.name}</span>
          </div>

          <div className="caroChat">
            {isleft && (
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
            )}
            <div className="messages">
              {messages.map((message, index) => (
                <div className="message" key={index}>
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="carouserbox">
          <div className="carouserinfo">
            <img
              src="/upload/unknowplayer.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={""}
            />
            <span>??????</span>
          </div>
        </div>
      )}
    </div>
  );
};
const StartScreen = ({ onStartGame }) => {
  const { trl } = useLanguage();
  return (
    <div className="start-screen">
      <button onClick={onStartGame}>{trl("Bắt đầu")}</button>
    </div>
  );
};

const Square = ({ value, onClick }) => (
  <button className={`square ${value}`} onClick={onClick}>
    {value}
  </button>
);

export default Carogame;
