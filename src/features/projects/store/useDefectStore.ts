import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface Defect {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  assigneeId?: string;
  testRunId?: string;
  testCaseId?: string;
}

interface DefectState {
  defects: Defect[];
  isLoading: boolean;
  error: string | null;
  fetchDefects: (projectId: string) => Promise<void>;
  addDefect: (defect: Omit<Defect, 'id'>) => Promise<void>;
  updateDefect: (id: string, defect: Partial<Defect>) => Promise<void>;
  deleteDefect: (id: string) => Promise<void>;
}

export const useDefectStore = create<DefectState>((set) => ({
  defects: [],
  isLoading: false,
  error: null,
  fetchDefects: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.getDefects(projectId);
      set({ defects: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addDefect: async (defect) => {
    set({ isLoading: true, error: null });
    try {
      const newDefect = await mockApi.addDefect(defect);
      set((state) => ({ defects: [...state.defects, newDefect], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateDefect: async (id, defect) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDefect = await mockApi.updateDefect(id, defect);
      set((state) => ({
        defects: state.defects.map((d) => (d.id === id ? updatedDefect : d)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteDefect: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockApi.deleteDefect(id);
      set((state) => ({
        defects: state.defects.filter((d) => d.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
