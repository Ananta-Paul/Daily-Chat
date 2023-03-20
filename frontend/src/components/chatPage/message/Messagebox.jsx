import React, { useState, useEffect } from "react";
import "./messagebox.css";
import axios from "axios";
import { Skeleton } from "../skeleton";
import { sender } from "../../../config/logic";
import { Message } from "./message";
import { ChatState } from "../../../context/ChatProvider";
import { ProfileModal } from "../modals/profileModal";
import { GroupModal } from "../modals/GroupModal";
import socket from "../../../Socket.js";
import { TypingAnimation } from "../../Animations/typingAnimation";
var CompChat, Compperson;
export const Messagebox = () => {
  const { user, setSelectedChat, selectedChat, chatsFetch, setChatsFetch } =
    ChatState();
  //console.log(sender(user.result._id, selectedChat.users));
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  //const componentRef = useRef();
  const [inputHeight, setInputHeight] = useState("40px");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState([]);
  const [typing, setTyping] = useState();
  async function getMessages() {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      //console.log(data);
      setLoading(false);
      setMessages(data);
      socket.emit("join room", selectedChat._id);
    } catch (error) {
      console.log(error);
    }
  }
  async function sendMessage() {
    if (message) {
      try {
        // setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `/api/message`,
          { chatId: selectedChat._id, content: message },
          config
        );
        //console.log(data);
        setMessage("");
        // setLoading(false);
        socket.emit("new message", data);
        setInputHeight("40px");
        var textarea = document.getElementById("textArea");
        if (textarea) textarea.value = "";
        setMessages((prev) => [...prev, data]);
        setChatsFetch(!chatsFetch);
      } catch (error) {
        console.log(error);
      }
    }
  }
  function handleChange(event) {
    if (selectedChat) setMessage(event.target.value);
    event.target.style.height = "auto";

    setInputHeight(event.target.scrollHeight + "px");
    if (event.target.value === "") {
      setInputHeight("40px");
    }
    // const element = document.getElementById("messages");
    // if (element && element.scrollHeight != null)
    //   element.scrollTop = element.scrollHeight;
    if (!socketConnected) return;
    if (typing !== user.result.name)
      socket.emit("typing", {
        room: selectedChat._id,
        person: user.result.name,
      });
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength) {
        //console.log("stoptp1s");
        socket.emit("stop typing", {
          room: selectedChat._id,
          person: user.result.name,
        });
      }
    }, timerLength);
  }
  useEffect(() => {
    if (selectedChat) getMessages();
    if (CompChat) socket.emit("leave room", CompChat._id);
    CompChat = selectedChat;
    //setChatsFetch(!chatsFetch);
  }, [selectedChat]);
  useEffect(() => {
    socket.emit("setUser", user.result);
    socket.on("connection", () => setSocketConnected(true));
    socket.on("addtoGroup", () => {
      //console.log("addtoGroup");
      setChatsFetch(!chatsFetch);
    });
    socket.on("typing", (person) => {
      setTyping(person);
      Compperson = person;
      // console.log("stoptp", person, Compperson);
    });
    socket.on("stop typing", (person) => {
      // console.log("stoptp", person, typing, Compperson);
      if (person === Compperson) setTyping();
    });
  }, []);
  useEffect(() => {
    socket.on("messageRecived", (newMessage) => {
      if (!CompChat || CompChat._id !== newMessage.chat._id) {
        if (CompChat) console.log("DOIt", CompChat._id, newMessage.chat._id);
        setChatsFetch(!chatsFetch);
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });
  return (
    <>
      {selectedChat ? (
        <div className="chatbox">
          <div className="chatboxheader">
            <div className="">
              <i
                className="fa fa-3x fa-arrow-left "
                style={{ color: "white" }}
                onClick={() => setSelectedChat()}
              />
            </div>
            <div className="icc m-0 ms-2">
              <img
                alt="logo"
                className=" img rounded-circle me-2"
                data-bs-target="#exampleModal2"
                data-bs-toggle="modal"
                width="50px"
                src={
                  selectedChat.isGroupChat
                    ? selectedChat.groupAvatar
                    : sender(user.result._id, selectedChat.users).avatar
                }
              />
            </div>
            <div
              id="exampleModal2"
              className="modal fade "
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              {selectedChat.isGroupChat ? (
                <GroupModal chat={selectedChat} />
              ) : (
                <ProfileModal
                  profile={sender(user.result._id, selectedChat.users)}
                />
              )}
            </div>
            <div className="chatboxName">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : sender(user.result._id, selectedChat.users).name}
            </div>
          </div>
          {loading ? (
            <Skeleton />
          ) : (
            messages &&
            messages.length && (
              <Message messages={messages} height={inputHeight} />
            )
          )}
          <div className="bottomPart">
            {typing && (
              <div className="typing">
                {typing} typing
                <TypingAnimation />
              </div>
            )}
            <div id="input" className="input" style={{ height: inputHeight }}>
              <div className="frontinput">
                <i className="fa fain fa-smile-o fa-2x p-1 ps-2 " />
              </div>
              <textarea
                rows={1}
                id="txtArea"
                value={message}
                onChange={handleChange}
                className="sendInput scroll"
              />
              <div className="inputsend">
                <i
                  onClick={() => sendMessage()}
                  className="fa fain fa-paper-plane fa-lg p-2 "
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="centerc">Tap on any chat</div>
      )}
    </>
  );
};
