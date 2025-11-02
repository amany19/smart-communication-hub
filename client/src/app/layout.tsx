import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
export const metadata: Metadata = {
  title: "Smart Communication Hub",
  description: "Real-time chat platform with AI insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full overflow-hidden bg-background text-foreground">
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
