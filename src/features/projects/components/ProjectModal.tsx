import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { useProjectStore, Project } from '@/features/projects/store/useProjectStore';
import { useCustomizationStore } from '@/features/settings/customizations/store/useCustomizationStore';
import { useGroupStore } from '@/features/settings/users/store/useGroupStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';
import { Info } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { addProject, updateProject } = useProjectStore();
  const { testCaseTemplates, fetchCustomizations } = useCustomizationStore();
  const { groups, fetchGroups } = useGroupStore();
  const { users, fetchUsers } = useUserStore();

  const [formData, setFormData] = useState({ 
    name: '', 
    key: '',
    description: '',
    testCaseTemplateId: '',
    enableTestCaseApproval: false,
    selectedGroups: [] as string[],
    selectedUsers: [] as string[]
  });

  useEffect(() => {
    if (isOpen) {
      fetchCustomizations();
      fetchGroups();
      fetchUsers();
    }
  }, [isOpen, fetchCustomizations, fetchGroups, fetchUsers]);

  useEffect(() => {
    if (project && isOpen) {
      setFormData({ 
        name: project.name, 
        key: project.key || '',
        description: project.description,
        testCaseTemplateId: project.test_case_templates?.id || '',
        enableTestCaseApproval: project.enable_test_case_approval || false,
        selectedGroups: project.access_management?.groups?.data?.map(g => g.id) || [],
        selectedUsers: project.access_management?.users?.data?.map(u => u.id) || []
      });
    } else if (isOpen) {
      setFormData({ 
        name: '', 
        key: '',
        description: '',
        testCaseTemplateId: testCaseTemplates[0]?.id || '',
        enableTestCaseApproval: false,
        selectedGroups: [],
        selectedUsers: []
      });
    }
  }, [project, isOpen, testCaseTemplates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const baseProjectData = {
      name: formData.name,
      key: formData.key,
      description: formData.description,
      enable_test_case_approval: formData.enableTestCaseApproval,
      test_case_templates: testCaseTemplates.filter(t => t.id === formData.testCaseTemplateId).map(t => ({ id: t.id, name: t.name, description: t.description }))[0] || { id: '', name: '', description: '' },
      access_management: {
        users: {
          total_users: formData.selectedUsers.length,
          data: users.filter(u => formData.selectedUsers.includes(u.id)).map(u => ({ id: u.id, name: u.name, email: u.email }))
        },
        groups: {
          total_groups: formData.selectedGroups.length,
          data: groups.filter(g => formData.selectedGroups.includes(g.id)).map(g => ({ id: g.id, name: g.name, description: g.description }))
        }
      }
    };

    if (project) {
      updateProject(project.id, baseProjectData);
    } else {
      const newProjectData = {
        ...baseProjectData,
        test_cases: {
          total_test_cases: 0,
          status: {
            draft: 0,
            under_review: 0,
            rejected: 0,
            ready: 0
          }
        },
        test_runs: {
          total_test_runs: 0,
          status: {
            open: 0,
            overdue: 0,
            completed: 0
          }
        },
        test_plans: {
          total_test_plans: 0,
          status: {
            open: 0,
            overdue: 0,
            completed: 0
          }
        },
        milestones: {
          total_milestones: 0,
          status: {
            open: 0,
            overdue: 0,
            completed: 0
          }
        },
        defects: {
          total_defects: 0,
          status: {
            failed: 0,
            in_progress: 0,
            fixed: 0,
            in_testing: 0
          }
        }
      };
      addProject(newProjectData);
    }
    onClose();
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }));
  };

  const handleUserToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={project ? 'Edit Project' : 'Create New Project'}
      className="max-w-2xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="text-text-muted hover:text-text">Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{project ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-text">Project Name <span className="text-red-500">*</span></label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g., E-Commerce App" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="key" className="text-sm font-medium text-text">Project Key <span className="text-red-500">*</span></label>
            <Input 
              id="key" 
              value={formData.key} 
              onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })} 
              placeholder="e.g., ECO" 
              maxLength={10}
              required 
            />
            <p className="text-xs text-text-muted">A short, unique prefix for test cases (e.g., ECO-1).</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-text">Description</label>
          <textarea 
            id="description" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            placeholder="Brief description of the project..." 
            className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px] text-text"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="template" className="text-sm font-medium text-text">Test Case Template</label>
          <select
            id="template"
            value={formData.testCaseTemplateId}
            onChange={(e) => setFormData({ ...formData, testCaseTemplateId: e.target.value })}
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Select a template</option>
            {testCaseTemplates.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3 bg-surface border border-border rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={formData.enableTestCaseApproval}
                onChange={(e) => setFormData({ ...formData, enableTestCaseApproval: e.target.checked })}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text">Enable Test Case Approval</span>
              <span className="text-xs text-text-muted mt-1">
                If enabled, new test cases will be placed in a "Draft" directory and must be approved before they can be executed in a Test Run.
              </span>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Assign Users <span className="text-xs font-normal text-text-muted">(Optional)</span>
            </label>
            <MultiSelect
              options={users.filter(u => u.role !== 'Admin').map(u => ({ id: u.id, name: u.name }))}
              selectedIds={formData.selectedUsers}
              onChange={(ids) => setFormData(prev => ({ ...prev, selectedUsers: ids }))}
              placeholder="Add user..."
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Assign Groups <span className="text-xs font-normal text-text-muted">(Optional)</span>
            </label>
            <MultiSelect
              options={groups.map(g => ({ id: g.id, name: g.name }))}
              selectedIds={formData.selectedGroups}
              onChange={(ids) => setFormData(prev => ({ ...prev, selectedGroups: ids }))}
              placeholder="Add group..."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
