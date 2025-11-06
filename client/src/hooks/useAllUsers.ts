import { useAuth } from "@/context/useAuth";
import { fetchAllUsers } from "@/lib/api";
import { useEffect, useState } from "react";

export function useAllUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.user_id;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userId]);

  return { 
    users, 
    loading, 
    error 
  };
}