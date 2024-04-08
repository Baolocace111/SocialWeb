import "./carogame.scss";
import { useState } from "react";
import { WEBSOCKET_BACK_END } from "../../axios";
import { URL_OF_BACK_END } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import PopupWindow from "../../components/PopupComponent/PopupWindow";
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
      ws.send(JSON.stringify({ row, col }));
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
    <div className="app">
      <div className="carotitle">
        <h1>Caro Game</h1>
        <h2>
          {player === 1 ? "X" : player === 2 ? "O" : ""}{" "}
          {yourTurn ? "- Your turn" : ""}{" "}
        </h2>
      </div>
      <PlayerBar
        isleft={true}
        player={{ name: currentUser.name, id: currentUser.id }}
      ></PlayerBar>
      <PlayerBar
        isleft={false}
        player={opponent ? { name: opponent.name, id: opponent.id } : null}
      ></PlayerBar>
      <PopupWindow show={findPopup} handleClose={closeFindPopup}>
        {" "}
        <h1>Finding your opponent...</h1>
        <button onClick={closeFindPopup}>Cancel</button>
      </PopupWindow>
      <PopupWindow show={winPopup} handleClose={closeWinPopup}>
        <div>
          <h1>VICTORY</h1>
        </div>
        <div>
          <h2>{popupMessage && popupMessage}</h2>
        </div>
        <div>
          <button onClick={closeWinPopup}>Tuyệt vời</button>
        </div>
      </PopupWindow>
      <PopupWindow show={losePopup} handleClose={closeLosePopup}>
        <div>
          <h1>DEFEAT</h1>
        </div>
        <div>
          <h2>{popupMessage && popupMessage}</h2>
        </div>
        <div>
          <button onClick={closeLosePopup}>OKAYYY...</button>
        </div>
      </PopupWindow>
      {!gameStarted ? (
        <StartScreen onStartGame={handleStartGame} />
      ) : (
        <div className="carogamescreen">
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
          <div className="caro-button">
            <button onClick={handleBackToStartScreen}> Trở về </button>
          </div>
        </div>
      )}
    </div>
  );
};
const PlayerBar = ({ player, isleft }) => {
  return (
    <div className={isleft ? "caroplayerbar left" : "caroplayerbar right"}>
      {player ? (
        <div className="carouserinfo">
          <img src={URL_OF_BACK_END + `users/profilePic/` + player.id} alt="" />
          <span>{player.name}</span>
        </div>
      ) : (
        <div className="carouserinfo">
          <img src="/upload/unknowplayer.png" alt="" />
          <span>??????</span>
        </div>
      )}
    </div>
  );
};
const StartScreen = ({ onStartGame }) => (
  <div className="start-screen">
    <button onClick={onStartGame}>Bắt đầu</button>
  </div>
);

const Square = ({ value, onClick }) => (
  <button className={`square ${value}`} onClick={onClick}>
    {value}
  </button>
);

export default Carogame;
