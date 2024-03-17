// LanguageSelectionPage.jsx

import React, { useState } from 'react';
import "./LanguageSelection.css";
function LanguageSelectionPage() {
  // State to keep track of the selected language
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Function to handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    // You can add additional logic here, such as navigating to another page
  };

  return (
    <div>
      <h1>Select Your Preferred Language</h1>
      <div>
        {/* Example buttons for language selection */}
        <button onClick={() => handleLanguageSelect('English')}>English</button>
        <button onClick={() => handleLanguageSelect('Spanish')}>Spanish</button>
        <button onClick={() => handleLanguageSelect('French')}>French</button>
        {/* Add more buttons or UI elements for other languages */}
      </div>
      {selectedLanguage && (
        <p>You have selected {selectedLanguage} as your preferred language.</p>
      )}
    </div>
  );
}

export default LanguageSelectionPage;
