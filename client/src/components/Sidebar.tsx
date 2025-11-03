"use client";
import { useState } from "react";
import { User } from "@/types";
import { UserRoundPen, Users, MessageCircle } from "lucide-react";

interface SidebarProps {
  chatUsers: any[];
  allUsers: any[];
  showAllUsers: boolean;
  loading: boolean;
  onSelect: (user: User) => void;
  selectedId: string | null;
  onlineUsers: Record<string, boolean>;
  onToggleView: () => void;
}

export default function Sidebar({ 
  chatUsers,
  allUsers,
  showAllUsers,
  loading,
  onSelect,
  selectedId, 
  onlineUsers,
  onToggleView 
}: SidebarProps) {

  const handleUserSelect = (user: User) => {
    onSelect(user);
  };

  const handleToggleUsersView = () => {
    onToggleView();
  };

  const displayList = showAllUsers ? allUsers : chatUsers;

  return (
    <aside className="hidden md:flex flex-col bg-surface border-r border-border p-4 w-[350px]">
      {/* Search input */}
      <input
        placeholder={showAllUsers ? "Search all users..." : "Search chats..."}
        className="mb-4 p-2 rounded-md border border-border bg-background"
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
            const isSelected = selectedId === user.id;
            const isOnline = onlineUsers[user.id];

            return (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                  ${isSelected ? "bg-primary-light/40 text-primary-dark" : "hover:bg-primary-light/20"}
                `}
              >
                <div className="relative">
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
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
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

                {/* Show envelope*/}
                {showAllUsers && (
                  <div className="text-gray-400 hover:text-primary transition-colors">
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

      {/* Bottom section*/}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          {/* View mode indicator */}
          <div className="text-xs text-gray-500">
            {showAllUsers ? "All Users" : "Chats"}
          </div>
          
          {/* Toggle button */}
          <button
            onClick={handleToggleUsersView}
            className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 flex items-center justify-center transition-all shadow-lg"
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
  );
}