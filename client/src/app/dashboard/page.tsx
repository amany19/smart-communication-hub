"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import InsightsDrawer from "@/components/chat/InsightDrawer";
import InsightsPanel from "@/components/chat/InsightPanel";
import { useAuth } from "@/context/useAuth";
import { useReceiver } from "@/context/ReceiverContext";

export default function Dashboard() {
  const { user } = useAuth();
  const user_id = user?.user_id;
const { receiver } = useReceiver(); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ---------- Sidebar Controls ---------- */
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const showToggleButton = !isSidebarOpen;
  return (
    
    <div className="flex h-screen bg-background">
      <Sidebar
        isMobileOpen={isSidebarOpen}
        onMobileClose={closeSidebar}
      />
      <div className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_280px]">
        <div className="flex-1 static border-border md:border-r overflow-scroll">
          <ChatWindow             
            onToggleSidebar={toggleSidebar}
            showToggleButton={showToggleButton}
          />
        </div>
        <InsightsDrawer>
          <InsightsPanel/>
        </InsightsDrawer>

      </div>
    </div>
  );
}
