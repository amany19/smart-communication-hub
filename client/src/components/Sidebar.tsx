"use client";
import { useState } from "react";
import { User } from "@/types";

interface SidebarProps {
  contacts: any[];
  onSelect: (user: User) => void;
  selectedId: string | null;
  onlineUsers: Record<string, boolean>;
}

export default function Sidebar({ contacts, onSelect, selectedId, onlineUsers }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col bg-surface border-r border-border p-4 w-[350px]">
      <input
        placeholder="Search..."
        className="mb-4 p-2 rounded-md border border-border bg-background"
      />

      <div className="space-y-2 overflow-y-auto">
        {contacts?.map((contact) => {
          const initial = contact.user.name?.charAt(0).toUpperCase();
          const isSelected = selectedId === contact.user.id;
          const isOnline = onlineUsers[contact.user.id]; // ✅ Get online status

          return (
            <div
              key={contact.user.id}
              onClick={() => onSelect(contact)}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                ${isSelected ? "bg-primary-light/40 text-primary-dark" : "hover:bg-primary-light/20"}
              `}
            >
              <div className="relative">
                {contact.user.profilePhoto ? (
                  <img 
                    src={contact.user.profilePhoto} 
                    alt={contact.user.name}
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {initial}
                  </div>
                )}
                {/* ✅ Online status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
       
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm truncate">
                    {contact.user.name}
                  </span>
                  {contact.lastMessage?.timestamp && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(contact.lastMessage.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 truncate">
                    {contact.lastMessage?.text || "No messages yet"}
                  </span>
                  {/* ✅ Online status text */}
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}