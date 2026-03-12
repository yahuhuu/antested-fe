import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

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
  userIds: string[];
  permissions: RolePermissions;
}

interface RoleState {
  roles: Role[];
  isLoading: boolean;
  fetchRoles: () => Promise<void>;
  addRole: (role: Omit<Role, 'id'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  isLoading: false,
  fetchRoles: async () => {
    set({ isLoading: true });
    try {
      const roles = await mockApi.getRoles();
      set({ roles, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch roles', error);
      set({ isLoading: false });
    }
  },
  addRole: async (role) => {
    try {
      const newRole = await mockApi.addRole(role);
      set((state) => ({ roles: [...state.roles, newRole] }));
    } catch (error) {
      console.error('Failed to add role', error);
    }
  },
  updateRole: async (id, updatedRole) => {
    try {
      const updated = await mockApi.updateRole(id, updatedRole);
      set((state) => ({
        roles: state.roles.map(r => r.id === id ? updated : r)
      }));
    } catch (error) {
      console.error('Failed to update role', error);
    }
  },
  deleteRole: async (id) => {
    try {
      await mockApi.deleteRole(id);
      set((state) => ({
        roles: state.roles.filter(r => r.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete role', error);
    }
  }
}));
