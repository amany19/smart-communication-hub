import { useAuth } from "@/context/useAuth";
import { ChatMessage } from "@/types";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useCallback } from "react";

export function useSendMessage(
  socket: Socket | null,
  receiverId?: string,
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const { user } = useAuth();
  const userId = user?.user_id;

  const sendMessage = useCallback(
    (text: string) => {
      if (!socket || !userId || !receiverId || !setMessages || !text.trim()) return;

      const newMessage: ChatMessage = {
        id: uuidv4(),
        text,
        sender_id: userId,
        receiver_id: receiverId,
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, newMessage]);
      socket.emit("sendMessage", newMessage);
    },
    [socket, userId, receiverId, setMessages]
  );

  return sendMessage;
}
