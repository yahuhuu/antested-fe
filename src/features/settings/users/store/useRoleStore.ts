import { create } from 'zustand';

export interface RolePermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface RolePermissions {
  projects: RolePermission;
  testPlans: RolePermission;
  testCases: RolePermission;
  testRuns: RolePermission;
  milestones: RolePermission;
  bugs: RolePermission;
  settings_manageProjects: RolePermission;
  settings_manageUsersRoles: RolePermission;
  settings_manageCustomizations: RolePermission;
  settings_manageIntegrations: RolePermission;
  settings_manageDataManagement: RolePermission;
  settings_manageSiteSettings: RolePermission;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: RolePermissions;
}

interface RoleState {
  roles: Role[];
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
}

const defaultPermissions: RolePermissions = {
  projects: { create: false, read: true, update: false, delete: false },
  testPlans: { create: false, read: true, update: false, delete: false },
  testCases: { create: false, read: true, update: false, delete: false },
  testRuns: { create: false, read: true, update: false, delete: false },
  milestones: { create: false, read: true, update: false, delete: false },
  bugs: { create: false, read: true, update: false, delete: false },
  settings_manageProjects: { create: false, read: false, update: false, delete: false },
  settings_manageUsersRoles: { create: false, read: false, update: false, delete: false },
  settings_manageCustomizations: { create: false, read: false, update: false, delete: false },
  settings_manageIntegrations: { create: false, read: false, update: false, delete: false },
  settings_manageDataManagement: { create: false, read: false, update: false, delete: false },
  settings_manageSiteSettings: { create: false, read: false, update: false, delete: false },
};

const adminPermissions: RolePermissions = {
  projects: { create: true, read: true, update: true, delete: true },
  testPlans: { create: true, read: true, update: true, delete: true },
  testCases: { create: true, read: true, update: true, delete: true },
  testRuns: { create: true, read: true, update: true, delete: true },
  milestones: { create: true, read: true, update: true, delete: true },
  bugs: { create: true, read: true, update: true, delete: true },
  settings_manageProjects: { create: true, read: true, update: true, delete: true },
  settings_manageUsersRoles: { create: true, read: true, update: true, delete: true },
  settings_manageCustomizations: { create: true, read: true, update: true, delete: true },
  settings_manageIntegrations: { create: true, read: true, update: true, delete: true },
  settings_manageDataManagement: { create: true, read: true, update: true, delete: true },
  settings_manageSiteSettings: { create: true, read: true, update: true, delete: true },
};

const mockRoles: Role[] = [
  { id: 'role-1', name: 'Admin', description: 'Full access to all projects and settings.', users: 2, permissions: adminPermissions },
  { id: 'role-2', name: 'Lead', description: 'Can manage projects and users within their groups.', users: 5, permissions: { ...defaultPermissions, projects: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-3', name: 'Developer', description: 'Can execute tests and manage defects.', users: 10, permissions: { ...defaultPermissions, bugs: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-4', name: 'Tester', description: 'Can execute tests and report defects.', users: 15, permissions: { ...defaultPermissions, testRuns: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-5', name: 'Guest', description: 'Read-only access to assigned projects.', users: 3, permissions: defaultPermissions },
];

export const useRoleStore = create<RoleState>((set) => ({
  roles: mockRoles,
  addRole: (role) => set((state) => ({
    roles: [...state.roles, { ...role, id: `role-${state.roles.length + 1}` }]
  })),
  updateRole: (id, updatedRole) => set((state) => ({
    roles: state.roles.map(r => r.id === id ? { ...r, ...updatedRole } : r)
  })),
  deleteRole: (id) => set((state) => ({
    roles: state.roles.filter(r => r.id !== id)
  }))
}));
