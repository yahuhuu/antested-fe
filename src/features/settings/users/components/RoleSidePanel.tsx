import { Role } from "@/features/settings/users/store/useRoleStore";
import { SidePanel } from "@/components/ui/SidePanel";
import { Users, Activity, Shield } from "lucide-react";

interface RoleSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

const MOCK_ACTIVITIES = [
  { id: 1, action: "Role created", time: "2 months ago" },
  { id: 2, action: "Permissions updated", time: "1 month ago" },
  { id: 3, action: "Assigned to 5 new users", time: "2 weeks ago" },
  { id: 4, action: "Description updated", time: "1 week ago" },
];

export function RoleSidePanel({ isOpen, onClose, role }: RoleSidePanelProps) {
  return (
    <SidePanel
      isOpen={isOpen && !!role}
      onClose={onClose}
      title="Role Details"
      defaultWidth={420}
    >
      {role && (
        <>
          {/* Role Profile Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-surface shadow-sm">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text leading-tight">
                {role.name}
              </h2>
              <p className="text-sm text-text-muted mt-1">System Role</p>
              <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-background text-xs font-medium text-text">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </div>
            </div>
          </div>

          {/* Role Details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">
              Information
            </h3>
            <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Role ID</span>
                <span className="font-medium text-text">#{role.id}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-text-muted">Description</span>
                <span className="font-medium text-text text-right max-w-[60%] whitespace-pre-wrap">
                  {role.description || "No description provided."}
                </span>
              </div>
            </div>
          </div>

          {/* Assignments Detailed */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">
              Assignments
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Users */}
              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-text">
                    <Users className="w-4 h-4 text-text-muted" />
                    Assigned Users
                  </div>
                  <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">
                    {role.userIds.length}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  This role is currently assigned to {role.userIds.length} users across
                  the system.
                </p>
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
