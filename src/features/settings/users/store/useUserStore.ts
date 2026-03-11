import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'Active' | 'Inactive';
  groups: number;
  projects: number;
  lastActive: string;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'lastActive'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await mockApi.getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch users', error);
      set({ isLoading: false });
    }
  },
  addUser: async (user) => {
    try {
      // @ts-ignore - mockApi expects different User type, we'll fix this later
      const newUser = await mockApi.addUser(user);
      set((state) => ({ users: [...state.users, newUser as any] }));
    } catch (error) {
      console.error('Failed to add user', error);
    }
  },
  updateUser: async (id, updatedUser) => {
    try {
      // @ts-ignore
      const updated = await mockApi.updateUser(id, updatedUser);
      set((state) => ({
        users: state.users.map(u => u.id === id ? updated as any : u)
      }));
    } catch (error) {
      console.error('Failed to update user', error);
    }
  },
  deleteUser: async (id) => {
    try {
      await mockApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter(u => u.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  },
  toggleUserStatus: async (id) => {
    try {
      set((state) => {
        const user = state.users.find(u => u.id === id);
        if (!user) return state;
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        // @ts-ignore
        mockApi.updateUser(id, { status: newStatus });
        return {
          users: state.users.map(u => u.id === id ? { ...u, status: newStatus } : u)
        };
      });
    } catch (error) {
      console.error('Failed to toggle user status', error);
    }
  }
}));
