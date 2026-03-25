import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface TestCase {
  id: string; // e.g., NDK-1
  projectId: string;
  title: string;
  type: string;
  priority: string;
  status: 'Passed' | 'Failed' | 'Untested' | 'Blocked' | 'Retest';
  reviewStatus?: 'Draft' | 'Ready for Review' | 'In Review' | 'Needs Update' | 'Approved' | 'Rejected';
  assignee?: string;
  directory: string; // Suite or folder
  // Dynamic fields will be stored here
  customFields?: Record<string, any>;
  testStepTemplateId?: string;
  testStepsData?: Record<string, any>;
}

interface TestCaseState {
  testCases: TestCase[];
  isLoading: boolean;
  error: string | null;
  fetchTestCases: (projectId: string) => Promise<void>;
  addTestCase: (testCase: Omit<TestCase, 'id'>) => Promise<void>;
  updateTestCase: (id: string, testCase: Partial<TestCase>) => Promise<void>;
  deleteTestCase: (id: string) => Promise<void>;
}

export const useTestCaseStore = create<TestCaseState>((set) => ({
  testCases: [],
  isLoading: false,
  error: null,
  fetchTestCases: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await mockApi.getTestCases(projectId);
      set({ testCases: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addTestCase: async (testCase) => {
    set({ isLoading: true, error: null });
    try {
      const newCase = await mockApi.addTestCase(testCase);
      set((state) => ({ testCases: [...state.testCases, newCase], isLoading: false }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateTestCase: async (id, testCase) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCase = await mockApi.updateTestCase(id, testCase);
      set((state) => ({
        testCases: state.testCases.map((tc) => (tc.id === id ? updatedCase : tc)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  deleteTestCase: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await mockApi.deleteTestCase(id);
      set((state) => ({
        testCases: state.testCases.filter((tc) => tc.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
