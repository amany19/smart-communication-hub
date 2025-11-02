"use client";
import { useState } from "react";
import { User } from "@/types";

interface SidebarProps {
  contacts:User[];
  onSelect: (user:User) => void;
  selectedId: string | null;
}

export default function Sidebar({ contacts, onSelect, selectedId }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col bg-surface border-r border-border p-4 w-[350px]">
      <input
        placeholder="Search..."
        className="mb-4 p-2 rounded-md border border-border bg-background"
      />

      <div className="space-y-2 overflow-y-auto">
        {contacts?.map((u) => {
          const initial = u.name.charAt(0).toUpperCase();
          const isSelected = selectedId === u.id;

          return (
            <div
              key={u.id}
              onClick={() => onSelect(u)}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors
                ${isSelected ? "bg-primary-light/40 text-primary-dark" : "hover:bg-primary-light/20"}
              `}
            >
              {u.profilePhoto ? (
                <img src={u.profilePhoto} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {initial}
                </div>
              )}

              <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                {u.name}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
