import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface TestRun {
  id: string;
  projectId: string;
  name: string;
  description: string;
  milestoneId?: string;
  assignedTo?: string;
  includeAllCases: boolean;
  specificCaseIds?: string[];
  status: 'Open' | 'In Progress' | 'Completed';
  stats: {
    passed: number;
    failed: number;
    untested: number;
    total: number;
  };
}

export interface TestPlan {
  id: string;
  projectId: string;
  name: string;
  description: string;
  milestoneId?: string;
  testRunIds: string[];
  status: 'Open' | 'In Progress' | 'Completed';
}

interface TestExecutionState {
  testRuns: TestRun[];
  testPlans: TestPlan[];
  isLoading: boolean;
  error: string | null;
  fetchTestRuns: (projectId: string) => Promise<void>;
  fetchTestPlans: (projectId: string) => Promise<void>;
  addTestRun: (run: Omit<TestRun, 'id' | 'stats'>) => Promise<void>;
  updateTestRun: (id: string, run: Partial<TestRun>) => Promise<void>;
  deleteTestRun: (id: string) => Promise<void>;
  addTestPlan: (plan: Omit<TestPlan, 'id'>) => Promise<void>;
  updateTestPlan: (id: string, plan: Partial<TestPlan>) => Promise<void>;
  deleteTestPlan: (id: string) => Promise<void>;
}

export const useTestExecutionStore = create<TestExecutionState>((set) => ({
  testRuns: [],
  testPlans: [],
  isLoading: false,
  error: null,
  fetchTestRuns: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.getTestRuns(projectId);
      set({ testRuns: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchTestPlans: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.getTestPlans(projectId);
      set({ testPlans: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addTestRun: async (run) => {
    set({ isLoading: true, error: null });
    try {
      const newRun = await mockApi.addTestRun(run);
      set((state) => ({ testRuns: [...state.testRuns, newRun], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateTestRun: async (id, run) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRun = await mockApi.updateTestRun(id, run);
      set((state) => ({
        testRuns: state.testRuns.map((r) => (r.id === id ? updatedRun : r)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteTestRun: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockApi.deleteTestRun(id);
      set((state) => ({
        testRuns: state.testRuns.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addTestPlan: async (plan) => {
    set({ isLoading: true, error: null });
    try {
      const newPlan = await mockApi.addTestPlan(plan);
      set((state) => ({ testPlans: [...state.testPlans, newPlan], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateTestPlan: async (id, plan) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlan = await mockApi.updateTestPlan(id, plan);
      set((state) => ({
        testPlans: state.testPlans.map((p) => (p.id === id ? updatedPlan : p)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteTestPlan: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockApi.deleteTestPlan(id);
      set((state) => ({
        testPlans: state.testPlans.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
