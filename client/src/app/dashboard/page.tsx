"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import InsightsDrawer from "@/components/InsightDrawer";
import InsightsPanel from "@/components/InsightPanel";
import { ChatMessage, Insight, User } from "@/types";
import { useAuth } from "@/context/useAuth";
import {
  fetchAllUsers,
  fetchChatUsers,
  fetchInsights,
  fetchMessages,
} from "@/lib/api";
import { useChat } from "@/hooks/useChat";

export default function Dashboard() {
  const { user } = useAuth();
  const user_id = user?.user_id;

  const [contacts, setContacts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [receiver, setReceiver] = useState<any | null>(null);
  const [insights, setInsights] = useState<{ summary: string; sentiment: string } | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  const { messages, setMessages, sendMessage } = useChat(receiver?.user?.id);

 
  const handleSendMessage = (text: string) => sendMessage(text);

  useEffect(() => {
    console.log("🔄 Dashboard state update:", {
      receiverId: receiver?.user?.id,
      userId: user_id,
      messagesCount: messages.length,
    });
  }, [receiver, user_id, messages.length]);

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
      }
    };

    loadContacts();
  }, [user_id, setMessages]);

  /* ---------- Fetch Insights Separately ---------- */
  useEffect(() => {
    if (!user_id || !receiver?.user?.id) return;

    const loadInsights = async () => {
      setInsightsError(null);
      setInsights(null);

      try {
        const data = await fetchInsights(user_id, receiver.user.id);
        if (!data) {
          setInsightsError("No insights available");
          return;
        }
        setInsights(data);
      } catch (err) {
        console.error("❌ Insight fetch failed:", err);
        setInsightsError("Failed to analyze insights");
      }
    };

    const timer = setTimeout(loadInsights, 300);
    return () => clearTimeout(timer);
  }, [user_id, receiver]);

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
      const [msgs, insightsData] = await Promise.all([
        fetchMessages(user_id, receiverId),
        fetchInsights(user_id, receiverId),
      ]);
      setMessages(msgs);
      setInsights(insightsData || null);
    } catch (error) {
      console.error("Error loading chat or insights:", error);
      setInsightsError("Failed fetching insights");
    }
  };

  /* ---------- Sidebar Controls ---------- */
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const showToggleButton = !isSidebarOpen;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        chatUsers={contacts}
        allUsers={allUsers}
        showAllUsers={showAllUsers}
        loading={loading}
        onToggleView={handleToggleUsersView}
        selectedId={receiver?.user?.id ?? null}
        onSelect={handleSelectChat}
        isMobileOpen={isSidebarOpen}
        onMobileClose={closeSidebar}
      />

      <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_300px]">
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

        <div className="hidden md:block">
          <InsightsDrawer>
            <InsightsPanel data={insights as Insight} />
          </InsightsDrawer>
        </div>
      </div>
    </div>
  );
}
