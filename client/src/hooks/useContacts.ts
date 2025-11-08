import { useAuth } from "@/context/useAuth";
import { fetchChatUsers } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

export function useContacts() {
  const { user } = useAuth();


  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = user?.user_id;


  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const chatUsers = await fetchChatUsers();
        if (isMounted) setContacts(chatUsers || []);
      } catch (err) {
        console.error("❌ Failed to fetch contacts:", err);
        if (isMounted) {
          setError("Failed to load conversations. Please try again.");
          setContacts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; 
    };
  }, [userId]);

  return { contacts, contacts_loading: loading, contacts_error: error };
}
