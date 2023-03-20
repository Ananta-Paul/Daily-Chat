import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import axios from "axios";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [chatsFetch, setChatsFetch] = useState(false);
  //  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();
  async function fetchChats() {
    try {
      //console.log("fetching", user);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chat`, config);
      setChats(data);
      //console.log("chats", data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    //console.log("provider", userInfo.result.name);
    if (!userInfo) navigate("/");
  }, [navigate]);
  useEffect(() => {
    if (user) fetchChats();
  }, [chatsFetch]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        chatsFetch,
        setChatsFetch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChatProvider;
