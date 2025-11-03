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
import { Menu } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

/* ---------- Fetch Functions (same as before) ---------- */
async function fetchMessages(sender_id: string, receiver_id: string) {
  try {
    if (!sender_id || !receiver_id) return [];
    const res = await fetch(`${BASE_URL}/messages/conversation/${sender_id}/${receiver_id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load messages");
    return (await res.json()) as ChatMessage[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

async function fetchAllUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load users");
    return (await res.json()) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function fetchChatUsers(user_id: string) {
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

async function fetchInsights(sender_id: string, receiver_id: string) {
  try {
    const res = await fetch(`${BASE_URL}/insights/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sender_id, receiver_id }),
    });
    if (!res.ok) throw new Error("Failed to analyze");
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return null;
  }
}

/* ---------- Component ---------- */
export default function Dashboard() {
  const { user } = useAuth();
  const user_id = user?.user_id;

  const [contacts, setContacts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [receiver, setReceiver] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [insights, setInsights] = useState<{ summary: string; sentiment: string } | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ---------- Load Contacts on Mount ---------- */
  useEffect(() => {
    if (!user_id) return;

    const loadContacts = async () => {
      const chatUsers = await fetchChatUsers(user_id);
      setContacts(chatUsers);

      if (chatUsers.length > 0) {
        const first = chatUsers[0];
        setReceiver(first);
        const msgs = await fetchMessages(user_id, first.user.id);
        setMessages(msgs);
        const insights = await fetchInsights(user_id, first.user.id);
        setInsights(insights);
      }
    };

    loadContacts();
  }, [user_id]);

  /* ---------- Toggle Contacts / All Users ---------- */
  const handleToggleUsersView = async () => {
    if (!showAllUsers && allUsers.length === 0) {
      setLoading(true);
      const users = await fetchAllUsers();
      setAllUsers(users);
      setLoading(false);
    }
    setShowAllUsers((prev) => !prev);
  };

  /* ---------- Select a Chat ---------- */
  const handleSelectChat = async (contact: any) => {
    const receiverData = contact.user ? contact : { user: contact };
    setReceiver(receiverData);
    setMessages([]);
    setInsights(null);

    const receiverId = receiverData.user.id;
    if (!receiverId || !user_id) return;

    try {
      const [msgs, ins] = await Promise.all([
        fetchMessages(user_id, receiverId),
        fetchInsights(user_id, receiverId)
      ]);
      setMessages(msgs);
      setInsights(ins);
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  /* ---------- Socket Setup (same as before) ---------- */
  useEffect(() => {
    if (!user_id) return;

    socket.connect();

    const handleReceiveMessage = (message: ChatMessage) => {
      const isForCurrent =
        (message.sender_id === user_id && message.receiver_id === receiver?.user?.id) ||
        (message.receiver_id === user_id && message.sender_id === receiver?.user?.id);

      if (isForCurrent) {
        setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      }
    };

    const handleOnlineStatus = (data: { user_id: string; isOnline: boolean }) => {
      setOnlineUsers((prev) => ({ ...prev, [data.user_id]: data.isOnline }));
      if (data.user_id === receiver?.user?.id) setIsOnline(data.isOnline);
    };

    const handleMessageSent = (data: { tempId: string; actualId: string }) => {
      setMessages(prev => prev.map(msg =>
        msg.id === data.tempId ? { ...msg, id: data.actualId, status: 'sent' } : msg
      ));
    };

    const handleMessageError = (data: { tempId: string; error: string }) => {
      setMessages(prev => prev.map(msg =>
        msg.id === data.tempId ? { ...msg, status: 'failed' } : msg
      ));
      console.error('Message failed:', data.error);
    };

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      socket.emit('userOnline', user_id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('updateOnlineStatus', handleOnlineStatus);
    socket.on('messageSent', handleMessageSent);
    socket.on('messageError', handleMessageError);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('updateOnlineStatus', handleOnlineStatus);
      socket.off('messageSent', handleMessageSent);
      socket.off('messageError', handleMessageError);
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [user_id, receiver?.user?.id]);

  /* ---------- Send Message ---------- */
  const handleSendMessage = (text: string) => {
    if (!receiver?.user?.id || !user_id) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender_id: user_id,
      receiver_id: receiver.user.id,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("sendMessage", {
      sender_id: user_id,
      receiver_id: receiver.user.id,
      text: text,
      id: newMessage.id,
      timestamp: new Date().toISOString()
    });
  };
  /* ---------- Mobile Sidebar Toggle ---------- */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Show toggle button only on mobile and when sidebar is not open
  const showToggleButton = !isSidebarOpen;


  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        chatUsers={contacts}
        allUsers={allUsers}
        showAllUsers={showAllUsers}
        loading={loading}
        onToggleView={handleToggleUsersView}
        selectedId={receiver?.user?.id ?? null}
        onSelect={handleSelectChat}
        onlineUsers={onlineUsers}
        isMobileOpen={isSidebarOpen}
        onMobileClose={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_300px]">

        {/* Chat Area */}
        <div className="flex-1 border-border md:border-r overflow-hidden">
          <ChatWindow
            receiver={receiver?.user}
            messages={messages}
            onToggleSidebar={toggleSidebar}
            showToggleButton={showToggleButton}
            onSendMessage={handleSendMessage}
            isOnline={isOnline}
          />
        </div>

        {/* Insights Panel - Hidden on mobile by default */}
        <div className="hidden md:block">
          <InsightsDrawer>
            <InsightsPanel data={insights as Insight} />
          </InsightsDrawer>
        </div>
      </div>
    </div>
  );
}