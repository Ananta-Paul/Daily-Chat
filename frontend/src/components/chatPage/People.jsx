import React, { useState } from "react";
import { Chats } from "./home/Chats";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import PropTypes from "prop-types";
import { ChatSkeleton } from "./home/chatSkeleton";

export const People = ({ chat, choose, onClose }) => {
  const { user } = ChatState();
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const getUser = async (e) => {
    const search = e.target.value;
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" input-group w-90">
        <input
          className="form-control "
          type="text"
          name="search"
          onChange={getUser}
          placeholder="Search people..."
          aria-describedby="basic-addon1"
        />
        <button
          className="btn btn-outline-secondary btn-close"
          type="button"
          onClick={(e) => onClose(e)}
          id="basic-addon1"
        />
      </div>
      <div className="chatcontainer">
        {loading ? (
          <>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </>
        ) : (
          searchResult.map((person) => (
            <Chats
              onClick={() => choose(person)}
              key={person._id}
              name={person.name}
              avatar={person.avatar}
              chat={person.email}
            />
          ))
        )}
      </div>
    </>
  );
};
People.propTypes = {
  chat: PropTypes.any,
  choose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
