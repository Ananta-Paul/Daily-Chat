import React from "react";
import Home from "./pages/home";
import "./App.css";
import Chatpage from "./pages/Chatpage";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />;
      <Route path="/chats" element={<Chatpage />} />;
    </Routes>
  );
}

export default App;
