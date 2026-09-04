"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LayoutDashboard, LogOut } from "lucide-react";
import InitialAvatar from "./InitialAvatar";

export default function UserButton({ user }) {
  const router = useRouter();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-2.5 shadow-sm transition hover:shadow-md"
        >
          <InitialAvatar name={user.name} email={user.email} size="sm" />
          <span className="max-w-[120px] truncate text-sm font-semibold">
            {user.name || user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block truncate text-sm font-bold">{user.name || "Account"}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          My Applications
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/auth/signout")}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
