const dotenv = require("dotenv").config();
//const { Chats } = require("./data");
const express = require("express");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
connectDB();
const app = express();
app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("HEllo world!");
// });
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const __dirname1 = path.resolve();
if (process.env.MODE_ENV === "Edit") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running successfully");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server is running at port ${PORT}`)
);
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log(`socket connected ${socket.id}`);
  socket.on("setUser", (user) => {
    socket.join(user._id);
    console.log(`joined Id${user._id}`);
    socket.emit("connection");
  });
  socket.on("join room", (room) => {
    socket.join(room);
    // console.log("join");
    //console.log(`joined room ${room}`);
  });
  socket.on("addtogroup", (userId) => {
    console.log("addtogroup" + userId);
    socket.to(userId).emit("addtoGroup");
  });
  socket.on("typing", ({ room, person }) => {
    socket.broadcast.to(room).emit("typing", person);
  });
  socket.on("stop typing", ({ room, person }) => {
    socket.broadcast.to(room).emit("stop typing", person);
  });
  socket.on("new message", (newMessage) => {
    newMessage.chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.to(user._id).emit("messageRecived", newMessage);
    });
  });
  socket.on("leave room", (room) => {
    socket.leave(room);
    // console.log("leaving " + room);
  });
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});
