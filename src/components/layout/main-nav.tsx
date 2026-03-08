"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  FileText,
  Calendar,
  Search,
  MessageCircle,
} from "lucide-react";

const navigation = [
  {
    name: "Chat",
    href: "/",
    icon: MessageCircle,
  },
  {
    name: "Jurisdictions",
    href: "/jurisdictions",
    icon: Building2,
  },
  {
    name: "Tax Configurations",
    href: "/tax-configs",
    icon: FileText,
  },
  {
    name: "Compliance Events",
    href: "/compliance-events",
    icon: Calendar,
  },
  {
    name: "Researcher",
    href: "/researcher",
    icon: Search,
  },
];

interface MainNavProps {
  onLinkClick?: () => void;
}

export function MainNav({ onLinkClick }: MainNavProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== "/" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 group relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-cyan-600 text-white shadow-lg shadow-blue-600/25 dark:shadow-purple-600/25"
                : "text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-gradient-to-r dark:hover:from-purple-600/20 dark:hover:to-cyan-600/20 dark:hover:backdrop-blur-sm"
            )}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-cyan-600 opacity-0 transition-opacity duration-300",
              !isActive && "group-hover:opacity-10"
            )} />
            <item.icon className={cn(
              "mr-3 h-5 w-5 transition-colors relative z-10",
              isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-purple-400"
            )} />
            <span className="relative z-10">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}