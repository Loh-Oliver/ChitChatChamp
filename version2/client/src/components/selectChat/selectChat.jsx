import React, { useState } from 'react';
import "./selectChat.css";
import Navbar from "../global/Navbar";
import Footer from "../global/Footer";
import { useNavigate } from 'react-router-dom';

function SelectChat() {
    const [selectedChat, setSelectedChat] = useState(null);
    const navigate = useNavigate();

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        if (chat === 'AIChatbot') {
          navigate('/AiChatBot'); // Navigate to AI Chatbot route
        } else if (chat === 'LiveChat') {
          navigate('/chat'); // Navigate to Live Chat route
        }
      };

  return (
    <div>
      <h1>Select Your Preferred Language</h1>
      <div>
        <button onClick={() => handleChatSelect('AIChatbot')}>AIChatbot</button>
        <button onClick={() => handleChatSelect('LiveChat')}>LiveChat</button>

      </div>
    </div>
  );
}

export default SelectChat;
