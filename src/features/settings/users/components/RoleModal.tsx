import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRoleStore, Role, RolePermissions, RolePermission } from '@/features/settings/users/store/useRoleStore';
import { Type, AlignLeft, Shield } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
}

const defaultPermissions: RolePermissions = {
  projects: { create: false, read: false, update: false, delete: false },
  testPlans: { create: false, read: false, update: false, delete: false },
  testCases: { create: false, read: false, update: false, delete: false },
  testRuns: { create: false, read: false, update: false, delete: false },
  milestones: { create: false, read: false, update: false, delete: false },
  bugs: { create: false, read: false, update: false, delete: false },
  settings_manageProjects: { create: false, read: false, update: false, delete: false },
  settings_manageUsersRoles: { create: false, read: false, update: false, delete: false },
  settings_manageCustomizations: { create: false, read: false, update: false, delete: false },
  settings_manageIntegrations: { create: false, read: false, update: false, delete: false },
  settings_manageDataManagement: { create: false, read: false, update: false, delete: false },
  settings_manageSiteSettings: { create: false, read: false, update: false, delete: false },
};

const permissionSections = [
  { key: 'projects', label: 'Projects' },
  { key: 'testPlans', label: 'Test Plans' },
  { key: 'testCases', label: 'Test Cases' },
  { key: 'testRuns', label: 'Test Runs' },
  { key: 'milestones', label: 'Milestones' },
  { key: 'bugs', label: 'Bugs' },
];

const settingsSections = [
  { key: 'settings_manageProjects', label: 'Manage Projects' },
  { key: 'settings_manageUsersRoles', label: 'Manage Users & Roles' },
  { key: 'settings_manageCustomizations', label: 'Manage Customizations' },
  { key: 'settings_manageIntegrations', label: 'Manage Integrations' },
  { key: 'settings_manageDataManagement', label: 'Manage Data Management' },
  { key: 'settings_manageSiteSettings', label: 'Manage Site Settings' },
];

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const { addRole, updateRole } = useRoleStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: defaultPermissions,
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: defaultPermissions,
      });
    }
  }, [role, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      updateRole(role.id, {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      });
    } else {
      addRole({
        name: formData.name,
        description: formData.description,
        userIds: [],
        permissions: formData.permissions,
      });
    }
    onClose();
  };

  const togglePermission = (sectionKey: keyof RolePermissions, action: keyof RolePermission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [sectionKey]: {
          ...prev.permissions[sectionKey],
          [action]: !prev.permissions[sectionKey][action]
        }
      }
    }));
  };

  const renderPermissionRow = (sectionKey: keyof RolePermissions, label: string) => {
    const perms = formData.permissions[sectionKey];
    return (
      <div key={sectionKey} className="flex items-center justify-between py-3 border-b border-border last:border-0 group hover:bg-surface-hover/50 px-4 -mx-2 rounded-md transition-colors">
        <span className="text-sm font-medium text-text w-1/3">{label}</span>
        <div className="flex items-center justify-end gap-4 sm:gap-8 w-2/3">
          {(['create', 'read', 'update', 'delete'] as const).map(action => {
            const isSelected = perms[action];
            return (
              <label
                key={action}
                className="flex items-center justify-center w-12 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePermission(sectionKey, action)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background cursor-pointer transition-all hover:ring-2 hover:ring-primary/20"
                />
              </label>
            );
          })}
        </div>
      </div>
    );
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
        form="role-form"
        className="px-6 font-medium bg-primary hover:bg-primary-hover text-white shadow-sm transition-all hover:shadow"
      >
        {role ? 'Save Changes' : 'Create Role'}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={role ? 'Edit Role' : 'Add New Role'}
      className="max-w-3xl"
      footer={footer}
    >
      <form id="role-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-text flex items-center gap-2">
                <Type className="w-4 h-4 text-text-muted" />
                Role Name
              </label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g., QA Manager" 
                required 
                className="bg-background border-border transition-all focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-text flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-text-muted" />
                Description
              </label>
              <Input 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Brief description..."
                required 
                className="bg-background border-border transition-all focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Permissions Matrix
              </h3>
              <p className="text-xs text-text-muted">Configure access levels for this role.</p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider w-1/3">Core Features</h4>
                  <div className="flex items-center justify-end gap-4 sm:gap-8 w-2/3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <div className="w-12 text-center">Create</div>
                    <div className="w-12 text-center">Read</div>
                    <div className="w-12 text-center">Update</div>
                    <div className="w-12 text-center">Delete</div>
                  </div>
                </div>
                <div className="bg-background rounded-lg p-2 border border-border shadow-sm">
                  {permissionSections.map(section => renderPermissionRow(section.key as keyof RolePermissions, section.label))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-4">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider w-1/3">Settings</h4>
                  <div className="flex items-center justify-end gap-4 sm:gap-8 w-2/3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <div className="w-12 text-center">Create</div>
                    <div className="w-12 text-center">Read</div>
                    <div className="w-12 text-center">Update</div>
                    <div className="w-12 text-center">Delete</div>
                  </div>
                </div>
                <div className="bg-background rounded-lg p-2 border border-border shadow-sm">
                  {settingsSections.map(section => renderPermissionRow(section.key as keyof RolePermissions, section.label))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
