import { User } from '@/features/settings/users/store/useUserStore';
import { useGroupStore } from '@/features/settings/users/store/useGroupStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { Users, FolderKanban, Activity } from 'lucide-react';
import { SidePanel } from '@/components/ui/SidePanel';

interface UserSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const MOCK_ACTIVITIES = [
  { id: 1, action: 'Logged in', time: '2 mins ago' },
  { id: 2, action: 'Updated profile picture', time: '1 hour ago' },
  { id: 3, action: 'Created project "Alpha"', time: '3 hours ago' },
  { id: 4, action: 'Commented on task #123', time: '5 hours ago' },
  { id: 5, action: 'Joined group "Developers"', time: '1 day ago' },
  { id: 6, action: 'Completed task #120', time: '2 days ago' },
  { id: 7, action: 'Logged out', time: '2 days ago' },
  { id: 8, action: 'Logged in', time: '3 days ago' },
];

export function UserSidePanel({ isOpen, onClose, user }: UserSidePanelProps) {
  const { groups } = useGroupStore();
  const { projects } = useProjectStore();

  const userGroups = user ? groups.slice(0, user.groups) : [];
  const userProjects = user ? projects.slice(0, user.projects) : [];

  return (
    <SidePanel 
      isOpen={isOpen && !!user} 
      onClose={onClose} 
      title="User Details" 
      defaultWidth={420}
    >
      {user && (
        <>
          {/* User Profile Header */}
          <div className="flex items-start gap-4 mb-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-surface shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl font-bold text-text leading-tight">{user.name}</h2>
              <p className="text-sm text-text-muted mt-1">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-background text-xs font-medium text-text">
                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {user.status}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">Information</h3>
            <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">User ID</span>
                <span className="font-medium text-text">#{user.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Role</span>
                <span className="font-medium text-text">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Last Active</span>
                <span className="font-medium text-text">{user.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Groups & Projects Detailed */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">Assignments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Groups */}
              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-text">
                    <Users className="w-4 h-4 text-text-muted" />
                    Groups
                  </div>
                  <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">{user.groups}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userGroups.length > 0 ? userGroups.map(g => (
                    <span key={g.id} className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-text-muted">
                      {g.name}
                    </span>
                  )) : <span className="text-xs text-text-muted">No groups assigned</span>}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-text">
                    <FolderKanban className="w-4 h-4 text-text-muted" />
                    Projects
                  </div>
                  <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">{user.projects}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProjects.length > 0 ? userProjects.map(p => (
                    <span key={p.id} className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-text-muted">
                      {p.name}
                    </span>
                  )) : <span className="text-xs text-text-muted">No projects assigned</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-background text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Task Completion</p>
                <p className="text-xl font-semibold text-text">94.2%</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Issues Resolved</p>
                <p className="text-xl font-semibold text-text">128</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Avg Response</p>
                <p className="text-xl font-semibold text-text">1.4h</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Satisfaction</p>
                <p className="text-xl font-semibold text-text">4.9/5</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-text-muted" />
              Recent Activity
            </h3>
            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {MOCK_ACTIVITIES.map((activity, index) => (
                  <div key={activity.id} className="relative pl-4">
                    {/* Timeline line */}
                    {index !== MOCK_ACTIVITIES.length - 1 && (
                      <div className="absolute left-[5px] top-2 bottom-[-16px] w-px bg-border" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-surface border-2 border-primary" />
                    
                    <div className="text-sm text-text">{activity.action}</div>
                    <div className="text-xs text-text-muted mt-0.5">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </SidePanel>
  );
}
