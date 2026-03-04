"use client";

import { Bell, Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-white/20 backdrop-blur-xl relative dark:border-slate-700/50 dark:bg-slate-800/60">
      <div className="flex h-16 items-center px-4 sm:px-6 relative z-10">
        <div className="flex flex-1 items-center justify-between">
          {/* Left side - Mobile menu and title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-white dark:text-slate-200" />
              <h1 className="text-lg font-semibold text-white dark:text-slate-200">Tax Configurations</h1>
            </div>
          </div>
          
          {/* Right side - notifications, theme toggle, and user */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                1
              </span>
            </Button>
            
            <ThemeToggle />
            
            <Avatar className="h-8 w-8 ring-2 ring-white/20 dark:ring-slate-600/50">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-white/20 text-white dark:bg-slate-700 dark:text-slate-200">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}