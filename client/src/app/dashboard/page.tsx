"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import InsightsDrawer from "@/components/InsightDrawer";
import { ChatMessage } from "@/types";
import { User } from "@/types";
import InsightsPanel from "@/components/InsightPanel";

export default function Dashboard() {
  const contacts: User[] = [
    { id: "2", name: "Sarah", },
    { id: "3", name: "John" }, 
  ];

  const [receiver, setReceiver] = useState<User | null>(contacts[0]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", text: "Hello!", senderId: "me", timestamp: "11:03" },
    { id: "2", text: "Hi welcome", senderId: "2", timestamp: "11:04" },
  ]);
//temporary implementation till integrating with the backend
  function handleSendMessage(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(), 
        text,
        senderId: "me",
       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr_300px] h-screen">
      <Sidebar
        contacts={contacts}
        selectedId={receiver?.id ?? null}
        onSelect={(user) => setReceiver(user)}
      />

      <div className="border-x border-border p-0 overflow-y-auto">
        <ChatWindow
          receiver={receiver}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>

      <InsightsDrawer>
        <InsightsPanel/>
      </InsightsDrawer>
    </div>
  );
}
