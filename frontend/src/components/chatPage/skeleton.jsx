import React from "react";
import "./chatPage.css";
export const Skeleton = () => {
  return (
    <div className="">
      <div className="skele line " style={{ height: "40px" }}></div>
      <div className="skele line ms-auto" style={{ height: "50px" }}></div>
      <div className="line skele" style={{ height: "35px" }}></div>
      <div
        className="line skele"
        style={{ height: "70px", width: "70%" }}
      ></div>
      <div className="skele line " style={{ height: "40px" }}></div>
      <div className="skele line ms-auto" style={{ height: "50px" }}></div>
      <div className="line skele" style={{ height: "35px" }}></div>
      <div
        className="line skele"
        style={{ height: "70px", width: "70%" }}
      ></div>
    </div>
  );
};
