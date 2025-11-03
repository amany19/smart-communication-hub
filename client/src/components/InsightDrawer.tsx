"use client";
import { useState } from "react";

export default function InsightsDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-2 right-4 bg-primary text-white p-3 rounded-full shadow-lg"
      >
        Insights
      </button>

      <div
        className={`fixed bottom-0 left-0 right-0 bg-surface dark:bg-darkSurface border-t border-border p-0 transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        } md:static md:translate-y-0 md:w-80 md:border-l`}
      >
        <button onClick={() => setOpen(false)} className="md:hidden text-text-muted">
          Close
        </button>
        {children}
      </div>
    </>
  );
}
