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
        chatflowConfig: {
          pineconeNamespace: "c4dd2e95-76fc-4127-9fd5-fa124196c0fb"
        }
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