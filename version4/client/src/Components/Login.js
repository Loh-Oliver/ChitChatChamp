import "./Login.css";
import io from "socket.io-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import NavBar from "./NavBar";

const socket = io.connect("http://localhost:3001");

function Login() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      navigate(`/chat/${room}`); // Navigate to the chat page with the room ID
    }
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className="Login">
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
