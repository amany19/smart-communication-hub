"use client";
import { useState } from "react";
import { UserRoundPen, Users, MessageCircle, X } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useContacts } from "@/hooks/useContacts";
import { useReceiver } from "@/context/ReceiverContext";
import { useAllUsers } from "@/hooks/useAllUsers";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  isMobileOpen = false,
  onMobileClose
}: SidebarProps) {
  const [showAllUsers, setShowAllUsers] = useState(false);
  const { receiver, setReceiver } = useReceiver();
  const { socket } = useSocket();
  const onlineStatus = useOnlineStatus(socket);
  const {contacts} = useContacts();
  const { users, loading, error } = useAllUsers();

  /* ---------- Select a Chat ---------- */
  const handleSelectChat = (contact: any) => {
    const receiverData = contact.user ? contact.user : contact;
    setReceiver(receiverData);
    
    // Close sidebar on mobile after selection
    if (onMobileClose) {
      onMobileClose();
    }
  };

  /* ---------- Toggle Between All Users and Chat Users ---------- */
  const handleToggleUsersView = () => {
    setShowAllUsers(prev => !prev);
  };

  const displayList = showAllUsers ? users : contacts;
  const currentView = showAllUsers ? "All Users" : "Chats";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed bg-black bg-opacity-50 z-60"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 right-0 z-60
        bg-surface border-l border-border p-4 w-[350px] max-w-[85vw]
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentView}
          </h2>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <input
          placeholder={showAllUsers ? "Search all users..." : "Search chats..."}
          className="mb-4 p-2 rounded-md border border-border bg-background text-sm md:text-base"
        />

        {/* Users list */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            displayList?.map((item) => {
              const user = showAllUsers ? item : item.user;
              const lastMessage = showAllUsers ? null : item.lastMessage;
              const initial = user.name?.charAt(0).toUpperCase();
              const isSelected = receiver?.id === user.id;
              const isOnline = user?.id ? onlineStatus[user?.id]?.isOnline : false;

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectChat(item)}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                    ${isSelected ? "bg-primary-light/40 text-primary-dark" : "hover:bg-primary-light/20"}
                    active:scale-95 md:active:scale-100
                  `}
                >
                  <div className="relative flex-shrink-0">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {initial}
                      </div>
                    )}
                    {/* Online status indicator */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm truncate">
                        {user.name}
                      </span>
                      {!showAllUsers && lastMessage?.timestamp && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 truncate">
                        {showAllUsers
                          ? (user.status || "Available")
                          : (lastMessage?.text || "No messages yet")
                        }
                      </span>
                      {/* Online status text */}
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Show envelope icon for all users view */}
                  {showAllUsers && (
                    <div className="text-gray-400 hover:text-primary transition-colors flex-shrink-0">
                      <UserRoundPen className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {!loading && displayList?.length === 0 && (
            <div className="text-center text-gray-500 p-4">
              {showAllUsers ? "No users found" : "No conversations yet"}
            </div>
          )}
        </div>

        {/* Bottom section */}
        <div className="mt-4 pt-4">
          <div className="flex justify-end items-center">
            {/* Toggle button */}
            <button
              onClick={handleToggleUsersView}
              className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 flex items-center justify-center transition-all shadow-lg active:scale-95"
              title={showAllUsers ? "View Chats" : "View All Users"}
            >
              {showAllUsers ? (
                <MessageCircle className="w-5 h-5" />
              ) : (
                <Users className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}