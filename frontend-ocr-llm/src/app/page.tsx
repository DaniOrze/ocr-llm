"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "system", text: "Welcome! How can I assist you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const systemResponse = {
        id: messages.length + 2,
        sender: "system",
        text: "Thanks for your message! I'm working on your request.",
      };
      setMessages((prev) => [...prev, systemResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          padding: 0;
          margin: 0;
          background-color: #f4f4f5;
          overflow: hidden;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          margin-bottom: 20px;
        }

        .message {
          padding: 10px 15px;
          margin: 5px 0;
          border-radius: 10px;
          max-width: 70%;
        }

        .message.system {
          background-color: #e1f5fe;
          align-self: flex-start;
        }

        .message.user {
          background-color: #c8e6c9;
          align-self: flex-end;
        }

        .input-container {
          display: flex;
          gap: 10px;
          padding: 20px;
          background-color: #ffffff;
          border-top: 1px solid #ccc;
        }

        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
