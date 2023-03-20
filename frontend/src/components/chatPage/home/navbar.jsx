import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import "../chatPage.css";
import axios from "axios";
import { GroupModal } from "../modals/GroupModal";
import { ProfileModal } from "../modals/profileModal";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router";
import { People } from "../People";
import {
  faPen,
  faMagnifyingGlass,
  faEllipsisVertical,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { Homechats } from "./homechats";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export const Navbar = () => {
  const navigate = useNavigate();
  const { user, setSelectedChat, chatsFetch, setChatsFetch } = ChatState();
  //const [loading, setLoading] = useState(false);

  //console.log(user?.result.name);

  const logOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const containerRef = useRef(null);
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = (e) => {
    const bcollapseElements = document.getElementsByClassName("bcollapse");
    const mainchatElement = document.getElementsByClassName("mainchat")[0];

    if (containerRef.current && !containerRef.current.contains(e.target)) {
      for (const bcollapseElement of bcollapseElements) {
        bcollapseElement.classList.remove("show");
      }
      if (!e.target.classList.contains("search"))
        mainchatElement.classList.add("show");
    }
  };
  async function accesschat(chat) {
    try {
      //setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat`,
        { userId: chat._id },
        config
      );
      // setChats();
      setChatsFetch(!chatsFetch);
      setSelectedChat(data);
      console.log("selectedChat", data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div id="page-container">
      {/* <img alt="logo" className="itop" src="logoo.png" width="40px" /> */}

      <nav className="navbar  navbar-light ">
        <div className=" container">
          <div className="chat">Daily Chat</div>

          <FontAwesomeIcon
            data-bs-toggle="collapse"
            // ref={containerRef}
            data-bs-target="#collitem"
            icon={faMagnifyingGlass}
            className="fa-light fa-xl search"
          />

          <FontAwesomeIcon
            icon={faPen}
            className="fa-light fa-xl"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal3"
          />
          <div className="me-1" style={{ width: "30px", height: "30px" }}>
            <img
              alt="logo"
              className=" img rounded-circle me-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              src={user.result.avatar}
            />
          </div>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="fa-light fa-xl"
            data-bs-toggle="collapse"
            data-bs-target="#mynavbar"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            id="mynavbar"
            className="navbar-collapse bcollapse collapse"
          >
            <ul className="navbar-nav ">
              <li className="nav-item nav-link">
                Log out
                <FontAwesomeIcon
                  onClick={logOut}
                  style={{ marginLeft: "5px" }}
                  icon={faSignOut}
                />
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">
                  ABOUT
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="/contact">
                  CONTACT
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div
        id="exampleModal"
        className="modal fade "
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <ProfileModal profile={user.result} />
      </div>
      <div
        id="exampleModal3"
        className="modal fade "
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <GroupModal />
      </div>
      <div
        // id="mynavbar"
        id="collitem"
        className=" mx-auto bcollapse collapse  "
        onClick={(e) => e.stopPropagation()}
        //ref={containerRef}
      >
        <People choose={accesschat} onClose={handleClick} />
      </div>

      <div
        id="collitem"
        ref={containerRef}
        //onClick={(e) => e.stopPropagation()}
        className="mainchat collapse show mm "
      >
        <Homechats />
      </div>
    </div>
  );
};
