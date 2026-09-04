import React from "react";

export function getInitials(name, email) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

// Round avatar with initials; pass a tone color for department-flavored avatars.
export default function InitialAvatar({ name, email, color, size = "md", className = "" }) {
  const sizes = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizes[size] || sizes.md} ${className}`}
      style={{ backgroundColor: color || "#4285F4" }}
      title={name || email || "User"}
    >
      {getInitials(name, email)}
    </span>
  );
}
