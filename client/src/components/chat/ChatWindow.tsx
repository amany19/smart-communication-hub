"use client";
import { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";
import { Send, UserRoundPen } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { useChat } from "@/hooks/useChat";
import { useReceiver } from "@/context/ReceiverContext";

interface ChatWindowProps {
  onToggleSidebar: () => void;
  showToggleButton?: boolean;
}

export default function ChatWindow({
  onToggleSidebar,
  showToggleButton,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const {receiver} = useReceiver()
  const { messages, sendMessage,loading } = useChat(receiver?.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!receiver) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        Select a user to start chatting
        <button className="mt-4 " onClick={onToggleSidebar }>
            <UserRoundPen size={50} className="text-primary"/>
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

 const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if(e.shiftKey) return
      else{
      e.preventDefault();
      handleSend();}
    }
  }; 

  return (
    <>
    <div className="flex flex-col h-full">
      <ChatHeader
        onToggleSidebar={onToggleSidebar}
        showToggleButton={showToggleButton}
        receiver={receiver}

      />

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <ChatBubble
            key={m.id}
            message={m.text}
            isSender={m.sender_id === user?.user_id}
            timestamp={m.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-3 bg-background border-t border-border">
        <div className="flex items-center gap-2 w-full">
          <textarea
            placeholder="Type message…"
            className="flex-1 min-w-0 bg-surface border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-primary text-white p-2 sm:p-3 md:p-3.5 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    
    </>
  );
}