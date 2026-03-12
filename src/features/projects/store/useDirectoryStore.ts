import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface Directory {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  parentId: string | null;
}

interface DirectoryState {
  directories: Directory[];
  isLoading: boolean;
  error: string | null;
  fetchDirectories: (projectId: string) => Promise<void>;
  addDirectory: (directory: Omit<Directory, 'id'>) => Promise<void>;
  updateDirectory: (id: string, directory: Partial<Directory>) => Promise<void>;
  deleteDirectory: (id: string) => Promise<void>;
}

export const useDirectoryStore = create<DirectoryState>((set) => ({
  directories: [],
  isLoading: false,
  error: null,
  fetchDirectories: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.getDirectories(projectId);
      set({ directories: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addDirectory: async (directory) => {
    set({ isLoading: true, error: null });
    try {
      const newDir = await mockApi.addDirectory(directory);
      set((state) => ({ directories: [...state.directories, newDir], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateDirectory: async (id, directory) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDir = await mockApi.updateDirectory(id, directory);
      set((state) => ({
        directories: state.directories.map((d) => (d.id === id ? updatedDir : d)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteDirectory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockApi.deleteDirectory(id);
      set((state) => ({
        directories: state.directories.filter((d) => d.id !== id && d.parentId !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
