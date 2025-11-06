"use client";
import { useReceiver } from "@/context/ReceiverContext";
import { useSocket } from "@/context/SocketContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { User } from "@/types";
import { Menu } from "lucide-react";

interface ChatHeaderProps {
  receiver: User;

  onToggleSidebar: () => void;
  showToggleButton?: boolean;
}

export default function ChatHeader({ onToggleSidebar, showToggleButton }: ChatHeaderProps) {
  const { receiver } = useReceiver()
  const initial = receiver.name?.charAt(0).toUpperCase();
  const { socket } = useSocket();
  const onlineStatus = useOnlineStatus(socket);
  const isOnline = receiver?.id
    ? onlineStatus[receiver?.id]?.isOnline
    : false;

  return (<>
    <div className="flex items-center justify-between gap-3 p-3 bg-surface border-b border-border select-none">
      <div className="flex flex-row">
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
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />    </div>
        <div className="flex flex-col ml-2">
          <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">
            {receiver.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {isOnline ? 'Online' : 'Offline'}
          </span>

        </div>
      </div>

      <div className="flex self-end">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button> </div>
    </div>

  </>
  );
}
