import { ChatMessage } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`;

export async function fetchMessages(sender_id: string, receiver_id: string) {
  try {
    if (!sender_id || !receiver_id) return [];
    const res = await fetch(`${BASE_URL}/conversation/${sender_id}/${receiver_id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load messages");
    return (await res.json()) as ChatMessage[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
export async function fetchChatUsers(user_id: string) {
  try {
    const res = await fetch(`${BASE_URL}/chats/${user_id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load contacts");
    return (await res.json()) as any[];
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return [];
  }
}