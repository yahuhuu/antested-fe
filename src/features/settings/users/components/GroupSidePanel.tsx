import { Group } from "@/features/settings/users/store/useGroupStore";
import { useProjectStore } from "@/features/projects/store/useProjectStore";
import { useUserStore } from "@/features/settings/users/store/useUserStore";
import { SidePanel } from "@/components/ui/SidePanel";
import { Users, FolderKanban, Activity } from "lucide-react";

interface GroupSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
}

const MOCK_ACTIVITIES = [
  { id: 1, action: "Group created", time: "1 month ago" },
  { id: 2, action: "Added 3 new users", time: "2 weeks ago" },
  { id: 3, action: 'Assigned to project "Alpha"', time: "1 week ago" },
  { id: 4, action: "Removed user from group", time: "3 days ago" },
];

export function GroupSidePanel({
  isOpen,
  onClose,
  group,
}: GroupSidePanelProps) {
  const { users } = useUserStore();
  const { projects } = useProjectStore();

  const groupUsers = group ? users.slice(0, group.users) : [];
  const groupProjects = group ? projects.slice(0, group.projects) : [];

  return (
    <SidePanel
      isOpen={isOpen && !!group}
      onClose={onClose}
      title="Group Details"
      defaultWidth={420}
    >
      {group && (
        <>
          {/* Group Profile Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-surface shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text leading-tight">
                {group.name}
              </h2>
              <p className="text-sm text-text-muted mt-1">User Group</p>
              <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-background text-xs font-medium text-text">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </div>
            </div>
          </div>

          {/* Group Details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">
              Information
            </h3>
            <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Group ID</span>
                <span className="font-medium text-text">#{group.id}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-text-muted">Description</span>
                <span className="font-medium text-text text-right max-w-[60%] whitespace-pre-wrap">
                  {group.description || "No description provided."}
                </span>
              </div>
            </div>
          </div>

          {/* Assignments Detailed */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">
              Assignments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users */}
              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-text">
                    <Users className="w-4 h-4 text-text-muted" />
                    Users
                  </div>
                  <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">
                    {group.users}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupUsers.length > 0 ? (
                    groupUsers.map((u) => (
                      <span
                        key={u.id}
                        className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-text-muted"
                      >
                        {u.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">
                      No users assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-text">
                    <FolderKanban className="w-4 h-4 text-text-muted" />
                    Projects
                  </div>
                  <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">
                    {group.projects}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupProjects.length > 0 ? (
                    groupProjects.map((p) => (
                      <span
                        key={p.id}
                        className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-text-muted"
                      >
                        {p.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">
                      No projects assigned
                    </span>
                  )}
                </div>
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
                    {index !== MOCK_ACTIVITIES.length - 1 && (
                      <div className="absolute left-[7px] top-5 bottom-[-16px] w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-primary/40" />
                    <p className="text-sm font-medium text-text">
                      {activity.action}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {activity.time}
                    </p>
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
