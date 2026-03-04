"use client";

import { useEffect } from "react";
import { MainNav } from "./main-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-white/20 bg-white/30 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
        "dark:border-slate-700/50 dark:bg-gradient-to-b dark:from-slate-800/50 dark:to-slate-900/80",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header with close button for mobile */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between lg:justify-start">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
                  Tax Factory
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1">
                  Payroll Tax Compliance
                </p>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-300"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 sm:px-6 flex-1">
            <div className="relative z-10">
              <MainNav onLinkClick={onClose} />
              
              <div className="mt-8 hidden lg:block">
                <Card className="gradient-card border-gray-200 dark:border-slate-700/50 backdrop-blur-sm">
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 text-gray-800 dark:text-slate-200">Quick Stats</h3>
                    <div className="space-y-2 text-xs text-gray-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>Active Configs</span>
                        <span className="font-medium text-blue-600 dark:text-cyan-400">2,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Jurisdictions</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">3,142</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Review</span>
                        <span className="font-medium text-orange-600 dark:text-orange-400">12</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}