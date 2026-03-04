"use client";

import { Compass } from "lucide-react";

interface GimbalAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function GimbalAvatar({ size = "md", className = "" }: GimbalAvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const iconSizes = {
    sm: 15,
    md: 19,
    lg: 26,
    xl: 34,
  };

  const shadowClass = size === "sm" || size === "md" ? "gimbal-avatar-sm" : "gimbal-avatar";

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${shadowClass}
        rounded-full
        flex items-center justify-center
        relative
        ${className}
      `}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

      <Compass
        size={iconSizes[size]}
        className="text-white drop-shadow-sm relative z-10"
        strokeWidth={2.2}
      />
    </div>
  );
}

export default GimbalAvatar;
