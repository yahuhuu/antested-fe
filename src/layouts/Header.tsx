import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Moon, Sun, Menu, Activity, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/store/useThemeStore';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-full w-full items-center justify-between z-20">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-text-muted hover:bg-surface-hover rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        <button 
          onClick={toggleTheme} 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-text-muted hover:text-primary transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-text-muted hover:text-primary transition-colors relative">
          <MessageSquare className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-background"></span>
        </button>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-text-muted hover:text-primary transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-background"></span>
            <span className="sr-only">Notifications</span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-surface shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-text">Notifications</h3>
                <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-border hover:bg-surface-hover cursor-pointer transition-colors">
                  <p className="text-sm text-text"><span className="font-semibold">Alice</span> assigned you to <span className="font-semibold">TC-123</span></p>
                  <p className="text-xs text-text-muted mt-1">10 minutes ago</p>
                </div>
                <div className="p-4 border-b border-border hover:bg-surface-hover cursor-pointer transition-colors">
                  <p className="text-sm text-text">Test run <span className="font-semibold">Regression v1.2</span> completed</p>
                  <p className="text-xs text-text-muted mt-1">1 hour ago</p>
                </div>
                <div className="p-4 hover:bg-surface-hover cursor-pointer transition-colors">
                  <p className="text-sm text-text"><span className="font-semibold">Bob</span> commented on <span className="font-semibold">Bug-45</span></p>
                  <p className="text-xs text-text-muted mt-1">Yesterday</p>
                </div>
              </div>
              <div className="p-2 border-t border-border text-center">
                <Link to="/notifications" className="text-xs text-primary hover:underline" onClick={() => setIsNotifOpen(false)}>
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative ml-2" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-primary/10 border border-primary/20">
              <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold text-text leading-none">Michelle Arnold</span>
              <span className="text-[11px] text-text-muted mt-1">Sales manager</span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-surface shadow-lg z-50 overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-text">Michelle Arnold</p>
                <p className="text-xs text-text-muted truncate">michelle@antested.com</p>
              </div>
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <User className="h-4 w-4 text-text-muted" />
                My Profile
              </Link>
              <div className="border-t border-border my-1"></div>
              <button 
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                onClick={() => {
                  setIsProfileOpen(false);
                  // Handle logout
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
