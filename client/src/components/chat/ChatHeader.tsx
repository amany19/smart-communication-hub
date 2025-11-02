"use client";
import { User } from "@/types";

interface ChatHeaderProps {
  receiver: User;
}

export default function ChatHeader({ receiver }: ChatHeaderProps) {
  
  const initial = receiver.name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 p-3 bg-surface border-b border-border select-none">
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

      <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">{receiver.name}</span>
    </div>
  );
}
