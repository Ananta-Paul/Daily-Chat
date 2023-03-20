import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../chatPage.css";
import axios from "axios";
import { People } from "../People";
//import { useNavigate } from "react-router";
import "font-awesome/css/font-awesome.min.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatState } from "../../../context/ChatProvider";
import { isExist, getusers } from "../../../config/logic";
import socket from "../../../Socket.js";
export const GroupModal = ({ chat }) => {
  const { user, chatsFetch, setChatsFetch, setSelectedChat } = ChatState();

  const [editable, setEditable] = useState(false);
  const [search, setSearch] = useState(false);

  const [avatar, setAvatar] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [chatName, setChatName] = useState();
  const edit = () => {
    setEditable(true);
  };
  if (!chat && !editable) edit();
  //if (user.result.email === profile.email) editbutton = true;
  //console.log("props", profile);
  const postDetails = (pics) => {
    if (pics === undefined) {
      return;
    }
    setLoading(true);
    //console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "da70ewyd6");
      fetch("https://api.cloudinary.com/v1_1/da70ewyd6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatar(data.url.toString());

          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
      return;
    }
  };
  async function createGroup() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "api/chat/group",
        { name: chatName, groupAvatar: avatar, users: getusers(users) },
        config
      );
      // console.log(data);
      setChatsFetch(!chatsFetch);
      setAvatar(
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      );
      setChatName();
      setUsers([]);
      setSelectedChat(data);
      // navigate("/");
      //setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function updateGroup() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/group",
        { chatId: chat._id, chatName, groupAvatar: avatar },
        config
      );
      // console.log(data);
      setChatsFetch(!chatsFetch);

      setUsers([]);
      // navigate("/");
      //setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  const saveClick = async () => {
    if (!chat) createGroup();
    else updateGroup();
  };
  async function addUsertoGroup(userId) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/groupadd",
        { chatId: chat._id, userId },
        config
      );

      socket.emit("addtogroup", userId);

      console.log(userId);
      //  setChatsFetch(!chatsFetch);
      // navigate("/");
      //setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  async function removeUser(userId) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/groupremove",
        { chatId: chat._id, userId },
        config
      );
      // console.log(data);
      setChatsFetch(!chatsFetch);

      // navigate("/");
      //setLoading(false);
      if (user.result._id === userId) setSelectedChat();
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }
  const addUser = (a) => {
    if (chat && !isExist(a._id, users)) addUsertoGroup(a._id);
    if ((chat && !isExist(a._id, users)) || (!chat && !isExist(a._id, users)))
      setUsers((pre) => [...pre, a]);
    // console.log(users);
  };

  useEffect(() => {
    //console.log("rerender", chat);
    if (chat) {
      setAvatar(chat.groupAvatar);
      setChatName(chat.chatName);
      setUsers(chat.users);
    }
    setSearch(false);
    setEditable(false);
  }, [chat]);
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content text-center ">
        <div className={search ? "d-none" : ""}>
          <div className="modal-header">
            <h5 className=" modal-title" id="staticBackdropLabel">
              Profile
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div
            className="d-flex mx-auto proimg"
            style={{ position: "relative" }}
          >
            {loading ? (
              <div className="text-center mx-auto my-auto">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <img alt="logo" className=" img rounded-circle " src={avatar} />
            )}

            <FontAwesomeIcon
              className=" fa-xl"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                width: "40px",
                height: "40px",

                borderRadius: "50%",
              }}
              onClick={edit}
              icon={faPenToSquare}
            />
          </div>

          {editable && (
            <div className="ms-auto">
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg,image/gif"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </div>
          )}
          {chat && !editable ? (
            <div
              id="edit"
              contentEditable={editable}
              className="modal-body proname"
            >
              {chat.chatName}
            </div>
          ) : (
            <input
              className="inputname mx-auto p-2"
              placeholder="Enter Group name..."
              defaultValue={chat && chat.chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
          )}
        </div>
        <p className="p-2">Members:</p>
        <div className="chatcontainer addmember ">
          {users.map((person) => (
            <div key={person._id} className=" px-2">
              <div
                className="d-flex mx-auto icc"
                style={{ position: "relative" }}
              >
                <img
                  alt="logo"
                  className=" img rounded-circle "
                  src={person.avatar}
                  width="50px"
                />
                {chat && chat?.groupAdmin?._id === user.result._id && (
                  <button
                    onClick={() => removeUser(person._id)}
                    className="btn-close"
                  />
                )}
              </div>
              <p>{person.name}</p>
            </div>
          ))}
        </div>
        {search ? (
          <>
            <People choose={addUser} onClose={() => setSearch(false)} />
          </>
        ) : (
          <div className="p-2" onClick={() => setSearch(true)}>
            <i className="fa fa-2x fa-user-plus" />
            Add members
          </div>
        )}
        <div className="modal-footer ">
          {chat && user.result._id !== chat.groupAdmin._id && (
            <button
              type="button"
              className="btn btn-danger me-auto"
              data-bs-dismiss="modal"
              onClick={() => removeUser(user.result._id)}
            >
              Leave
              <i
                className="fa fa-sign-out ms-auto ps-1"
                style={{ color: "white" }}
              />
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          {editable && (
            <button
              onClick={saveClick}
              type="button"
              data-bs-dismiss="modal"
              className="btn btn-primary"
            >
              {chat ? "Save" : "Create"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

GroupModal.propTypes = {
  chat: PropTypes.any,
};
