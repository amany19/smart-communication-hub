"use client";

import { useEffect, useState } from "react";
import socket from "@/utils/socket";

export default function Chat() {
  // Replace these IDs with real users from DB
  const sender_id = "9eb6464d-2f7c-4825-93e8-d4d4eb87ac47";
  const receiver_id = "31d53e92-3ad9-4865-99af-d54608691751";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // When connected to server
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);

     
      socket.emit("join", sender_id);
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      console.log("📩 Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [sender_id]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      sender_id,
      receiver_id,
      text: message,
    };

    console.log("📤 Sending message:", data);
    socket.emit("send_message", data);

    // Add to local messages instantly
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">🗨️ Chat Test</h1>

      <div className="border rounded p-2 h-64 overflow-y-auto bg-white">
        {messages.map((msg, idx) => (
          <p
            key={idx}
            className={`p-1 ${
              msg.sender_id === sender_id ? "text-blue-600 text-right" : "text-gray-800 text-left"
            }`}
          >
            <strong>{msg.sender_id === sender_id ? "You" : "Them"}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
