import { User } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`; 

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  refreshToken: string;
  accessToken: string;
}



export async function registerUser(
  data: RegisterData
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  return response.json();
}
export async function fetchAllUsers() {
  try {
    const res = await fetch(`${BASE_URL}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load users");
    return (await res.json()) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}