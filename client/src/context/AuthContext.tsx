"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "@/lib/api/auth";

interface DecodedToken {
  user_id?: string;
  id?: string;
  sub?: string;
  exp: number;
}

interface User {
  user_id: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load tokens from localStorage on first mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      try {
        const decoded: DecodedToken = jwtDecode(accessToken);
        const id =
          decoded.user_id || decoded.id || decoded.sub || "";

        if (id) {
          setUser({
            user_id: id,
            accessToken,
            refreshToken,
          });
        } else {
          console.warn("⚠️ Token did not contain a user_id field");
        }
      } catch (err) {
        console.error("Invalid access token:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    setLoading(false);
  }, []);

  /** ✅ LOGIN */
  const login = async (username: string, password: string) => {
    const res = await loginUser({ username, password });
    const decoded: DecodedToken = jwtDecode(res.accessToken);

    const id =
      decoded.user_id || decoded.id || decoded.sub || "";

    if (!id) {
      console.error("❌ Could not find user_id in token");
      throw new Error("Invalid token format");
    }

    const newUser: User = {
      user_id: id,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
    };

    setUser(newUser);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
  };

  /** ✅ temporary LOGOUT will be replaced later after using cookies*/
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  /**  REFRESH ACCESS TOKEN needs check*/
  const refreshAccessToken = async () => {
    if (!user?.refreshToken) return logout();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: user.refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const { accessToken } = await res.json();
      const decoded: DecodedToken = jwtDecode(accessToken);
      const id = decoded.user_id || decoded.id || decoded.sub || user.user_id;

      setUser({
        ...user,
        user_id: id,
        accessToken,
      });

      localStorage.setItem("accessToken", accessToken);
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  };

  // Safe loading
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
