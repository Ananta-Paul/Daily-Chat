import React from "react";
import "../chatPage.css";
//import { ChatState } from "../../../context/ChatProvider";
import PropTypes from "prop-types";
export const Chats = ({ avatar, name, chat, onClick, unread }) => {
  // const { user } = ChatState();

  return (
    <div className="chats center" onClick={() => onClick(chat)}>
      <div className="icc">
        <img
          alt="logo"
          className=" img rounded-circle me-2"
          src={avatar}
          width="50px"
        />
      </div>
      <div style={{ width: "calc(100% - 26px)" }}>
        <div className="chatName">{name}</div>
        <div className="latestChat">{chat}</div>
      </div>
      {unread && <div className="unread">{unread}</div>}
    </div>
  );
};
// Chats.propTypes = {
//   profile: PropTypes.shape({
//     name: PropTypes.string,

//     avatar: PropTypes.string,
//   }).isRequired,
// };
// Chats.propTypes = {
//   avatar: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
// };
Chats.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  chat: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  unread: PropTypes.number,
};
