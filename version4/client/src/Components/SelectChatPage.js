import React from "react";
import { useNavigate } from "react-router-dom";

function ButtonPage() {
  const navigate = useNavigate();

  const handleButtonClick = (buttonNumber) => {
    console.log(`Button ${buttonNumber} clicked`);
    // Navigate to different pages based on button clicks
    if (buttonNumber === 1) {
      navigate("/login");
    } else if (buttonNumber === 2) {
      navigate("/LanguageSelection");
    }
  };

  return (
    <div>
      <h1>Welcome to Button Page</h1>
      <button onClick={() => handleButtonClick(1)}>Speak to others</button>
      <button onClick={() => handleButtonClick(2)}>AiChatBot</button>
    </div>
  );
}

export default ButtonPage;
