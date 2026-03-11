import { SidePanel } from '@/components/ui/SidePanel';
import { Project } from '@/features/projects/store/useProjectStore';
import { useCustomizationStore } from '@/features/settings/customizations/store/useCustomizationStore';
import { useGroupStore } from '@/features/settings/users/store/useGroupStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';
import { useEffect } from 'react';
import { Users, FolderKanban } from 'lucide-react';

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export function ProjectViewModal({ isOpen, onClose, project }: ProjectViewModalProps) {
  const { testCaseTemplates, fetchCustomizations } = useCustomizationStore();
  const { groups, fetchGroups } = useGroupStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      fetchCustomizations();
      fetchGroups();
      fetchUsers();
    }
  }, [isOpen, fetchCustomizations, fetchGroups, fetchUsers]);

  if (!project) return null;

  const templateName = project.test_case_templates?.name || 'Default Template';
  const selectedGroups = project.access_management?.groups?.data || [];
  const selectedUsers = project.access_management?.users?.data || [];

  return (
    <SidePanel 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Project Details"
      defaultWidth={500}
    >
      <div className="space-y-8 pb-8">
        {/* Project Profile Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-surface shadow-sm">
            {project.key || project.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text leading-tight">{project.name}</h2>
            <p className="text-sm text-text-muted mt-1">{project.key || project.id.toUpperCase()}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-background text-xs font-medium text-text">
              <div className={`w-1.5 h-1.5 rounded-full ${project.enable_test_case_approval ? 'bg-green-500' : 'bg-gray-400'}`} />
              {project.enable_test_case_approval ? 'Approval Enabled' : 'Approval Disabled'}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text mb-4">Information</h3>
          <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Test Case Template</span>
              <span className="font-medium text-text">{templateName}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-text-muted">Description</span>
              <span className="font-medium text-text text-right max-w-[60%] whitespace-pre-wrap">
                {project.description || 'No description provided.'}
              </span>
            </div>
          </div>
        </div>

        {/* Assignments Detailed */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text mb-4">Access Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Groups */}
            <div className="bg-background rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-text">
                  <FolderKanban className="w-4 h-4 text-text-muted" />
                  Groups
                </div>
                <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">{selectedGroups.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedGroups.length > 0 ? selectedGroups.map(g => (
                  <span key={g.id} className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-text-muted">
                    {g.name}
                  </span>
                )) : <span className="text-xs text-text-muted">No groups assigned</span>}
              </div>
            </div>

            {/* Users */}
            <div className="bg-background rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-text">
                  <Users className="w-4 h-4 text-text-muted" />
                  Users
                </div>
                <span className="text-xs font-semibold bg-surface px-2 py-0.5 rounded-full border border-border">{selectedUsers.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.length > 0 ? selectedUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-2 bg-surface border border-border rounded-md px-2 py-1">
                    <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} className="w-4 h-4 rounded-full" />
                    <span className="text-xs text-text-muted">{u.name}</span>
                  </div>
                )) : <span className="text-xs text-text-muted">No specific users assigned</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text mb-4">Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Test Cases</p>
              <p className="text-xl font-semibold text-text">{project.test_cases?.total_test_cases || 0}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Active Runs</p>
              <p className="text-xl font-semibold text-text">{project.test_runs?.status?.open || 0}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Test Plans</p>
              <p className="text-xl font-semibold text-text">{project.test_plans?.total_test_plans || 0}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-medium">Defects</p>
              <p className="text-xl font-semibold text-text">{project.defects?.total_defects || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
