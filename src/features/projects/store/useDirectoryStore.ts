import { create } from 'zustand';

export interface Directory {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  parentId: string | null;
}

interface DirectoryState {
  directories: Directory[];
  fetchDirectories: (projectId: string) => Promise<void>;
  addDirectory: (directory: Omit<Directory, 'id'>) => Promise<void>;
  updateDirectory: (id: string, directory: Partial<Directory>) => Promise<void>;
  deleteDirectory: (id: string) => Promise<void>;
}

// Initial mock data
const initialDirectories: Directory[] = [
  { id: 'dir-1', projectId: 'PRJ-1', name: 'Authentication', description: 'Login, registration, and password recovery', parentId: null },
  { id: 'dir-2', projectId: 'PRJ-1', name: 'Dashboard', description: 'Main user dashboard features', parentId: null },
  { id: 'dir-3', projectId: 'PRJ-1', name: 'Payments', description: 'Payment processing and history', parentId: null },
  { id: 'dir-4', projectId: 'PRJ-1', name: 'Settings', description: 'User settings and preferences', parentId: null },
  { id: 'dir-5', projectId: 'PRJ-1', name: 'Login', description: 'Login tests', parentId: 'dir-1' },
];

export const useDirectoryStore = create<DirectoryState>((set) => ({
  directories: initialDirectories,
  fetchDirectories: async (projectId) => {
    // In a real app, this would fetch from an API
    // For now, we just use the initial mock data
  },
  addDirectory: async (directory) => {
    const newDir = { ...directory, id: `dir-${Date.now()}` };
    set((state) => ({ directories: [...state.directories, newDir] }));
  },
  updateDirectory: async (id, directory) => {
    set((state) => ({
      directories: state.directories.map((d) => (d.id === id ? { ...d, ...directory } : d)),
    }));
  },
  deleteDirectory: async (id) => {
    set((state) => ({
      directories: state.directories.filter((d) => d.id !== id && d.parentId !== id),
    }));
  },
}));
