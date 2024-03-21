import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const synth = window.speechSynthesis;
  const [suggestions, setSuggestions] = useState(Array(3).fill(""));
  //GPT translate
  const API_KEY = "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";

  async function processSingleMessageToChatGPT(text) {
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "translate to chinese." + text }],
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
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const removeTextAfterParenthesis = (text) => {
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

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
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
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>

                    <p id="author">{messageContent.author}</p>
                  </div>
                  <div className="button-list">
                    <button
                      className="button-speak"
                      onClick={() => speakMessage(messageContent.message)}
                    >
                      Speak
                    </button>

                    <button
                      className="button-translate"
                      onClick={() => {
                        if (!messageContent.translated) {
                          translateText(messageContent.message)
                            .then((translatedMessage) => {
                              setMessageList((prevMessageList) => {
                                const updatedMessageList = prevMessageList.map(
                                  (msg) => {
                                    if (msg === messageContent) {
                                      return {
                                        ...msg,
                                        originalMessage: msg.message,
                                        message: translatedMessage,
                                        translated: true, // Set translated state for this message
                                      };
                                    }
                                    return msg;
                                  }
                                );
                                return updatedMessageList;
                              });
                            })
                            .catch((error) => {
                              console.error("Translation error:", error);
                            });
                        } else {
                          setMessageList((prevMessageList) => {
                            const updatedMessageList = prevMessageList.map(
                              (msg) => {
                                if (msg === messageContent) {
                                  return {
                                    ...msg,
                                    message: msg.originalMessage,
                                    translated: false, // Reset translated state for this message
                                  };
                                }
                                return msg;
                              }
                            );
                            return updatedMessageList;
                          });
                        }
                      }}
                    >
                      {messageContent.translated
                        ? "Translate Back"
                        : "Translate"}
                    </button>
                    <button
                      className="button-suggest"
                      onClick={() => getSuggestion(messageContent.message)}
                    >
                      Suggest
                    </button>
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
        <button onClick={sendMessage}>&#9658;</button>
      </div>

      {/*Suggestion Buttons */}
      <button
        className="button-suggest-1"
        onClick={() => {
          if (suggestions[0]) {
            const message = suggestions[0].replace(/^\d+\.\s/, "");
            const messageData = {
              room: room,
              author: username,
              message: message,
              time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            };
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
          }
        }}
      >
        {suggestions[0]}
      </button>
      <button
        className="button-suggest-2"
        onClick={() => {
          if (suggestions[0]) {
            const message = suggestions[1].replace(/^\d+\.\s/, "");
            const messageData = {
              room: room,
              author: username,
              message: message,
              time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            };
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
          }
        }}
      >
        {suggestions[1]}
      </button>
      <button
        className="button-suggest-3"
        onClick={() => {
          if (suggestions[0]) {
            const message = suggestions[2].replace(/^\d+\.\s/, "");
            const messageData = {
              room: room,
              author: username,
              message: message,
              time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            };
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
          }
        }}
      >
        {suggestions[2]}
      </button>
    </div>
  );
}

export default Chat;
