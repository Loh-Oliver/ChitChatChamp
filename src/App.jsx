import { useState, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import { useSpeechSynthesis } from 'react-speech-kit'; // Import text-to-speech library
const API_KEY = "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";

const systemMessage = { "role": "system", "content": "Explain things like you're a language teacher trying to teach someone a language." };

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const { speak } = useSpeechSynthesis(); // Get speak function from text-to-speech library
  const speakMessage = (text) => {
    speak({ text });
  };
  useEffect(() => {
    if (!initialMessageSent) {
      // Send the initial message only once upon component initialization
      sendMessageToChatGPT("Start a basic conversation with me in English to practice my Language");
      setInitialMessageSent(true);
    }
  }, [initialMessageSent]);

  const sendMessageToChatGPT = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
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
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Check the response data structure
      const generatedMessage = data.choices[0].message.content;

      setMessages([...chatMessages, {
        message: generatedMessage,
        sender: "ChatGPT"
      }]);
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
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                // Skip rendering initial message
                if (!initialMessageSent && i === 0) {
                  return null;
                }
                return (
                  <div key={i}>
                    <Message model={message} />
                    <button onClick={() => speakMessage(message.message)}>Speak</button> {/* Add button to speak message */}
                  </div>
                );
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
