import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import { BsTranslate } from "react-icons/bs";
import { RiSpeakLine } from "react-icons/ri";
import { FaClipboardQuestion } from "react-icons/fa6";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Button from "@mui/material/Button";
import OpenAI from "openai";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

function Chat({ socket, username, room }) {
  const classes = useStyles();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const synth = window.speechSynthesis;
  const [suggestions, setSuggestions] = useState(Array(3).fill(""));
  //GPT translate
  const API_KEY = "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";

  const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

  async function moderation(message) {
    const moderationResult = await openai.moderations.create({
        input: message,
    });

    console.log(moderationResult);

    // Extract the "flagged" value from the moderationResult object
    const flagged = moderationResult.results[0].flagged;
    console.log(flagged); // Output: true

    return flagged; // Return the flagged value
}

  async function processSingleMessageToChatGPT(text) {
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "translate to English." + text }],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Check the response data structure
      const generatedMessage = data.choices[0].message.content;
      return generatedMessage;
    } catch (error) {
      console.error("Error processing message:", error);
      return null;
    }
  }

  async function getSuggestion(text) {
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "get me 3 easy suggestion to reply this" + text,
        },
      ],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Check the response data structure
      const generatedMessage = data.choices[0].message.content;
      console.log(generatedMessage);
      // Assuming the returned string is stored in a variable called suggestionsString
      const suggestionsArray = generatedMessage.split("\n");
      setSuggestions(suggestionsArray);
    } catch (error) {
      console.error("Error processing message:", error);
      return null;
    }
  }

  //send message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const moderatedMessage = await moderation(currentMessage); // Check if the message is flagged by moderation
  
      if (!moderatedMessage) {
        const messageData = {
          room: room,
          author: username,
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
  
        await socket.emit("send_message", messageData);
        console.log("Sending message:", messageData); // Add this line to log the received message
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      } else {
        console.log("Message flagged by moderation:", currentMessage);
        // Handle the case where the message is flagged by moderation
        // For example, display a warning message to the user
        const messageData = {
          room: room,
          author: "System",
          message: "Please do not use negative language",
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
      }
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received message:", data); // Add this line to log the received message
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const removeTextAfterParenthesis = (text) => {
    if (typeof text !== "string") {
      return ""; // Return an empty string if text is not a string
    }

    const index = text.indexOf("("); // Find the index of the opening parenthesis
    if (index !== -1) {
      return text.substring(0, index).trim(); // Extract the text before the opening parenthesis and trim any leading or trailing whitespace
    } else {
      return text; // If no opening parenthesis is found, return the original text
    }
  };

  //Text to spech
  const speakMessage = (text) => {
    const newText = removeTextAfterParenthesis(text);
    const utterance = new SpeechSynthesisUtterance(newText);
    utterance.lang = "zh-CN";
    synth.speak(utterance);
  };

  const translateText = async (text) => {
    const generatedMessage = await processSingleMessageToChatGPT(text);
    if (generatedMessage) {
      // Do something with the generated message
      console.log("Generated message:", generatedMessage);
      return generatedMessage;
    }
  };

  const handleSendSuggestion = (index) => {
    if (suggestions[index]) {
      const message = suggestions[index].replace(/^\d+\.\s/, "");
      const messageData = {
        room: room,
        author: username,
        message: message,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setSuggestions(Array(3).fill("")); // Clear suggestions after sending
    }
  };

  return (
    <div>
    
      <Grid container></Grid>
      <h1>Lets talk about food(Chinese)</h1>
      <Grid container className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem Button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Justin DW"></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            <ListItem Button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Justin DW"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Justin DW">Remy Sharp</ListItemText>
              <ListItemText secondary="online" align="right"></ListItemText>
            </ListItem>
            {/*    <ListItem Button key="Alice">
              <ListItemIcon>
                <Avatar
                  alt="Alice"
                  src="https://material-ui.com/static/images/avatar/3.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Alice">Alice</ListItemText>
            </ListItem>
            <ListItem Button key="CindyBaker">
              <ListItemIcon>
                <Avatar
                  alt="Cindy Baker"
                  src="https://material-ui.com/static/images/avatar/2.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
            </ListItem> */}
          </List>
        </Grid>
        <Grid item xs={9}>
          <div className="chat-window">
            <div className="chat-body">
              <ScrollToBottom className="message-container">
                {messageList.map((messageContent, index) => {
                  return (
                    <div
                      key={index} // Use index as the key if messageContent doesn't have a unique ID
                      className="message"
                      id={username === messageContent.author ? "you" : "other"}
                    >
                      <div>
                        <div className="message-bubble">
                          <div className="message-content">
                            <p>{messageContent.message}</p>
                          </div>
                        </div>

                        <div className="message-meta">
                          <p id="time">{messageContent.time}</p>

                          <p id="author">{messageContent.author}</p>
                        </div>
                        <div className="Button-list">
                          <Button variant="contained"
                            className="Button-speak"
                            onClick={() => speakMessage(messageContent.message)}
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "5px",
                              minWidth: "unset",
                              height: "30px",
                              width: "35px",
                            }}
                          >
                            <RiSpeakLine style={{ marginRight: "5px" }} />{" "}
                          </Button>

                          <Button variant="contained"
                            className="Button-translate"
                            startIcon={<BsTranslate />} // Use the BsTranslate icon as the start icon
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "5px",
                              minWidth: "unset",
                            }}
                            onClick={() => {
                              if (!messageContent.translated) {
                                translateText(messageContent.message)
                                  .then((translatedMessage) => {
                                    setMessageList((prevMessageList) => {
                                      const updatedMessageList =
                                        prevMessageList.map((msg) => {
                                          if (msg === messageContent) {
                                            return {
                                              ...msg,
                                              originalMessage: msg.message,
                                              message: translatedMessage,
                                              translated: true, // Set translated state for this message
                                            };
                                          }
                                          return msg;
                                        });
                                      return updatedMessageList;
                                    });
                                  })
                                  .catch((error) => {
                                    console.error("Translation error:", error);
                                  });
                              } else {
                                setMessageList((prevMessageList) => {
                                  const updatedMessageList =
                                    prevMessageList.map((msg) => {
                                      if (msg === messageContent) {
                                        return {
                                          ...msg,
                                          message: msg.originalMessage,
                                          translated: false, // Reset translated state for this message
                                        };
                                      }
                                      return msg;
                                    });
                                  return updatedMessageList;
                                });
                              }
                            }}
                          ></Button>
                          <Button variant="contained"
                            startIcon={<FaClipboardQuestion />} // Use the BsTranslate icon as the start icon
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "5px",
                              minWidth: "unset",
                            }}
                            className="Button-suggest"
                            onClick={() =>
                              getSuggestion(messageContent.message)
                            }
                          ></Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ScrollToBottom>
            </div>

            {/* Footer */}
            <div className="chat-footer">
              <input
                type="text"
                value={currentMessage}
                placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
              <Button variant="contained"
                onClick={sendMessage}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                &#9658;
              </Button>
            </div>

           
          </div>
          <div className="suggestion-buttons-container">
  <Button variant="contained"
    className="Button-suggest-1"
    onClick={() => handleSendSuggestion(0)}
    style={{ display: suggestions[0] ? "block" : "none" }}
  >
    {suggestions[0]}
  </Button>

  <Button variant="contained"
    className="Button-suggest-2"
    onClick={() => handleSendSuggestion(1)}
    style={{ display: suggestions[1] ? "block" : "none" }}
  >
    {suggestions[1]}
  </Button>

  <Button variant="contained"
    className="Button-suggest-3"
    onClick={() => handleSendSuggestion(2)}
    style={{ display: suggestions[2] ? "block" : "none" }}
  >
    {suggestions[2]}
  </Button>
</div>

        </Grid>
   
      </Grid>
       {/*Suggestion Buttons */}
      
    </div>
  );
}

export default Chat;
