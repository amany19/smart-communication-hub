import { useAuth } from "@/context/useAuth";
import { fetchInsights, fetchMessages } from "@/lib/api";
import { ChatMessage } from "@/types";
import { useEffect, useState } from "react";

export function usePrevMessages(receiverId: string) {
  const [prevMessages, setPrevMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
   const { user } = useAuth();
  const userId = user?.user_id;
  useEffect(() => {
    if (!userId || !receiverId) return;
    
    const loadInsights = async () => {
      try {
        const data = await fetchMessages(receiverId);
        setPrevMessages(data);
      } catch (err) {
        setError("Failed to load messages");
      }
    };
    
    const timer = setTimeout(loadInsights, 10);
    return () => clearTimeout(timer);
  }, [userId, receiverId]);

  return { prevMessages, errorLoadingMessages:error };
}