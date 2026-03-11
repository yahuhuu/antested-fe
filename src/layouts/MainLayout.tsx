import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/utils/cn';

export function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-text transition-colors p-4 gap-4">
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-4 left-4 z-50 transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 rounded-2xl bg-surface shadow-sm flex flex-col overflow-hidden shrink-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-[120%]",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <Sidebar 
          onClose={() => setIsMobileOpen(false)} 
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden min-w-0 z-10">
        {/* Header */}
        <div className="h-16 shrink-0 rounded-2xl bg-surface shadow-sm flex items-center px-4 sm:px-6">
          <Header toggleSidebar={() => setIsMobileOpen(true)} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 relative min-h-0 flex flex-col">
          <main className="flex-1 overflow-y-auto custom-scrollbar pr-2" id="main-content">
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
