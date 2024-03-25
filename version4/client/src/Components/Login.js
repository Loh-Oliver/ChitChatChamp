import "./Login.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import NavBar from "./NavBar";

const socket = io.connect("http://localhost:3001");

function Login() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    // Prefill the username and room
    const prefillUsername = "John"; // Set your default username here
    const prefillRoom = "Room123"; // Set your default room here

    // Set the username and room state
    setUsername(prefillUsername);
    setRoom(prefillRoom);

    // Emit the join_room event
    socket.emit("join_room", prefillRoom);
    setShowChat(true);
  };

  return (
    <div>
      <NavBar></NavBar>
      <h1>
        Start a conversation!
      </h1>
      {/* Conditional rendering based on showChat state */}
      {showChat ? (
        <Chat socket={socket} username={username} room={room} />
      ) : (
        <div className="grid-container">
          <div className="grid-item-1">
            <img
              src="https://material-ui.com/static/images/avatar/1.jpg"
              alt="Avatar"
            />
            <h3>Justin DW</h3>
            <p>I like chess and chinese</p>
            <div className="joinChatContainer">
              {/* Remove the input fields for username and room */}
              <button onClick={joinRoom}>Talk to him</button>
            </div>
          </div>
          <div className="grid-item-1">
            <img
              src="https://material-ui.com/static/images/avatar/1.jpg"
              alt="Avatar"
            />
            <h3>Justin DW</h3>
            <p>I like chess and chinese</p>
            <div className="joinChatContainer">
              {/* Remove the input fields for username and room */}
              <button onClick={joinRoom}>Talk to him</button>
            </div>
          </div>
          <div className="grid-item-1">
            <img
              src="https://material-ui.com/static/images/avatar/1.jpg"
              alt="Avatar"
            />
            <h3>Justin DW</h3>
            <p>I like chess and chinese</p>
            <div className="joinChatContainer">
              {/* Remove the input fields for username and room */}
              <button onClick={joinRoom}>Talk to him</button>
            </div>
          </div>
          
          {/* Add more grid items as needed */}
        </div>
      )}
    </div>
  );
}

export default Login;
