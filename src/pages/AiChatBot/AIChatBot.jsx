import { useState, useEffect } from "react";
import "./AIChatBot.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useSpeechSynthesis } from "react-speech-kit"; // Import text-to-speech library
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "../Global/Navbar";
import Footer from "../Global/Footer";
const API_KEY = "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";

const systemMessage = {
  role: "system",
  content:
    "Start with English and ask student what they want to practice at the beginning. You are a language teacher trying to help a student practice language. Point out grammatical, vocabulary and spelling errors. When conversing in a language other than English, automatically include the English translation.",
};

function AIChatBot() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const { speak, cancel } = useSpeechSynthesis(); // Destructure the speak and cancel functions
  const [speaking, setSpeaking] = useState(false); // Initialize speaking state
  const speakMessage = (text) => {
    if (speaking) {
      cancel(); // Stop speaking if already speaking
      setSpeaking(false); // Reset speaking state
    } else {
      speak({ text }); // Speak the message
      setSpeaking(true); // Update speaking state
    }
  };
  useEffect(() => {
    if (!initialMessageSent) {
      // Send the initial message only once upon component initialization
      sendMessageToChatGPT("Hi Chimp!");
      setInitialMessageSent(true);
    }
  }, [initialMessageSent]);

  const sendMessageToChatGPT = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "AIChatBotlication/json",
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

      setMessages([
        ...chatMessages,
        {
          message: generatedMessage,
          sender: "ChatGPT",
        },
      ]);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  }

  const handleSend = (message) => {
    sendMessageToChatGPT(message);
  };

  return (
    <div className="AIChatBot">
      <Navbar />
      <div className="chat-header">
        <div className="chat-title">AI Chatbot</div>
      </div>
      <div className="chat-window"style={{ position: "relative", height: "800px", width: "700px" }}>
    
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="Chimp is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  // Skip rendering initial message
                  if (!initialMessageSent && i === 0) {
                    return null;
                  }
                  return (
                    <div key={i}>
                      <Message model={message} />
                      <button onClick={() => speakMessage(message.message)}>
                        {speaking ? "Stop Speaking" : "Speak"}
                      </button>
                    </div>
                  );
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
     
      <Footer />
    </div>
  );
}

export default AIChatBot;
