import "./Login.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import NavBar from "./NavBar";
import Button from "@mui/material/Button";
/* const socket = io.connect("http://localhost:3001");
console.log(socket) */
function Login({ socket }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
 
  const joinRoom = (username, password) => {
    // Set the username and room state
    setUsername(username);

    const prefillRoom = 1;
    setRoom(prefillRoom);
    // Emit the join_room event
    
    const img= socket.emit("join_room", prefillRoom);
    console.log(img);
    setShowChat(true);
  };

  return (
    <div>
      <NavBar></NavBar>

      {/* Conditional rendering based on showChat state */}
      {showChat ? (
        <Chat socket={socket} username={username} room={room} />
      ) : (
        <div>
          <h1>Start a conversation!</h1>
          <div className="grid-container">
            <div className="grid-item-1">
              <img
                src="https://material-ui.com/static/images/avatar/1.jpg"
                alt="Avatar"
              />
              <h3>Juicetin Dominic Welsh</h3>
              <p>I like chess and chinese</p>
              <div className="joinChatContainer">
                {/* Remove the input fields for username and room */}
                <Button
                  variant="contained"
                  onClick={() => joinRoom("Justin", "123")}
                >
                  Talk to him
                </Button>
              </div>
            </div>
            <div className="grid-item-1">
              <img
                src="https://material-ui.com/static/images/avatar/1.jpg"
                alt="Avatar"
              />
              <h3>Nicola Cage</h3>
              <p>I like Beer and want to learn german</p>
              <div className="joinChatContainer">
                {/* Remove the input fields for username and room */}
                <Button
                  variant="contained"
                  onClick={() => joinRoom("Oliver", "123")}
                >
                  Talk to him
                </Button>
              </div>
            </div>
            <div className="grid-item-1">
              <img
                src="https://material-ui.com/static/images/avatar/1.jpg"
                alt="Avatar"
              />
              <h3>Shawney Kingston</h3>
              <p>I like birds and want to learn korean</p>
              <div className="joinChatContainer">
                {/* Remove the input fields for username and room */}
                <Button
                  variant="contained"
                  onClick={() => joinRoom("Nicholas", "123")}
                >
                  Talk to him
                </Button>
              </div>
            </div>

            {/* Add more grid items as needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
