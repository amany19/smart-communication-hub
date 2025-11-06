import { useAuth } from "@/context/useAuth";
import { fetchInsights } from "@/lib/api";
import { Insight } from "@/types";
import { useEffect, useState, useCallback } from "react";

export function useInsights(receiverId?: string) {
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const userId = user?.user_id;

  const loadInsights = useCallback(async () => {
    if (!userId || !receiverId) {
      setInsights(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchInsights(userId, receiverId);
      setInsights(data || null);
    } catch (err) {
      console.error("Failed to fetch insights:", err);
      setError("Failed to load insights");
      setInsights(null);
    } finally {
      setLoading(false);
    }
  }, [userId, receiverId]);

  useEffect(() => {
  
    if (!receiverId) {
      setInsights(null);
      setError(null);
      return;
    }
    const timer = setTimeout(loadInsights, 300);
    return () => clearTimeout(timer);
  }, [loadInsights, receiverId]);

  return { 
    insights, 
    loading, 
    error,
    refetch: loadInsights
  };
}