import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FolderKanban, PlayCircle, BarChart3, Settings, Bug, 
  Users, Sliders, Blocks, Database, Globe, ArrowLeft, FileText, ChevronDown, Check, X, Activity, ChevronLeft
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProjectStore } from '@/features/projects/store/useProjectStore';

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

export function Sidebar({ onClose, isCollapsed, toggleCollapse }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  const isSettings = pathParts[0] === 'settings';
  const isProject = pathParts[0] === 'projects' && pathParts[1];
  const projectId = isProject ? pathParts[1] : null;
  const currentProject = isProject ? projects.find(p => p.id === projectId) : null;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let navigation = [];
  let title = 'Antested';
  let backLink = null;

  if (isSettings) {
    title = 'Settings';
    backLink = { name: 'Back to Dashboard', href: '/' };
    navigation = [
      { name: 'Projects', href: '/settings/projects', icon: FolderKanban },
      { name: 'Users & Roles', href: '/settings/users', icon: Users },
      { name: 'Customizations', href: '/settings/customizations', icon: Sliders },
      { name: 'Integrations', href: '/settings/integrations', icon: Blocks },
      { name: 'Data Management', href: '/settings/data', icon: Database },
      { name: 'Site Settings', href: '/settings/site', icon: Globe },
    ];
  } else if (isProject) {
    title = currentProject ? currentProject.name : `Project ${projectId}`;
    backLink = { name: 'Dashboard', href: '/' };
    navigation = [
      { name: 'Project Overview', href: `/projects/${projectId}`, icon: LayoutDashboard, exact: true },
      { name: 'Test Cases', href: `/projects/${projectId}/test-cases`, icon: FileText },
      { name: 'Test Runs & Plans', href: `/projects/${projectId}/test-runs`, icon: PlayCircle },
      { name: 'Milestones', href: `/projects/${projectId}/milestones`, icon: FolderKanban },
      { name: 'Defects', href: `/projects/${projectId}/defects`, icon: Bug },
      { name: 'Report', href: `/projects/${projectId}/reports`, icon: BarChart3 },
    ];
  } else {
    navigation = [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
      { name: 'Projects', href: '/projects', icon: FolderKanban },
    ];
  }

  return (
    <div className="flex h-full w-full flex-col bg-surface z-20">
      <div className={cn("p-4 flex items-center", isCollapsed ? "flex-col gap-4" : "justify-between")}>
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">
            <Activity className="h-5 w-5" />
          </div>
          <span className={cn("text-xl font-bold tracking-tight text-text whitespace-nowrap transition-all duration-300", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>Antested</span>
        </Link>
        
        {toggleCollapse && (
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 text-text-muted hover:bg-surface-hover rounded-md"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
          </button>
        )}

        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-text-muted hover:bg-surface-hover rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {isProject && (
          <div className="mb-6 relative" ref={dropdownRef}>
            <button 
              onClick={() => !isCollapsed && setIsDropdownOpen(!isDropdownOpen)}
              title={isCollapsed ? title : undefined}
              className={cn(
                "flex w-full items-center gap-2 font-semibold text-text hover:bg-surface-hover rounded-xl transition-colors border border-border",
                isCollapsed ? "justify-center p-2" : "justify-between p-3"
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bug size={16} />
                </div>
                {!isCollapsed && <span className="truncate text-sm">{title}</span>}
              </div>
              {!isCollapsed && <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />}
            </button>

            {isDropdownOpen && !isCollapsed && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-surface shadow-lg z-50 py-2 max-h-60 overflow-y-auto">
                <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Switch Project
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate(`/projects/${p.id}`);
                    }}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-text hover:bg-surface-hover transition-colors text-left"
                  >
                    <span className="truncate pr-4">{p.name}</span>
                    {p.id === projectId && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </button>
                ))}
                <div className="border-t border-border mt-2 pt-2">
                  <Link 
                    to="/projects" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-primary hover:bg-surface-hover transition-colors font-medium"
                  >
                    View all projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {backLink && (
          <div className="mb-6">
            <Link
              to={backLink.href}
              title={isCollapsed ? backLink.name : undefined}
              className={cn(
                "flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors",
                isCollapsed ? "justify-center" : "px-2"
              )}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{backLink.name}</span>}
            </Link>
          </div>
        )}

        {!isCollapsed && (
          <div className="mb-2 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider transition-opacity duration-300">
            Menu
          </div>
        )}
        <nav className="grid gap-1">
          {navigation.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href 
              : location.pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.name}
                to={item.href}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-200',
                  isCollapsed ? 'justify-center px-0' : 'px-4',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0 transition-colors', isActive ? 'text-primary' : 'text-text-muted')} />
                {!isCollapsed && <span className="truncate transition-opacity duration-300">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {(!isSettings && !isProject) && (
        <div className="mt-auto p-4 space-y-1">
          <Link
            to="/settings"
            title={isCollapsed ? "Settings" : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-200',
              isCollapsed ? 'justify-center px-0' : 'px-4',
              'text-text-muted hover:bg-surface-hover hover:text-text'
            )}
          >
            <Settings className="h-5 w-5 shrink-0 transition-colors text-text-muted" />
            {!isCollapsed && <span className="transition-opacity duration-300">Settings</span>}
          </Link>
        </div>
      )}
    </div>
  );
}
