import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdChatbubbles } from "react-icons/io";
import NavBar from "./NavBar"
import Button from "@mui/material/Button";
function ButtonPage() {
  const navigate = useNavigate();

  const handleButtonClick = (ButtonNumber) => {
    console.log(`Button ${ButtonNumber} clicked`);
    // Navigate to different pages based on Button clicks
    if (ButtonNumber === 1) {
      navigate("/login");
    } else if (ButtonNumber === 2) {
      navigate("/LanguageSelection");
    }
  };

  return (
    <div>
      <NavBar></NavBar>
      <h1>Choose your chat!</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop:"50px",
          height: "70vh",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", height: "500px" }}>
          <div
            style={{
              marginRight: "50px",
              border: "1px solid black",
              padding: "20px",
            }}
          >
            <h2>Speak to others</h2>
            <img
              src="https://img.freepik.com/premium-vector/social-man-woman-speaking-each-other-exchange-information-with-speech-bubble_516169-22.jpg?w=1800"
              alt="Image"
              style={{ width: "200px", height: "200px" }}
            />
            <p>
              Engage in real-time conversations with other users to practice and
              improve your language skills. Interact with native speakers and
              language learners alike in a dynamic environment.
            </p>
            <Button variant="contained"
              style={{
                width: "400px",
                height: "100px",
                fontSize: "24px",
      
              }}
              onClick={() => handleButtonClick(1)}
            >
              Speak to others
            </Button>
          </div>
          <div style={{ border: "1px solid black", padding: "20px" }}>
            <h2>AI Chat Bot</h2>
            <img
              src="https://d2jx2rerrg6sh3.cloudfront.net/image-handler/ts/20220504114113/ri/1350/src/images/Article_Images/ImageForArticle_22457_16516788730473249.jpg"
              alt="Image"
              style={{ width: "300px", height: "200px" }}
            />
            <p>
              Practice your language skills with an AI-powered chat bot. Receive
              instant responses, engage in conversation, and refine your
              language proficiency through interactive dialogue with artificial
              intelligence.
            </p>
            <Button variant="contained"
              style={{
                width: "400px",
                height: "100px",
                marginRight: "20px",
                fontSize: "24px",
              }}
              onClick={() => handleButtonClick(2)}
            >
              AiChatBot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButtonPage;
