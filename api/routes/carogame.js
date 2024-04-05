const MAX_PLAYERS = 2;
const BOARD_SIZE = 14;
const WINNING_LENGTH = 5;
const X = 1;
const O = 2;

const waitingPlayers = new Map();
const currentGames = new Map();

const checkWin = (board, row, col, player) => {
  const directions = [
    [1, 0], // dọc
    [0, 1], // ngang
    [1, 1], // chéo \
    [1, -1], // chéo /
  ];

  for (const [dx, dy] of directions) {
    let count = 1;

    // Kiểm tra hướng một
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;

      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE &&
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    // Kiểm tra hướng đối diện
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;

      if (
        newRow >= 0 &&
        newRow < BOARD_SIZE &&
        newCol >= 0 &&
        newCol < BOARD_SIZE &&
        board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }

    if (count >= WINNING_LENGTH) {
      return true;
    }
  }

  return false;
};

export const settingCaroWebsocket = (ws, key) => {
  if (waitingPlayers.has(key) || currentGames.has(key)) {
    ws.close();
    return;
  }
  waitingPlayers.set(key, ws);

  if (waitingPlayers.size >= MAX_PLAYERS) {
    const playerKeys = Array.from(waitingPlayers.keys());
    const player1Key = playerKeys[0];
    const player2Key = playerKeys[1];

    const player1 = waitingPlayers.get(player1Key);
    const player2 = waitingPlayers.get(player2Key);

    waitingPlayers.delete(player1Key);
    waitingPlayers.delete(player2Key);

    const board = Array.from(Array(BOARD_SIZE), () =>
      Array(BOARD_SIZE).fill(0)
    );

    currentGames.set(player1Key, {
      ws: player1,
      turn: true,
      board: board,
      player: X,
      opp: player2Key,
    });
    currentGames.set(player2Key, {
      ws: player2,
      turn: false,
      board: board,
      player: O,
      opp: player1Key,
    });

    player1.send(
      JSON.stringify({ type: "start", board, player: X, oppkey: player2Key })
    );
    player2.send(
      JSON.stringify({ type: "start", board, player: O, oppkey: player1Key })
    );
  }
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    //console.log(data);
    // Kiểm tra xem dữ liệu nhận được là một object và có thuộc tính row và col không
    if (typeof data !== "object" || !("row" in data) || !("col" in data)) {
      // Nếu dữ liệu không đúng định dạng mong muốn, gửi tin nhắn lỗi và không làm gì cả

      return;
    }

    const { row, col } = data;

    // Kiểm tra tính hợp lệ của tọa độ hàng và cột
    if (
      isNaN(row) ||
      isNaN(col) ||
      row < 0 ||
      row >= BOARD_SIZE ||
      col < 0 ||
      col >= BOARD_SIZE
    ) {
      // Nếu tọa độ không hợp lệ, gửi tin nhắn lỗi và không làm gì cả

      return;
    }

    if (!currentGames.get(key).turn) {
      return; // Không phải lượt của người chơi này
    }
    // Xử lý nước đi của người chơi
    const board = currentGames.get(key).board;
    // Không được điền vào ô đã đánh
    if (board[row][col] != 0) return;
    board[row][col] = currentGames.get(key).player;
    const oppkey = currentGames.get(key).opp;
    if (checkWin(board, row, col, currentGames.get(key).player)) {
      currentGames
        .get(key)
        .ws.send(JSON.stringify({ type: "win", message: "Out trình đối thủ" }));
      currentGames
        .get(oppkey)
        .ws.send(JSON.stringify({ type: "lose", message: "Đối thủ quá hay" }));
      currentGames.delete(key);
      currentGames.delete(oppkey);
    } else {
      currentGames.get(key).turn = false;
      currentGames.get(oppkey).turn = true;
      currentGames.get(key).board = board;
      currentGames.get(oppkey).board = board;
      currentGames
        .get(oppkey)
        .ws.send(JSON.stringify({ type: "opponentMove", row, col, board }));
      currentGames
        .get(key)
        .ws.send(JSON.stringify({ type: "yourmove", row, col, board }));
    }
  });
  ws.on("close", () => {
    if (waitingPlayers.has(key)) {
      waitingPlayers.delete(key);
      return;
    } else if (currentGames.has(key)) {
      const oppkey = currentGames.get(key).opp;
      currentGames
        .get(oppkey)
        .ws.send(
          JSON.stringify({ type: "win", message: "Đối thủ đã đầu hàng" })
        );
      currentGames.delete(key);
      currentGames.delete(oppkey);
    }
  });
};
