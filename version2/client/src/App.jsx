import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "@/components/chat";
import Login from "@/components/login";
import Home from "../src/components/homePage/homePage"
import Language from "../src/components/selectLangauge/LanguageSelection"
import SelectChat from "../src/components/selectChat/selectChat"
import AiChatBot from "../src/components/AiChatBot/AIChatBot"

function App() {
  const [user, setUser] = useState(null);
  const [secret, setSecret] = useState(null);
  const isAuth = Boolean(user) && Boolean(secret);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/AiChatBot" element={<AiChatBot/>}/>
          <Route
            path="/login"
            element={
              isAuth ? (
                <Navigate to="/selectChat" />
              ) : (
                <Login setUser={setUser} setSecret={setSecret} />
              )
            }
          />
          <Route
            path="/chat"
            element={
              isAuth ? (
                <Chat user={user} secret={secret} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/languageSelection" element={<Language/>}/>
          <Route path="/selectChat" element={<SelectChat/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
