
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Main Page</h1>
      <Link to="/AIChatbot">
        <button>Go to AIChatbot Page</button>
      </Link>
    </div>
  );
}

export default HomePage;