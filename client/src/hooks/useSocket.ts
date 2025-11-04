"use client";
import socket from "@/utils/socket";
import { useEffect } from "react";


export interface ChatMessage {
  id: string;
  text: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  status?: "pending" | "sent" | "failed";
}

interface OnlineStatusPayload {
  user_id: string;
  isOnline: boolean;
}

interface MessageAck {
  tempId: string;
  actualId: string;
}

interface MessageError {
  tempId: string;
  error: string;
}

interface UseSocketProps {
  userId?: string;
  receiverId?: string;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setOnlineUsers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setIsOnline: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useSocket({
  userId,
  receiverId,
  setMessages,
  setOnlineUsers,
  setIsOnline,
}: UseSocketProps) {
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) socket.connect();

    const handleReceiveMessage = (message: ChatMessage) => {
      if (!receiverId) return;

      const isForCurrent =
        (message.sender_id === userId && message.receiver_id === receiverId) ||
        (message.receiver_id === userId && message.sender_id === receiverId);

      if (isForCurrent) {
        setMessages((prev) =>
          prev.some((m) => m.id === message.id) ? prev : [...prev, message]
        );
      }
    };

    const handleOnlineStatus = (data: OnlineStatusPayload) => {
      setOnlineUsers((prev) => ({ ...prev, [data.user_id]: data.isOnline }));
      if (data.user_id === receiverId) setIsOnline(data.isOnline);
    };

    const handleMessageSent = (data: MessageAck) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.tempId ? { ...msg, id: data.actualId, status: "sent" } : msg
        )
      );
    };

    const handleMessageError = (data: MessageError) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.tempId ? { ...msg, status: "failed" } : msg
        )
      );
      console.error("Message failed:", data.error);
    };

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      socket.emit("userOnline", userId);
    });

    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("updateOnlineStatus", handleOnlineStatus);
    socket.on("messageSent", handleMessageSent);
    socket.on("messageError", handleMessageError);

    return () => {
      socket.emit("userOffline", userId);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("updateOnlineStatus", handleOnlineStatus);
      socket.off("messageSent", handleMessageSent);
      socket.off("messageError", handleMessageError);
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [userId, receiverId]);
}
