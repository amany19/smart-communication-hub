import { fetchWithAuth } from "../fetchWithAuth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";

export async function fetchInsights(sender_id: string, receiver_id: string) {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/insights/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: "include",
      body: JSON.stringify({ sender_id, receiver_id }),
    });
    if (!res.ok) throw new Error("Failed to analyze");
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return null;
  }
}
