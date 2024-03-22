// HomePage.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import NavBar from "./NavBar"

function HomePage() {
  return (
    <div className="home-container">
      <NavBar></NavBar>
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-heading">Speak fluently with ChitChatChamp</h1>
            <p className="hero-description">
              Practice speaking, listening, reading, and writing in multiple
              languages with our AI-powered chatbot.
            </p>
            <Link to="/selectChat" className="get-started-button">
              Get Started
            </Link>
          </div>
          <div className="hero-image">
            <img
              src="https://theedgemalaysia.com/_next/image?url=https%3A%2F%2Fassets.theedgemarkets.com%2FDE12-learning-tem1394_20211029114132_theedgemarkets.jpg&w=1920&q=75"
              alt="Hero"
            />
          </div>
        </section>
        <section className="feature-section">
          <h2 className="feature-heading">Why Choose ChitChatChamp?</h2>
          <div className="features">
            <div className="feature">
              <h3 className="feature-title">Interactive Conversations</h3>
              <p className="feature-description">
                Engage in realistic conversations with our AI chatbot to improve
                your language skills.
              </p>
            </div>
            <div className="feature">
              <h3 className="feature-title">Personalized Learning</h3>
              <p className="feature-description">
                Receive personalized feedback and tailored lessons based on your
                learning pace and goals.
              </p>
            </div>
            <div className="feature">
              <h3 className="feature-title">Progress Tracking</h3>
              <p className="feature-description">
                Track your progress, earn achievements, and stay motivated on
                your language learning journey.
              </p>
            </div>
          </div>
        </section>
        <section className="cta-section">
          <h2 className="cta-heading">Start Learning Today</h2>
          <p className="cta-description">
            Join millions of learners worldwide and start your language learning
            journey with ChitChatChamp.
          </p>
          <Link to="/signup" className="cta-button">
            Sign Up Now
          </Link>
        </section>
 
      </main>
     
    </div>
    
  );
}

export default HomePage;
