import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/HomePage';
import Login from './Components/Login';
import Chat from './Components/Chat'

class App extends Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/Chat" element={<Chat />} />
                    <Route path="/Login" element={<Login/>}/>
                </Routes>
            </Router>
        );
    }
}

export default App;