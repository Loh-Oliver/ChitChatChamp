import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/HomePage";
import Login from "./Components/Login";
import Chat from "./Components/Chat";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login socket={socket} />} />
          <Route path="/chat/:room" element={<Chat socket={socket} />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
