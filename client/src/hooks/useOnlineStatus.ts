import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface OnlineStatus {
  [userId: string]: { isOnline: boolean; lastSeen?: string };
}

export function useOnlineStatus(socket: Socket | null) {
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({});

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (users: Record<string, boolean>) => {
      const mapped = Object.fromEntries(
        Object.entries(users).map(([userId, isOnline]) => [
          userId,
          { isOnline },
        ])
      );
      setOnlineStatus(mapped);
    };
    const handleStatusUpdate = (data: {
      user_id: string;
      isOnline: boolean;
      lastSeen?: string;
    }) => {
      setOnlineStatus((prev) => ({
        ...prev,
        [data.user_id]: { isOnline: data.isOnline, lastSeen: data.lastSeen },
      }));
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("updateOnlineStatus", handleStatusUpdate);
    socket.emit("getOnlineUsers");

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("updateOnlineStatus", handleStatusUpdate);
    };
  }, [socket]);

  return onlineStatus;
}
