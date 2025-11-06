import { useAuth } from "@/context/useAuth";
import { fetchChatUsers } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

export function useContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const userId = user?.user_id;

  const loadContacts = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const chatUsers = await fetchChatUsers(userId);
      setContacts(chatUsers || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError("Failed to load conversations. Please try again.");
      setContacts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return { 
    contacts, 
    loading, 
    error,
    refetch: loadContacts // Provide retry capability
  };
}