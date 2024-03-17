import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage';
import AiChatbot from './pages/AIChatBot'


class App extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/AIChatBot" element={<AiChatbot/>}/>
                </Routes>
            </Router>
        );
    }
}

export default App;