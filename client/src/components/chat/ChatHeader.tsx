"use client";
import { User } from "@/types";

interface ChatHeaderProps {
  receiver: User;
  isOnline: boolean; 
}

export default function ChatHeader({ receiver, isOnline }: ChatHeaderProps) {
  
  const initial = receiver.name?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 p-3 bg-surface border-b border-border select-none">
      <div className="relative">
        {receiver.profilePhoto ? (
          <img
            src={receiver.profilePhoto}
            alt={receiver.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {initial}
          </div>
        )}
        {/* Online status indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">
          {receiver.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
}