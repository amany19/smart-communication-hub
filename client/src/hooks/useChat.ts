// hooks/useChat.ts
import { useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/useAuth";
import { ChatMessage } from "@/types";
import { useReceiveMessage } from "./useReceiveMessage";
import { v4 as uuidv4 } from "uuid";

export function useChat(receiverId?: string) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const userId = user?.user_id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ✅ Handle receiving messages (only for current chat)
  useReceiveMessage(socket, receiverId, setMessages);

  // ✅ Sending message logic included here directly
  const sendMessage = (text: string) => {
    if (!socket || !userId || !receiverId) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender_id: userId,
      receiver_id: receiverId,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, newMessage]);

    // Emit message
    socket.emit("sendMessage", newMessage);
  };

  return { messages, setMessages, sendMessage };
}
