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
import Navbar from "../Global/Navbar";
import Footer from "../Global/Footer";
import { useParams } from "react-router-dom";





function AIChatBot() {
  const { language } = useParams(); // Get the language parameter
  const systemMessage = {
    role: "system",
    content:
      `Start with ${language} and ask student what they want to practice at the beginning. You are a language teacher trying to help a student practice language. Point out grammatical, vocabulary and spelling errors. Chat in the language that the student is learning and provide English translation.`,
  };
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestion, setSuggestion] = useState(true);
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
    console.log("Sending initial message...");
    if (!initialMessageSent) {
      // Send the initial message only once upon component initialization
      sendMessageToChatGPT("Hi Chimp!"); // Pass false to avoid displaying the initial message
      setInitialMessageSent(true);
    }
  }, []); // Empty dependency array to ensure the effect runs only once

  useEffect(() => {
    // Function to generate reply suggestions
    const generateReplySuggestions = async () => {
      setSuggestion(false);
      await sendMessageToChatGPT("System: Give the user 3 reply suggestions");
    };
  
    // Timer logic
    let timeoutId;
  if (!isTyping && messages.length > 0 && suggestion) {
    // Start the timer
    timeoutId = setTimeout(() => {
      generateReplySuggestions();
    }, 10000); // 10 seconds timeout
  } else if (isTyping && messages.length > 0) {
    // Restart the timer if the user starts typing again
    clearTimeout(timeoutId); // Clear the existing timer
    timeoutId = setTimeout(() => {
      generateReplySuggestions();
    }, 10000); // Restart the timer
  }

  // Cleanup the timer if user starts typing
  return () => {
    clearTimeout(timeoutId);
  };
  }, [isTyping, messages]);
  
  const sendMessageToChatGPT = async (message) => {
    const newMessage = {
        message,
        direction: "outgoing",
        sender: "user",
    };
    const newMessages = [...messages, newMessage]; // Append the new message
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

        // Append only the first choice for the first prompt
        const generatedMessage = data.choices[0].message.content;
        const newMessages = [
            ...chatMessages,
            {
                message: generatedMessage,
                sender: "ChatGPT",
            },
        ];
        setMessages(newMessages);

        // Generate reply suggestions for subsequent prompts
        if (chatMessages.length > 0) {
            generateReplySuggestions();
        }
    } catch (error) {
        console.error("Error processing message:", error);
    } finally {
        setIsTyping(false);
    }
  }
  
  

  const handleSend = (message) => {
    sendMessageToChatGPT(message);
    setSuggestion(true)
  };
  
  return (
    <div className="App">
      <Navbar />
      <div className="chat-header">
        <div className="chat-title">AI Chatbot ({language})</div>
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
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      <Footer />
    </div>
  );
}
export default AIChatBot;
