import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./languageSelection.css";
function LanguageSelectionPage() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    navigate(`/chat/:language`); // Pass language as a URL parameter
  };

  return (
    <div>
      <h1>Select Your Preferred Language</h1>
      <div>
        <button onClick={() => handleLanguageSelect('English')}>English</button>
        <button onClick={() => handleLanguageSelect('Spanish')}>Spanish</button>
        <button onClick={() => handleLanguageSelect('French')}>French</button>
      </div>
      {selectedLanguage && (
        <p>You have selected {selectedLanguage} as your preferred language.</p>
      )}
    </div>
  );
}

export default LanguageSelectionPage;
