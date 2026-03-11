import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface CaseField {
  id: string;
  name: string;
  description: string;
  type: string;
  testCaseTemplate: string[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  minChars?: string;
  maxChars?: string;
  allowNegative?: boolean;
  checkedByDefault?: boolean;
  dateType?: string;
  dateFormat?: string;
  options?: string[];
}

export interface TestStepField {
  id: string;
  name: string;
  type: string;
  subFields?: TestStepField[];
}

export interface TestStepTemplate {
  id: string;
  name: string;
  description: string;
  testCaseTemplate: string[];
  fields: TestStepField[];
}

export interface TestCaseFieldConfig {
  id: string;
  width: number; // 12 for full, 6 for half, 4 for third, 3 for quarter
  section: number;
  column: number;
}

export interface TestCaseTemplate {
  id: string;
  name: string;
  description: string;
  fields: TestCaseFieldConfig[]; // Array of field configurations
  testStepTemplateMode: 'dynamic' | 'strict';
  testStepTemplateId?: string;
}

interface CustomizationState {
  caseFields: CaseField[];
  testStepTemplates: TestStepTemplate[];
  testCaseTemplates: TestCaseTemplate[];
  isLoading: boolean;
  
  fetchCustomizations: () => Promise<void>;

  addCaseField: (field: Omit<CaseField, 'id'>) => Promise<void>;
  updateCaseField: (id: string, field: Partial<CaseField>) => Promise<void>;
  deleteCaseField: (id: string) => Promise<void>;

  addTestStepTemplate: (template: Omit<TestStepTemplate, 'id'>) => Promise<void>;
  updateTestStepTemplate: (id: string, template: Partial<TestStepTemplate>) => Promise<void>;
  deleteTestStepTemplate: (id: string) => Promise<void>;

  addTestCaseTemplate: (template: Omit<TestCaseTemplate, 'id'>) => Promise<void>;
  updateTestCaseTemplate: (id: string, template: Partial<TestCaseTemplate>) => Promise<void>;
  deleteTestCaseTemplate: (id: string) => Promise<void>;
}

export const useCustomizationStore = create<CustomizationState>((set) => ({
  caseFields: [],
  testStepTemplates: [],
  testCaseTemplates: [],
  isLoading: false,

  fetchCustomizations: async () => {
    set({ isLoading: true });
    try {
      const [caseFields, testStepTemplates, testCaseTemplates] = await Promise.all([
        mockApi.getCaseFields(),
        mockApi.getTestStepTemplates(),
        mockApi.getTestCaseTemplates()
      ]);
      set({ caseFields, testStepTemplates, testCaseTemplates, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch customizations', error);
      set({ isLoading: false });
    }
  },

  addCaseField: async (field) => {
    try {
      const newField = await mockApi.addCaseField(field);
      set((state) => ({ caseFields: [...state.caseFields, newField] }));
    } catch (error) {
      console.error('Failed to add case field', error);
    }
  },
  updateCaseField: async (id, field) => {
    try {
      const updated = await mockApi.updateCaseField(id, field);
      set((state) => ({
        caseFields: state.caseFields.map(f => f.id === id ? updated : f)
      }));
    } catch (error) {
      console.error('Failed to update case field', error);
    }
  },
  deleteCaseField: async (id) => {
    try {
      await mockApi.deleteCaseField(id);
      set((state) => ({
        caseFields: state.caseFields.filter(f => f.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete case field', error);
    }
  },

  addTestStepTemplate: async (template) => {
    try {
      const newTemplate = await mockApi.addTestStepTemplate(template);
      set((state) => ({ testStepTemplates: [...state.testStepTemplates, newTemplate] }));
    } catch (error) {
      console.error('Failed to add test step template', error);
    }
  },
  updateTestStepTemplate: async (id, template) => {
    try {
      const updated = await mockApi.updateTestStepTemplate(id, template);
      set((state) => ({
        testStepTemplates: state.testStepTemplates.map(t => t.id === id ? updated : t)
      }));
    } catch (error) {
      console.error('Failed to update test step template', error);
    }
  },
  deleteTestStepTemplate: async (id) => {
    try {
      await mockApi.deleteTestStepTemplate(id);
      set((state) => ({
        testStepTemplates: state.testStepTemplates.filter(t => t.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete test step template', error);
    }
  },

  addTestCaseTemplate: async (template) => {
    try {
      const newTemplate = await mockApi.addTestCaseTemplate(template);
      set((state) => ({ testCaseTemplates: [...state.testCaseTemplates, newTemplate] }));
    } catch (error) {
      console.error('Failed to add test case template', error);
    }
  },
  updateTestCaseTemplate: async (id, template) => {
    try {
      const updated = await mockApi.updateTestCaseTemplate(id, template);
      set((state) => ({
        testCaseTemplates: state.testCaseTemplates.map(t => t.id === id ? updated : t)
      }));
    } catch (error) {
      console.error('Failed to update test case template', error);
    }
  },
  deleteTestCaseTemplate: async (id) => {
    try {
      await mockApi.deleteTestCaseTemplate(id);
      set((state) => ({
        testCaseTemplates: state.testCaseTemplates.filter(t => t.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete test case template', error);
    }
  },
}));
