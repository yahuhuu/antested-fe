import { create } from 'zustand';

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
  
  addCaseField: (field: Omit<CaseField, 'id'>) => void;
  updateCaseField: (id: string, field: Partial<CaseField>) => void;
  deleteCaseField: (id: string) => void;

  addTestStepTemplate: (template: Omit<TestStepTemplate, 'id'>) => void;
  updateTestStepTemplate: (id: string, template: Partial<TestStepTemplate>) => void;
  deleteTestStepTemplate: (id: string) => void;

  addTestCaseTemplate: (template: Omit<TestCaseTemplate, 'id'>) => void;
  updateTestCaseTemplate: (id: string, template: Partial<TestCaseTemplate>) => void;
  deleteTestCaseTemplate: (id: string) => void;
}

export const useCustomizationStore = create<CustomizationState>((set) => ({
  caseFields: [
    { id: '1', name: 'Test Case Type', description: 'Type of the test case.', type: 'Dropdown', testCaseTemplate: ['1', '2'], options: ['Functional', 'Performance', 'Security'] },
    { id: '2', name: 'Priority', description: 'Priority of the test case.', type: 'Dropdown', testCaseTemplate: ['1', '2', '3'], options: ['High', 'Medium', 'Low'] },
    { id: '3', name: 'Assign To', description: 'The user assigned to this test case.', type: 'User', testCaseTemplate: ['1'] },
    { id: '4', name: 'Preconditions', description: 'Conditions that must be met before the test case can be executed.', type: 'Text', testCaseTemplate: ['1', '2', '3'] },
    { id: '5', name: 'Is Automated', description: 'Check if this test case is automated.', type: 'Checkbox', testCaseTemplate: ['1'] },
    { id: '6', name: 'Sprint', description: 'The sprint number associated with this test case.', type: 'String', testCaseTemplate: ['1'] },
    { id: '7', name: 'Browser', description: 'The browser used for testing.', type: 'Dropdown', testCaseTemplate: ['1'], options: ['Chrome', 'Firefox', 'Safari', 'Edge'] },
  ],
  testStepTemplates: [
    { 
      id: '1', 
      name: 'Test Step (Single Step)', 
      description: 'A simple template with one area for steps and one for expected results.', 
      testCaseTemplate: ['1'],
      fields: [
        { id: 'f1', name: 'Steps', type: 'Text Area' },
        { id: 'f2', name: 'Expected Results', type: 'Text Area' }
      ]
    },
    { 
      id: '2', 
      name: 'Test Step (Multiple Steps)', 
      description: 'A template for test cases with multiple, distinct steps.', 
      testCaseTemplate: ['1'],
      fields: [
        { 
          id: 'f3', 
          name: 'Steps', 
          type: 'Repeater',
          subFields: [
            { id: 'sf1', name: 'Step Description', type: 'Text Area' },
            { id: 'sf2', name: 'Expected Result', type: 'Text Area' }
          ]
        }
      ]
    },
    { 
      id: '3', 
      name: 'Behaviour Driven Development', 
      description: 'A template for writing BDD scenarios using Gherkin syntax (Given, When, Then).', 
      testCaseTemplate: ['1'],
      fields: [
        { id: 'f4', name: 'Scenario', type: 'Text Area' }
      ]
    },
    { 
      id: '4', 
      name: 'Exploratory Sessions', 
      description: 'A template for guiding exploratory testing sessions.', 
      testCaseTemplate: ['1'],
      fields: [
        { id: 'f5', name: 'Session Notes', type: 'Text Area' }
      ]
    },
  ],
  testCaseTemplates: [
    { id: '1', name: 'Default Template', description: 'Standard template for UI tests', fields: [{id: 'title', width: 12}, {id: 'directory', width: 6}, {id: '1', width: 6}, {id: '2', width: 6}, {id: '3', width: 6}, {id: '4', width: 12}, {id: '5', width: 6}, {id: '6', width: 6}, {id: '7', width: 6}], testStepTemplateMode: 'dynamic' },
    { id: '2', name: 'API Template', description: 'Template for backend API tests', fields: [{id: 'title', width: 12}, {id: 'directory', width: 6}, {id: '1', width: 6}, {id: '2', width: 6}, {id: '4', width: 12}], testStepTemplateMode: 'strict', testStepTemplateId: '1' },
    { id: '3', name: 'Performance Template', description: 'Template for performance tests', fields: [{id: 'title', width: 12}, {id: 'directory', width: 6}, {id: '2', width: 6}, {id: '4', width: 12}], testStepTemplateMode: 'strict', testStepTemplateId: '2' },
  ],

  addCaseField: (field) => set((state) => ({
    caseFields: [...state.caseFields, { ...field, id: Math.random().toString(36).substring(2, 9) }]
  })),
  updateCaseField: (id, field) => set((state) => ({
    caseFields: state.caseFields.map(f => f.id === id ? { ...f, ...field } : f)
  })),
  deleteCaseField: (id) => set((state) => ({
    caseFields: state.caseFields.filter(f => f.id !== id)
  })),

  addTestStepTemplate: (template) => set((state) => ({
    testStepTemplates: [...state.testStepTemplates, { ...template, id: Math.random().toString(36).substring(2, 9) }]
  })),
  updateTestStepTemplate: (id, template) => set((state) => ({
    testStepTemplates: state.testStepTemplates.map(t => t.id === id ? { ...t, ...template } : t)
  })),
  deleteTestStepTemplate: (id) => set((state) => ({
    testStepTemplates: state.testStepTemplates.filter(t => t.id !== id)
  })),

  addTestCaseTemplate: (template) => set((state) => ({
    testCaseTemplates: [...state.testCaseTemplates, { ...template, id: Math.random().toString(36).substring(2, 9) }]
  })),
  updateTestCaseTemplate: (id, template) => set((state) => ({
    testCaseTemplates: state.testCaseTemplates.map(t => t.id === id ? { ...t, ...template } : t)
  })),
  deleteTestCaseTemplate: (id) => set((state) => ({
    testCaseTemplates: state.testCaseTemplates.filter(t => t.id !== id)
  })),
}));
