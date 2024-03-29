Running Client and Server
This repository contains a client-server application. Below are the instructions on how to run both the client and server.

Prerequisites
Before running the application, make sure you have the following installed:

Node.js (which comes with npm)
Installation
To install the necessary dependencies, run the following command in the root directory:

Copy code
npm install
Additionally, you need to install the openai and react-icons packages. Run the following commands:

Copy code
npm install openai
npm install react-icons
Setting Up API Keys
Before running the AIChatbot and live chat features, you need to provide your own API keys.

OpenAI API Key
To obtain an API key for OpenAI, visit OpenAI's website and sign up for an account. Once you have your API key, create a file named .env in the root directory of the project, and add the following line:

Replace YOUR_OPENAI_API_KEY with your actual API key.

Live Chat API Key
Live chat feature requires an external service, follow the respective service's documentation to obtain the API key. Once you have it, add it to the .env file as follows:

Replace YOUR_LIVE_CHAT_API_KEY with your actual API key.

Running Client and Server
To start both the client and server, use the following command:

npm start
This command will concurrently start both the client and server processes.

Once the processes are up and running, you can access the client application via your web browser. By default, the client should be available at http://localhost:3000.

Additional Information
The client and server are configured to work together seamlessly.
Ensure no other processes are occupying the ports 3000 (client) and 5000 (server) as they are the default ports used by this application.
That's it! You should now have the client and server up and running with your own API keys. If you encounter any issues during setup or execution, feel free to raise an issue in this repository. Happy coding! 🚀
