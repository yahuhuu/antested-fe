import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useGroupStore, Group } from '@/features/settings/users/store/useGroupStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { Users, FolderKanban, AlignLeft, Type } from 'lucide-react';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { cn } from '@/utils/cn';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: Group;
}

export function GroupModal({ isOpen, onClose, group }: GroupModalProps) {
  const { addGroup, updateGroup } = useGroupStore();
  const { users } = useUserStore();
  const { projects } = useProjectStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedUsers: [] as string[],
    selectedProjects: [] as string[],
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        selectedUsers: group.userIds || [],
        selectedProjects: group.projectIds || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        selectedUsers: [],
        selectedProjects: [],
      });
    }
  }, [group, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (group) {
      updateGroup(group.id, {
        name: formData.name,
        description: formData.description,
        userIds: formData.selectedUsers,
        projectIds: formData.selectedProjects,
      });
    } else {
      addGroup({
        name: formData.name,
        description: formData.description,
        userIds: formData.selectedUsers,
        projectIds: formData.selectedProjects,
      });
    }
    onClose();
  };

  const handleUserToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  const handleProjectToggle = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId]
    }));
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose} 
        className="px-5 font-medium text-text-muted hover:text-text hover:bg-surface-hover border-border"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="group-form"
        className="px-6 font-medium bg-primary hover:bg-primary-hover text-white shadow-sm transition-all hover:shadow"
      >
        {group ? 'Save Changes' : 'Create Group'}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={group ? 'Edit Group' : 'Add New Group'}
      className="max-w-2xl"
      footer={footer}
    >
      <form id="group-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-text flex items-center gap-2">
              <Type className="w-4 h-4 text-text-muted" />
              Group Name
            </label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g., QA Team" 
              required 
              className="bg-background border-border transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-text flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-text-muted" />
              Description
            </label>
            <textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Brief description of the group's purpose..."
              required 
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-text resize-none transition-all"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <Users className="w-4 h-4 text-text-muted" />
              Assign Users <span className="text-xs font-normal text-text-muted">(Optional)</span>
            </label>
            <MultiSelect
              options={users.map(u => ({ id: u.id, name: u.name }))}
              selectedIds={formData.selectedUsers}
              onChange={(ids) => setFormData(prev => ({ ...prev, selectedUsers: ids }))}
              placeholder="Add user..."
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-text-muted" />
              Assign Projects <span className="text-xs font-normal text-text-muted">(Optional)</span>
            </label>
            <MultiSelect
              options={projects.map(p => ({ id: p.id, name: p.name }))}
              selectedIds={formData.selectedProjects}
              onChange={(ids) => setFormData(prev => ({ ...prev, selectedProjects: ids }))}
              placeholder="Add project..."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
