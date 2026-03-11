import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface Group {
  id: string;
  name: string;
  description: string;
  users: number;
  projects: number;
}

interface GroupState {
  groups: Group[];
  isLoading: boolean;
  fetchGroups: () => Promise<void>;
  addGroup: (group: Omit<Group, 'id'>) => Promise<void>;
  updateGroup: (id: string, group: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  isLoading: false,
  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const groups = await mockApi.getGroups();
      set({ groups, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch groups', error);
      set({ isLoading: false });
    }
  },
  addGroup: async (group) => {
    try {
      // @ts-ignore
      const newGroup = await mockApi.addGroup(group);
      set((state) => ({ groups: [...state.groups, newGroup as any] }));
    } catch (error) {
      console.error('Failed to add group', error);
    }
  },
  updateGroup: async (id, updatedGroup) => {
    try {
      // @ts-ignore
      const updated = await mockApi.updateGroup(id, updatedGroup);
      set((state) => ({
        groups: state.groups.map(g => g.id === id ? updated as any : g)
      }));
    } catch (error) {
      console.error('Failed to update group', error);
    }
  },
  deleteGroup: async (id) => {
    try {
      await mockApi.deleteGroup(id);
      set((state) => ({
        groups: state.groups.filter(g => g.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete group', error);
    }
  }
}));
