import express from "express";
const app = express();
import storyRoutes from "./routes/stories.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import friendshipRoutes from "./routes/friendship.js";
import relationshipRoutes from "./routes/relationships.js";
import messageRoutes from "./routes/message.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    exposeHeaders:
      "access-control-allow-origin,access-control-allow-methods,access-control-allow-headers",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/stories", storyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/friendship", friendshipRoutes);
app.use("/api/messages", messageRoutes);

app.listen(8800, () => {
  console.log("API working!");
});
// ---------------------------------------------------------

import http from "http";
import { WebSocketServer } from "ws";
import { AuthService } from "./services/AuthService.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Đối tượng để lưu trữ các kết nối và thông tin người dùng
const clients = new Map();

wss.on("connection", async (ws, req) => {
  const header = await req.rawHeaders;

  const type = await req.url.split("/")[1];
  const accessTokenIndex = await header.findIndex(
    (element) => element === "Cookie"
  );

  // Nếu 'accessToken' được tìm thấy, lấy giá trị từ phần tử kế tiếp
  let accessToken;
  if (accessTokenIndex !== -1 && accessTokenIndex < header.length - 1) {
    accessToken = await header[accessTokenIndex + 1].split("=")[1];
  }
  try {
    const userId = await AuthService.verifyUserToken(accessToken);
    if (userId === -1) {
      ws.close();
      return;
    }
    if (type === "chat") {
      const friendId = await req.url.split("/")[2];
      clients.set(userId + " chatwith " + friendId, ws);

      // Gửi dữ liệu cho client khi kết nối thành công
      ws.send("Welcome to the WebSocket server");

      // Xử lý tin nhắn từ client
      ws.on("message", (message) => {});

      // Xử lý sự kiện khi client đóng kết nối
      ws.on("close", () => {});
    } else if (type === "index") {
      clients.set("index" + userId, ws);
      //console.log("user '" + userId + "' is Online");
    }
  } catch (error) {
    console.error("close user");
    ws.close();
  }
});

server.listen(3030, () => {
  console.log("Server is listening on port 3030");
});
export const sendMessageToUser = (userId, message) => {
  const userSocket = clients.get(userId);

  if (userSocket) {
    console.log(userId + " : " + message);
    userSocket.send(message);
  } else {
  }
};
