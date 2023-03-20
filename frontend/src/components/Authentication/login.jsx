import React, { useState } from "react";
import "./login.css";
import "font-awesome/css/font-awesome.min.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router";

import {
  faEnvelope,
  faUser,
  faKey,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("log in");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //const [avatar, setAvatar] = useState("");

  const login = useGoogleLogin({
    onSuccess: async (user) => {
      setLoading(true);
      //console.log(user);
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          //console.log(res.tokenId);
          const u = {
            name: res.data.name,
            email: res.data.email,
            oauth: true,
            avatar: res.data.picture,
          };

          sendData(u);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  const validCheak = () => {
    setLoading(true);
    if (state === "sign up") {
      if (password !== cPassword) {
        document
          .getElementById("confirm_password")
          ?.setCustomValidity("Passwords Don't Match");
      } else {
        // console.log("y");
        document.getElementById("confirm_password").setCustomValidity("");
      }
    }
    setLoading(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    document.getElementById("confirm_password")?.setCustomValidity("");
    const user = {
      name,
      email,
      password,
    };
    sendData(user);
    setLoading(false);
  };
  async function sendData(user) {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      let add = "/api/user";
      if (state === "log in") add = "api/user/login";
      const { data } = await axios.post(add, user, config);
      // console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="login">
      <div className="container ">
        <div className="d-flex justify-content-center">
          <div className="card vcenter">
            <img
              alt="logo"
              className="center itop"
              src="logoo.png"
              width="120px"
            />

            <div className="card-header center">
              <h3> Sign Up</h3>
            </div>
            <div className="card-body">
              <form onSubmit={submitHandler}>
                {state === "sign up" && (
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <FontAwesomeIcon className="fa-xl" icon={faUser} />
                      </span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon className="fa-xl" icon={faEnvelope} />
                    </span>
                  </div>
                  <input
                    type="email"
                    name="username"
                    className="form-control"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon className="fa-xl" icon={faKey} />
                    </span>
                  </div>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" id="basic-addon2">
                      <FontAwesomeIcon
                        className="fa-md"
                        onClick={() => setShow(!show)}
                        icon={show ? faEye : faEyeSlash}
                      />
                    </span>
                  </div>
                </div>
                {state === "sign up" && (
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <FontAwesomeIcon className="fa-xl" icon={faKey} />
                      </span>
                    </div>
                    <input
                      type={show ? "text" : "password"}
                      name="cpassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      id="confirm_password"
                      onChange={(e) => setCPassword(e.target.value)}
                      required
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon2">
                        <FontAwesomeIcon
                          className="fa-md"
                          onClick={() => setShow(!show)}
                          icon={show ? faEye : faEyeSlash}
                        />
                      </span>
                    </div>
                  </div>
                )}
                <div className="form-group ">
                  <button
                    type="submit"
                    // isLoading={Loading}
                    onClick={validCheak}
                    className="btn mt-3 login_btn center"
                  >
                    {loading ? (
                      <div className="text-center">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      state
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="google-btn center">
              <div onClick={() => login()}>
                <div className="google-icon-wrapper">
                  <img
                    alt="googlebaba"
                    className="google-icon"
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  />
                </div>
                <p className="btn-text cursor-pointer">
                  <b>Sign in with google</b>
                </p>
              </div>
            </div>
            <div className="card-footer">
              {state === "log in" ? (
                <div className="d-flex justify-content-center link footer">
                  Don&apos;t have an account?{"   "}
                  <strong
                    className="text-primary cursor-pointer"
                    onClick={() => setState("sign up")}
                  >
                    Sign Up
                  </strong>
                </div>
              ) : (
                <div className="d-flex justify-content-center link footer">
                  Already have an account?{"   "}
                  <strong
                    className="text-primary cursor-pointer"
                    onClick={() => setState("log in")}
                  >
                    {" "}
                    Log In
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
