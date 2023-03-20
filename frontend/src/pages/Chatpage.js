import React, { useEffect, useState } from "react";
//import axios from "axios";
import { Navbar } from "../components/chatPage/home/navbar";
import "./chatPage.css";
import { ChatState } from "../context/ChatProvider";
import { Messagebox } from "../components/chatPage/message/Messagebox";
export const Chatpage = () => {
  // var [chats, setChats] = useState(["hello"]);
  const { user, selectedChat } = ChatState();

  return (
    <div className="fullpage">
      <div className={`page ${selectedChat ? "d_none" : ""}`}>
        {user && <Navbar />}
      </div>
      <div className={`chatmediacontrol ${selectedChat ? "" : "d_none"}`}>
        {user && <Messagebox />}
      </div>
    </div>
  );
};
export default Chatpage;
