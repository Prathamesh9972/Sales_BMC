// src/components/Chatbot.jsx
import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.innerHTML = `window.chtlConfig = { chatbotId: "3224383178" }`;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://chatling.ai/js/embed.js";
    script2.async = true;
    script2.setAttribute("data-id", "3224383178");
    script2.setAttribute("id", "chatling-embed-script");
    script2.setAttribute("type", "text/javascript");
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return null;
};

export default Chatbot;
