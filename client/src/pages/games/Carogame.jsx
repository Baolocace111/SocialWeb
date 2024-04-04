import "./carogame.scss";
import { useEffect, useState } from "react";
import { WEBSOCKET_BACK_END } from "../../axios";
const Carogame = () => {
  const [ws, setWs] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [yourTurn, SetYourTurn] = useState(false);
  const [squares, setSquares] = useState(null);

  const [player, setPlayer] = useState(null);

  const handleStartGame = () => {
    const websocket = new WebSocket(`${WEBSOCKET_BACK_END}/caro`);
    websocket.onopen = () => {
      console.log("Searching your opponent");
      setWs(websocket);
    };
    websocket.onmessage = (message) => {
      // Xử lý tin nhắn từ server
      const data = JSON.parse(message.data);
      console.log(data);
      // Cập nhật trạng thái trò chơi dựa trên dữ liệu từ server
      if (data.type === "start") {
        setSquares(data.board);
        setPlayer(data.player);
        if (data.player === 1) SetYourTurn(true);
        setGameStarted(true);
      } else if (data.type === "win" || data.type === "lose") {
        setPlayer(null);
        setWs(null);
        setGameStarted(false);
        SetYourTurn(false);
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
      console.log("Game over");
      setPlayer(null);
      setWs(null);
      setGameStarted(false);
      SetYourTurn(false);
    };
  };
  // const setSquare = (row, col, value) => {
  //   //console.log(`${row} - ${col} - ${value}`);
  //   const newSquares = squares.map((row) => [...row]); // Deep copy mảng
  //   // Cập nhật giá trị của ô tại vị trí được chỉ định bởi (row, col)
  //   newSquares[row][col] = value;
  //   // Cập nhật state với bảng squares mới
  //   setSquares(newSquares);
  // };
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
  //   console.log(player);
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
