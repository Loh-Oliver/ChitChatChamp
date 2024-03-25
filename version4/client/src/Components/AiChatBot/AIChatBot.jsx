import React, { useState, useEffect } from "react";
import "./AIChatBot.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { useSpeechSynthesis } from "react-speech-kit"; // Import text-to-speech library
import NavBar from "../NavBar"
import { useParams } from "react-router-dom";

const API_KEY = "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";

function AIChatBot() {
  const { language } = useParams(); // Get the language parameter
  const systemMessage = {
    role: "system",
    content: `Start with ${language} and ask the student what they want to practice at the beginning. You are a language teacher. Point out grammatical, vocabulary, and spelling errors. Chat in the language that the student is learning and provide an English translation.`
  };
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const { speak, cancel } = useSpeechSynthesis(); // Destructure the speak and cancel functions
  const [speaking, setSpeaking] = useState(false); // Initialize speaking state
  const [showSuggestions, setShowSuggestions] = useState(false);

  const speakMessage = text => {
    if (speaking) {
      cancel(); // Stop speaking if already speaking
      setSpeaking(false); // Reset speaking state
    } else {
      speak({ text, lang: "zh-CN" }); // Speak the message
      setSpeaking(true); // Update speaking state
    }
  };

  useEffect(() => {
    console.log("Sending initial message...");
    if (!initialMessageSent) {
      // Send the initial message only once upon component initialization
      sendMessageToChatGPT("Hi Chimp!"); // Pass false to avoid displaying the initial message
      setInitialMessageSent(true);
    }
  }, []); // Empty dependency array to ensure the effect runs only once

  const sendMessageToChatGPT = async (message, include = true) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user"
    };
    let newMessages = [];
    if (!include) {
      newMessages = [...messages];
    } else {
       newMessages = [...messages, newMessage]; // Append the new message
    }
    setMessages(newMessages);
    setIsTyping(true);
    if (include) {
      await processMessageToChatGPT(newMessages);
    } else {
      await processMessageToChatGPT(newMessages, false);
    }
  };

  async function processMessageToChatGPT(chatMessages, include = true) {
    let apiMessages = chatMessages.map(messageObject => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });
    let apiRequestBody;
    if (!include) {
      apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages, {
          role: "system",
          content: "Give me 3 reply suggestions without acknowledging the user"
        }]
      };
    } else {
      apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages]
      };
    }
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(apiRequestBody)
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data); // Check the response data structure

      // Append only the first choice for the first prompt
      const generatedMessage = data.choices[0].message.content;
      const newMessages = [
        ...chatMessages,
        {
          message: generatedMessage,
          sender: "ChatGPT"
        }
      ];
      setMessages(newMessages);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  }

  const handleSend = message => {
    sendMessageToChatGPT(message);
  };

  const generateReplySuggestions = async () => {
    setShowSuggestions(false); // Reset suggestion state before generating suggestions
    try {
      await sendMessageToChatGPT("Give me 3 reply suggestions", false); // Wait for the prompt message to be sent
      setShowSuggestions(true); // Set suggestion state after generating suggestions
    } catch (error) {
      console.error("Error generating reply suggestions:", error);
      // Handle error appropriately, e.g., show error message to user
    }
  };

  const handleSuggestionButtonClick = () => {
    generateReplySuggestions(messages);
    setShowSuggestions(true);
  };

  return (
    <div className="App">
<NavBar></NavBar>
      <div className="chat-header">
        <div className="chat-title">Currently practicing ({language})</div>
      </div>
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? <TypingIndicator content="Chimp is typing" /> : null
              }
            >
              {messages.map((message, i) => (
                <div key={i}>
                  <Message model={message} />
                  <div>
                    <button onClick={() => speak({ text: message.message })}>
                      {speaking ? "Stop Speaking" : "Speak"}
                    </button>
                    <button onClick={handleSuggestionButtonClick}>
                      Get Suggestions
                    </button>
                  </div>
                </div>
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
            {showSuggestions && (
              <div>
                <p>Suggestions:</p>
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default AIChatBot;
