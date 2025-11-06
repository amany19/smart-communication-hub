import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { ReceiverProvider } from "@/context/ReceiverContext";
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
        <ReceiverProvider>
          <AuthProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </AuthProvider>
        </ReceiverProvider>
      </body>
    </html>
  );
}
