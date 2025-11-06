"use client";
import { useReceiver } from "@/context/ReceiverContext";
import { useState } from "react";

export default function InsightsDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
const {receiver} =useReceiver()
  return (
    <>
      {/* Mobile Trigger Button */}
{   receiver&& (  <button
        onClick={() => setOpen(!open)}
        className="fixed top-2 right-40 bg-primary text-white p-3 rounded-full shadow-lg z-10 "
      >
        AI Insights
      </button>)}


         <div
        className={`hidden md:block fixed top-0 right-0  h-full w-72 bg-surface border-l border-border z-50 
        }`}
      >
                {/* Close Button
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        ><CircleX/></button>
      
      */}
        {children}
</div> 
      {/* Mobile: Drawer */}
      <div className={`
        fixed inset-0 z-40 transform transition-transform duration-300 md:block
        ${open ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-surface border-t border-border rounded-t-2xl p-4 overflow-y-auto">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500"
          >
            Close
          </button>
          {children}
        </div>
        
        {/* Backdrop */}
        {open && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 -z-10"
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </>
  );
}