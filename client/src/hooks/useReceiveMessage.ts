// hooks/useReceiveMessage.ts
import { useEffect } from "react";
import { ChatMessage } from "@/types";
import { Socket } from "socket.io-client";
import { useAuth } from "@/context/useAuth";

export function useReceiveMessage(
  socket: Socket | null,
  receiverId?: string,
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const { user } = useAuth();
  const userId = user?.user_id;

  useEffect(() => {
    if (!socket || !userId || !receiverId || !setMessages) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      console.log("📨 Received message:", message);

      const isCurrentChat =
        (message.sender_id === receiverId && message.receiver_id === userId) ||
        (message.sender_id === userId && message.receiver_id === receiverId);

      if (!isCurrentChat) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  }
  }, [socket, userId, receiverId, setMessages]);
}
