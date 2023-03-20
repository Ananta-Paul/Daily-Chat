import io from "socket.io-client";

const socket = io("https://daily-chat.onrender.com");

export default socket;
