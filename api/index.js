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
import notificationRoutes from "./routes/notifications.js";
import fileRoutes from "./routes/files.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

//middlewares
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "*",
    //credentials: true,
    // exposeHeaders:
    //   "access-control-allow-origin,access-control-allow-methods,access-control-allow-headers",
  })
);

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
app.use("/api/notifications", notificationRoutes);
app.use("/api/file/", fileRoutes);
app.use("/api/admin", adminRoutes);
app.listen(8800, () => {
  console.log("API working!");
});
// ---------------------------------------------------------

import http from "http";
import { WebSocketServer } from "ws";
import { AuthService } from "./services/AuthService.js";
import { getAllFriendsService } from "./services/FriendshipService.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Đối tượng để lưu trữ các kết nối và thông tin người dùng
export const clients = new Map();

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
    let key = "";
    if (type === "chat") {
      const friendId = await req.url.split("/")[2];
      key = userId + " chatwith " + friendId;
      // Gửi dữ liệu cho client khi kết nối thành công
      ws.send("Welcome to the WebSocket server");

      // Xử lý tin nhắn từ client
      ws.on("message", (message) => {});

      // Xử lý sự kiện khi client đóng kết nối
      ws.on("close", () => {
        // console.log("user is offline");
        const userConnections = clients.get(key);
        const index = userConnections.indexOf(ws);
        if (index !== -1) {
          userConnections.splice(index, 1);
          if (userConnections.length === 0) {
            clients.delete(key); // Xóa userId nếu không còn kết nối nào
          }
        }
      });
    } else if (type === "index") {
      sendAMessageWhenUserOnlineService(userId, "A user is online");
      key = "index" + userId;
      ws.on("close", () => {
        // console.log("user is offline");
        const userConnections = clients.get(key);
        const index = userConnections.indexOf(ws);
        if (index !== -1) {
          userConnections.splice(index, 1);
          if (userConnections.length === 0) {
            clients.delete(key); // Xóa userId nếu không còn kết nối nào
          }
        }
        sendAMessageWhenUserOnlineService(userId, "A user is offline");
      });

      //console.log("user '" + userId + "' is Online");
    }

    if (!clients.has(key)) {
      clients.set(key, []);
    }

    // Lưu kết nối vào danh sách các kết nối của userId
    clients.get(key).push(ws);
  } catch (error) {
    //console.error(error);
    ws.close();
  }
});

server.listen(3030, () => {
  console.log("Server is listening on port 3030");
});
export const sendMessageToUser = (userId, message) => {
  const userSocket = clients.get(userId);

  if (userSocket) {
    // console.log(userId + " : " + message);
    userSocket.map((ws) => {
      ws.send(message);
    });
  } else {
  }
};
const sendAMessageWhenUserOnlineService = (user_id, message) => {
  getAllFriendsService(user_id, (error, data) => {
    if (error) console.log(error);

    for (const item of data) {
      if (clients.has("index" + item.id)) {
        sendMessageToUser("index" + item.id, message);
      }
    }
    //console.log(clients);
    //return res.status(200).json(resultArray);
  });
};
