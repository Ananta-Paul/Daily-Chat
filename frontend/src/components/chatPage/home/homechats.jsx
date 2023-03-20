import React, { useEffect } from "react";
import { ChatState } from "../../../context/ChatProvider";
import "../chatPage.css";
//import axios from "axios";
import { sender } from "../../../config/logic";
import "font-awesome/css/font-awesome.min.css";
import { Chats } from "./Chats";
import { ChatSkeleton } from "./chatSkeleton";
var compChat;
// import { fetchChats } from "../../../../backend/controllers/chatController";
export const Homechats = () => {
  const {
    user,
    chats,
    selectedChat,
    setSelectedChat,
    setChatsFetch,
    chatsFetch,
  } = ChatState();
  async function fetchChats() {
    setChatsFetch(!chatsFetch);
    compChat = selectedChat;
    //console.log(selectedChat, chats);
  }

  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <div className="chatcontainer homechat">
      {!chats ? (
        <>
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
        </>
      ) : (
        chats.map((chat) => (
          <Chats
            onClick={() => setSelectedChat(chat)}
            key={chat._id}
            name={
              chat.isGroupChat
                ? chat.chatName
                : sender(user.result._id, chat.users).name
            }
            avatar={
              chat.isGroupChat
                ? chat.groupAvatar
                : sender(user.result._id, chat.users).avatar
            }
            chat={
              !chat.isGroupChat
                ? chat.latestMessage?.content
                : `${chat.latestMessage?.sender.name.split(" ")[0]}: ${
                    chat.latestMessage?.content
                  } `
            }
            unread={
              compChat && chat._id === compChat._id ? 0 : chat.unreadCount
            }
          />
        ))
      )}
    </div>
  );
};
