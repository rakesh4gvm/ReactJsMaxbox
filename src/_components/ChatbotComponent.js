import React, { useEffect } from "react";

const ChatbotComponent = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://saleshive.nyc3.cdn.digitaloceanspaces.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.Chatbot.init({
        chatflowid: "247c18df-a8c0-4065-82cc-4d7005cdfdc3",
        apiHost: "https://ai.saleshive.com",
        theme: {
          button: {
            backgroundColor: "#d69679",
          },
          chatWindow: {
            textInput: {
              sendButtonColor: "#d69679",
            },
            userMessage: {
              backgroundColor: "#f4e2da",
              textColor: "#000",
            },
          },
        },
      });
    };

    // Clean up after component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="chatbot-container"></div>;
};

export default ChatbotComponent;
