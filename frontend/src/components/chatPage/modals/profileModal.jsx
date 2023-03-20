import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../chatPage.css";
import axios from "axios";
import { useNavigate } from "react-router";
import "font-awesome/css/font-awesome.min.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatState } from "../../../context/ChatProvider";
export const ProfileModal = ({ profile }) => {
  const { user, setUser } = ChatState();

  const [editable, setEditable] = useState(false);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  var prouser = user;
  const edit = () => {
    setEditable(true);
  };
  let editbutton = false;
  if (user.result.email === profile.email) editbutton = true;
  //console.log("props", profile);
  const saveClick = async () => {
    var name = "";
    name = document.getElementById("edit").innerText;
    setEditable(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "api/user/update",
        { name, id: user.result.id, avatar },
        config
      );
      //console.log(data);
      prouser.result = data;
      setUser(prouser);
      localStorage.setItem("userInfo", JSON.stringify(prouser));
      navigate("/");
      //setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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
  useEffect(() => {
    setAvatar(profile.avatar);
  }, [profile]);
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content text-center ">
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
        <div className="d-flex mx-auto proimg" style={{ position: "relative" }}>
          {loading ? (
            <div className="text-center mx-auto my-auto">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <img alt="logo" className=" img rounded-circle " src={avatar} />
          )}

          {editbutton && (
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
          )}
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
        <div
          id="edit"
          contentEditable={editable}
          className="modal-body proname"
        >
          {profile.name}
        </div>
        <p>Email : {profile.email}</p>
        <div className="modal-footer ">
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
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
ProfileModal.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};
