import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Open' | 'Completed';
}

interface MilestoneState {
  milestones: Milestone[];
  isLoading: boolean;
  error: string | null;
  fetchMilestones: (projectId: string) => Promise<void>;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => Promise<void>;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
}

export const useMilestoneStore = create<MilestoneState>((set) => ({
  milestones: [],
  isLoading: false,
  error: null,
  fetchMilestones: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.getMilestones(projectId);
      set({ milestones: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addMilestone: async (milestone) => {
    set({ isLoading: true, error: null });
    try {
      const newMilestone = await mockApi.addMilestone(milestone);
      set((state) => ({ milestones: [...state.milestones, newMilestone], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateMilestone: async (id, milestone) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMilestone = await mockApi.updateMilestone(id, milestone);
      set((state) => ({
        milestones: state.milestones.map((m) => (m.id === id ? updatedMilestone : m)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteMilestone: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockApi.deleteMilestone(id);
      set((state) => ({
        milestones: state.milestones.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
