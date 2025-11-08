import { useAuth } from "@/context/useAuth";
import { fetchMessages } from "@/lib/api";
import { ChatMessage } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import {v4 as UUIDV4} from 'uuid'
export function useChat(receiverId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const userId = user?.user_id;

  useEffect(() => {
    if (!userId || !receiverId) {
      setMessages([]);
      return;
    }

    const loadMessageHistory = async () => {
      setLoading(true);
      try {
        const data = await fetchMessages(receiverId);
        setMessages(data || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessageHistory();
  }, [userId, receiverId]);
  useEffect(() => {
    if (!socket || !receiverId) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      if (
        (message.sender_id === receiverId && message.receiver_id === userId) ||
        (message.sender_id === userId && message.receiver_id === receiverId)
      ) {
        setMessages(prev => 
          prev.some(m => m.id === message.id) ? prev : [...prev, message]
        );
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, userId, receiverId]);

  const sendMessage = useCallback((text: string) => {
    if (!socket || !userId || !receiverId) return;

    const newMessage: ChatMessage = {
      id: UUIDV4(), 
      text,
      sender_id: userId,
      receiver_id: receiverId,
      timestamp: new Date().toISOString(),
      status: "sending",
    };
    setMessages(prev => [...prev, newMessage]);
    socket.emit("sendMessage", newMessage);
  }, [socket, userId, receiverId]);

  return {
    messages,
    sendMessage,
    loading,
  };
}