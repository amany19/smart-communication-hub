"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import InsightsDrawer from "@/components/InsightDrawer";
import InsightsPanel from "@/components/InsightPanel";
import { ChatMessage, Insight, User } from "@/types";
import socket from "@/utils/socket";
import { useAuth } from "@/context/useAuth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

//fetch conversation
async function fetchMessages(sender_id: string, receiver_id: string) {
  try {
    if (!sender_id || !receiver_id) return [];

    const res = await fetch(
      `${BASE_URL}/messages/conversation/${sender_id}/${receiver_id}`,
      { credentials: "include" }
    );

    if (!res.ok) throw new Error("Failed to load messages");
    return (await res.json()) as ChatMessage[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Fetch (chat list)
async function fetchContacts(user_id: string) {
  try {
    const res = await fetch(`${BASE_URL}/messages/chats/${user_id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load contacts");
    return (await res.json()) as any[];
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return [];
  }
}
//fetch insights 
async function fetchInsights(sender_id: string, receiver_id: string) {
  try {
    const res = await fetch(`${BASE_URL}/insights/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sender_id, receiver_id }),
    });

    if (!res.ok) throw new Error("Failed to analyze");

    const data = await res.json();
    return data 
  } catch (error) {
    console.error("Failed to fetch insights:", error);
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const user_id = user?.user_id;
   
  const [contacts, setContacts] = useState<any[]>([]);
  const [receiver, setReceiver] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [isOnline, setIsOnline] = useState(false);
  const [insights, setInsights] = useState<{ summary: string; sentiment: string } | null>(null);

  // Load contacts first, then messages for the first contact
  useEffect(() => {
    if (!user_id) return;

    (async () => {
      const data = await fetchContacts(user_id);
      setContacts(data);

      if (data.length > 0) {
        setReceiver(data[0]);
        const msgs = await fetchMessages(user_id, data[0].user.id);
        setMessages(msgs);
      }
    })();
  }, [user_id]);

  // load messages again when receiver changes an other conversation
  useEffect(() => {
    if (!receiver?.user?.id || !user_id) return;

    (async () => {
      const msgs = await fetchMessages(user_id, receiver.user.id);
    const insights=await fetchInsights(user_id, receiver.user.id);
setInsights(insights)
      setMessages(msgs);
    })();
  }, [receiver, user_id]);

  // socket setup effect 
  useEffect(() => {
    if (!user_id) return;

   
    
    // Connect socket and set user online
    socket.connect();
    socket.emit("userOnline", user_id);

    // Listen for incoming messages
    const handleReceiveMessage = (message: ChatMessage) => {
      const isMessageForCurrentConversation = 
        (message.sender_id === user_id && message.receiver_id === receiver?.user?.id) ||
        (message.sender_id === receiver?.user?.id && message.receiver_id === user_id);
      
      if (isMessageForCurrentConversation) {
        console.log('Adding message to current conversation');
        setMessages(prev => {
         //avoid duplicate messages
          if (prev.some(msg => msg.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      } else {
  
      }
    };

    // Listen for online status updates
    const handleOnlineStatus = (data: { user_id: string, isOnline: boolean }) => {
      setOnlineUsers(prev => ({ ...prev, [data.user_id]: data.isOnline }));
      
      // Update current receiver's online status
      if (data.user_id === receiver?.user?.id) {
        setIsOnline(data.isOnline);
      }
    };

    // Listen for message sent confirmation (***needs test***)
    const handleMessageSent = (message: ChatMessage) => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    };

    // Listen for message errors
    const handleMessageError = (errorData: { error: string, originalData: any }) => {
      if (errorData.originalData?.id) {
        setMessages(prev => prev.map(msg => 
          msg.id === errorData.originalData.id 
            ? { ...msg, status: 'failed' } 
            : msg
        ));
      }
    };

    // Listen for connection events
    socket.on('connect', () => {
      // console.log('✅ Socket connected successfully');
    });

    socket.on('disconnect', () => {
      // console.log('❌ Socket disconnected');
    });

    // ✅ Register ALL event listeners in ONE place
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('updateOnlineStatus', handleOnlineStatus);
    socket.on('messageSent', handleMessageSent);
    socket.on('messageError', handleMessageError);

    console.log('🎯 Socket event listeners registered');

    // ✅ Complete cleanup on component unmount
    return () => {
      console.log('🧹 Cleaning up ALL socket listeners');
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('updateOnlineStatus', handleOnlineStatus);
      socket.off('messageSent', handleMessageSent);
      socket.off('messageError', handleMessageError);
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [user_id, receiver?.user?.id]); // ✅ Dependencies include receiver ID

  //  Send message 
  function handleSendMessage(text: string) {
    if (!receiver?.user?.id || !user_id) return;
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender_id: user_id,
      receiver_id: receiver.user.id,
      timestamp: new Date().toISOString(),
      status: 'sending'//to be handles later
    };

    setMessages((prev) => [...prev, newMessage]);
    
    // Send consistent structure
    socket.emit("sendMessage", {
      sender_id: user_id,
      receiver_id: receiver.user.id,
      text: text,
      id: newMessage.id,
      timestamp: new Date().toISOString()
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr_300px] h-screen">
      <Sidebar
        contacts={contacts}
        selectedId={receiver?.user?.id ?? null}
        onSelect={(contact) => setReceiver(contact)}
        onlineUsers={onlineUsers}
      />

      <div className="border-x border-border p-0 overflow-y-auto">
        <ChatWindow
          receiver={receiver?.user}
          messages={messages}
          onSendMessage={handleSendMessage}
          isOnline={isOnline}
        />
      </div>

      <InsightsDrawer>
        <InsightsPanel data={insights as Insight} />
      </InsightsDrawer>
    </div>
  );
}