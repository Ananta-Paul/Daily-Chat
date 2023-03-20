import React from "react";
import "../chatPage.css";

export const ChatSkeleton = () => {
  return (
    <div className="chats center skele d-flex " style={{}}>
      <div
        className="icc rounded-circle me-2"
        style={{ backgroundColor: "#ddd" }}
      ></div>
      <div>
        <div
          className="chatName"
          style={{
            height: "15px",
            width: "122px",
            backgroundColor: "#ddd",
            marginTop: "10px",
          }}
        />
        <div
          className="latestChat "
          style={{
            height: "15px",
            width: "200px",
            backgroundColor: "#ddd",
            marginTop: "10px",
          }}
        ></div>
      </div>
    </div>
  );
};
