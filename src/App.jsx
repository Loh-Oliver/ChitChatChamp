import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/HomePage';
import LanguageSelectionPage from './pages/AiChatBot/LanguageSelection';
import AIChatBot from './pages/AiChatBot/AIChatBot';

class App extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/AIChatBot" element={<AIChatBot/>}/>
                    <Route path="/SelectLangauge" element={<LanguageSelectionPage/>}/>
                   
                </Routes>
            </Router>
        );
    }
}

export default App;