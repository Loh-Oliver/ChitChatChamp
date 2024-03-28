import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LanguageSelection.css'; // Import the CSS file for styling
import NavBar from "../NavBar"
import Button from "@mui/material/Button";

function LanguageSelectionPage() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    navigate(`/AIchatbot/${language}`); // Pass language as a URL parameter
  };

  return (
    <div>
      <NavBar />
      <h1>Select Your Preferred Language</h1>
      <div className="button-grid">
        <CustomButton onClick={() => handleLanguageSelect('English')} imageSrc="https://www.countryflags.com/wp-content/uploads/united-states-of-america-flag-png-large.png" buttonText="English" />
        <CustomButton onClick={() => handleLanguageSelect('Chinese')} imageSrc="https://www.countryflags.com/wp-content/uploads/china-flag-png-large.png" buttonText="Chinese" />
        <CustomButton onClick={() => handleLanguageSelect('Indonesian')} imageSrc="https://www.countryflags.com/wp-content/uploads/indonesia-flag-png-large.png" buttonText="Indonesian" />
        <CustomButton onClick={() => handleLanguageSelect('French')} imageSrc="https://www.countryflags.com/wp-content/uploads/france-flag-png-large.png" buttonText="French" />
      </div>
      {selectedLanguage && (
        <p>You have selected {selectedLanguage} as your preferred language.</p>
      )}
    </div>
  );
}

// CustomButton component for rounded buttons with image and text
// CustomButton component for rounded buttons with image and text
const CustomButton = ({ onClick, imageSrc, buttonText }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      className="custom-button"
      
      style={{
        borderRadius: '15px', // Rounded button style
        border: '2px solid white', // Border style
        color: 'white', // Border color
        width:"300px",
        height:"250px"
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
        <img src={imageSrc} alt={buttonText} className="button-image" style={{ borderRadius: '25%', width: '100px', height: '100px', marginBottom: '5px' }} /> {/* Rounded image */}
        <p className="button-text">{buttonText}</p> {/* Text below the image */}
      </div>
    </Button>
  );
}


export default LanguageSelectionPage;
