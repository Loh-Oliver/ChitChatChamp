import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdChatbubbles } from "react-icons/io";
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
      <h1>Choose your chat!</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", height: "700px" }}>
          <div
            style={{
              marginRight: "50px",
              border: "1px solid black",
              padding: "20px",
            }}
          >
            <h2>Speak to others</h2>
            <img
              src="your-image-url.jpg"
              alt="Image"
              style={{ width: "100px", height: "100px" }}
            />
            <p>
              Engage in real-time conversations with other users to practice and
              improve your language skills. Interact with native speakers and
              language learners alike in a dynamic environment.
            </p>
            <button
              style={{
                width: "400px",
                height: "100px",
                fontSize: "24px",
      
              }}
              onClick={() => handleButtonClick(1)}
            >
              Speak to others
            </button>
          </div>
          <div style={{ border: "1px solid black", padding: "20px" }}>
            <h2>AI Chat Bot</h2>
            <img
              src="your-image-url.jpg"
              alt="Image"
              style={{ width: "100px", height: "100px" }}
            />
            <p>
              Practice your language skills with an AI-powered chat bot. Receive
              instant responses, engage in conversation, and refine your
              language proficiency through interactive dialogue with artificial
              intelligence.
            </p>
            <button
              style={{
                width: "400px",
                height: "100px",
                marginRight: "20px",
                fontSize: "24px",
              }}
              onClick={() => handleButtonClick(2)}
            >
              AiChatBot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButtonPage;
