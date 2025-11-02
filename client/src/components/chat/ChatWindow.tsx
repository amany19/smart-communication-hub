"use client";
import { useState } from "react";
import { ChatMessage, User } from "@/types";
import ChatBubble from "./ChatBubble";
import ChatHeader from "./ChatHeader";
import { Send } from "lucide-react";

interface ChatWindowProps {
    receiver: User | null;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
}

export default function ChatWindow({ receiver, messages, onSendMessage }: ChatWindowProps) {
    const [input, setInput] = useState("");

    if (!receiver) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a user to start chatting
            </div>
        );
    }

    function handleSend() {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex flex-col h-full m-0 p-0">
 
            <div className="flex-shrink-0">
                <ChatHeader receiver={receiver} />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m) => (
                    <ChatBubble
                        key={m.id}
                        message={m.text}
                        isSender={m.senderId === "me"}
                        timestamp={m.timestamp}
                    />
                ))}
            </div>

            <div className="flex-shrink-0 p-3 bg-background border-t border-border">
                <div className="flex items-center gap-2 w-full">
                    <input
                        placeholder="Type message…"
                        className="flex-1 min-w-0 bg-surface border border-border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
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
    );
}