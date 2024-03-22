import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/HomePage";
import Login from "./Components/Login";
import Chat from "./Components/Chat";
import LanguageSelection from "./Components/AiChatBot/LanguageSelection"
import AiChatBot from "./Components/AiChatBot/AIChatBot"
import SelectPage from "./Components/SelectChatPage"
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
          <Route path="/AIChatBot/:language" element={<AiChatBot />} />
          <Route path="/LanguageSelection" element={<LanguageSelection />} />
          <Route path="/selectChat" element={<SelectPage/>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;
