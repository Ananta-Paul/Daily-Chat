import React, { useEffect, useRef } from "react";
import "./messagebox.css";
import PropTypes from "prop-types";
import axios from "axios";
import { isSame, isLast, isFirst, getRandom } from "../../../config/logic.js";
import { ChatState } from "../../../context/ChatProvider";
import { Virtuoso } from "react-virtuoso";

export const Message = ({ messages, height }) => {
  const { user, selectedChat } = ChatState();
  const virtuosoRef = useRef();
  // const [initialTopMostItemIndex, setInitialTopMostItemIndex] = useState(
  //   messages.length - 1
  // );
  // const [scroll, setScroll] = useState(false);
  const handleViewChange = async (range) => {
    // console.log(messages[range.endIndex]);
    for (let i = range.endIndex; i >= range.startIndex; i--) {
      // console.log(user.result._id, i);
      if (messages[i] && !messages[i].readBy.includes(user.result._id)) {
        messages[i].readBy.push(user.result._id);
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            "api/message/readBy",
            { messageId: messages[i]._id },
            config
          );
          // console.log(data);
        } catch (error) {
          console.log(error);
        }
      } else return;
    }
  };

  useEffect(() => {
    // Only scroll if messages is not empty
    if (messages && messages.length > 0) {
      //console.log("length" + messages.length);
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1 - selectedChat.unreadCount,
        behavior: "auto",
      });
    }
  });

  return (
    <>
      <Virtuoso
        style={{
          height: `calc(88vh - ${height})`,
        }}
        ref={virtuosoRef}
        totalCount={messages.length}
        className="scroll messageContainer"
        itemContent={(index) => (
          <div
            style={{ paddingBottom: isLast(messages, index) ? "15px" : "2px" }}
          >
            <div
              key={messages[index]._id}
              className={
                "message " +
                (isLast(messages, index) ? "bubble " : "") +
                (isSame(user, messages[index]) ? "samesender bubbleme" : "")
              }
            >
              {!isSame(user, messages[index]) && isFirst(messages, index) && (
                <div
                  className="sendername"
                  style={{
                    backgroundColor: getRandom(messages[index].sender._id),
                    borderRadius: "5px",
                  }}
                >
                  {messages[index].sender.name}
                </div>
              )}
              <div style={{ flexGrow: 1 }}>{messages[index].content}</div>

              <div className="time" style={{ textAlign: "right" }}>
                {new Date(messages[index].createdAt).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )}
              </div>
            </div>
          </div>
        )}
        rangeChanged={handleViewChange}
      />
    </>
  );
};

Message.propTypes = {
  messages: PropTypes.array.isRequired,
  height: PropTypes.string.isRequired,
};
