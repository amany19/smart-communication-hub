import { ChatMessage } from "@/types";
import { fetchWithAuth } from "../fetchWithAuth";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`;

export async function fetchMessages(
  receiver_id: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    if (!receiver_id) return [];

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const res = await fetchWithAuth(
      `${BASE_URL}/conversation/${receiver_id}?${params.toString()}`
    );

    if (!res.ok) throw new Error("Failed to load messages");

    return (await res.json()) as ChatMessage[];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function fetchChatUsers() {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/chats`, {
      // credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load contacts");
    return (await res.json()) as any[];
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return [];
  }
}