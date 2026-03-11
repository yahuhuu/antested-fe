import { Project } from '@/features/projects/store/useProjectStore';
import { Milestone } from '@/features/projects/store/useMilestoneStore';
import { TestCase } from '@/features/projects/store/useTestCaseStore';
import { Defect } from '@/features/projects/store/useDefectStore';
import { TestRun, TestPlan } from '@/features/test-runs/store/useTestExecutionStore';
import { CaseField, TestStepTemplate, TestCaseTemplate } from '@/features/settings/customizations/store/useCustomizationStore';
import { Role, RolePermissions } from '@/features/settings/users/store/useRoleStore';
import { User } from '@/features/settings/users/store/useUserStore';
import { Group } from '@/features/settings/users/store/useGroupStore';

// Initial Mock Data
const initialProjects: Project[] = [
  {
    id: "d813917c-5942-484f-9e44-e4d416d9a056",
    name: "Nobi Dana Kripto",
    key: "NDK",
    description: "Platform for crypto investment and savings.",
    enable_test_case_approval: true,
    test_cases: {
      total_test_cases: 450,
      status: { draft: 300, under_review: 10, rejected: 40, ready: 100 }
    },
    test_runs: {
      total_test_runs: 4,
      status: { open: 2, overdue: 1, completed: 1 }
    },
    test_plans: {
      total_test_plans: 4,
      status: { open: 2, overdue: 1, completed: 1 }
    },
    milestones: {
      total_milestones: 4,
      status: { open: 2, overdue: 1, completed: 1 }
    },
    defects: {
      total_defects: 10,
      status: { failed: 5, in_progress: 2, fixed: 2, in_testing: 1 }
    },
    test_case_templates: {
      id: "1",
      name: "Default Template",
      description: "Standard template for UI tests"
    },
    access_management: {
      users: {
        total_users: 3,
        data: [
          { id: "usr-1", name: "Admin User", email: "admin@example.com" },
          { id: "usr-2", name: "Alice Johnson", email: "alice.j@example.com" },
          { id: "usr-3", name: "Bob Williams", email: "bob.w@example.com" }
        ]
      },
      groups: {
        total_groups: 3,
        data: [
          { id: "grp-1", name: "Frontend Team", description: "QA engineers focusing on frontend testing." },
          { id: "grp-2", name: "Backend Team", description: "QA engineers focusing on API and backend testing." },
          { id: "grp-3", name: "Mobile Team", description: "QA engineers focusing on iOS and Android apps." }
        ]
      }
    }
  },
  {
    id: "PRJ-2",
    name: "Akulaku",
    key: "AKL",
    description: "Financial services and buy-now-pay-later platform.",
    enable_test_case_approval: false,
    test_cases: {
      total_test_cases: 400,
      status: { ready: 400 }
    },
    test_runs: {
      total_test_runs: 2,
      status: { open: 1, overdue: 0, completed: 1 }
    },
    test_plans: {
      total_test_plans: 2,
      status: { open: 1, overdue: 0, completed: 1 }
    },
    milestones: {
      total_milestones: 2,
      status: { open: 1, overdue: 0, completed: 1 }
    },
    defects: {
      total_defects: 8,
      status: { failed: 3, in_progress: 2, fixed: 2, in_testing: 1 }
    },
    test_case_templates: {
      id: "2",
      name: "API Template",
      description: "Template for backend API tests"
    },
    access_management: {
      users: {
        total_users: 1,
        data: [
          { id: "usr-3", name: "Bob Williams", email: "bob.w@example.com" }
        ]
      },
      groups: {
        total_groups: 1,
        data: [
          { id: "grp-2", name: "Backend Team", description: "QA engineers focusing on API and backend testing." }
        ]
      }
    }
  },
  {
    id: "PRJ-3",
    name: "Traveloka",
    key: "TVL",
    description: "All-in-one travel booking platform for flights, hotels, and activities.",
    enable_test_case_approval: true,
    test_cases: {
      total_test_cases: 150,
      status: { draft: 50, under_review: 20, rejected: 10, ready: 70 }
    },
    test_runs: {
      total_test_runs: 0,
      status: { open: 0, overdue: 0, completed: 0 }
    },
    test_plans: {
      total_test_plans: 0,
      status: { open: 0, overdue: 0, completed: 0 }
    },
    milestones: {
      total_milestones: 0,
      status: { open: 0, overdue: 0, completed: 0 }
    },
    defects: {
      total_defects: 2,
      status: { failed: 1, in_progress: 1, fixed: 0, in_testing: 0 }
    },
    test_case_templates: {
      id: "1",
      name: "Default Template",
      description: "Standard template for UI tests"
    },
    access_management: {
      users: { total_users: 0, data: [] },
      groups: { total_groups: 0, data: [] }
    }
  },
  {
    id: "PRJ-4",
    name: "Tokopedia",
    key: "TKP",
    description: "E-commerce platform.",
    enable_test_case_approval: false,
    test_cases: {
      total_test_cases: 210,
      status: { ready: 210 }
    },
    test_runs: {
      total_test_runs: 3,
      status: { open: 2, overdue: 0, completed: 1 }
    },
    test_plans: {
      total_test_plans: 3,
      status: { open: 2, overdue: 0, completed: 1 }
    },
    milestones: {
      total_milestones: 3,
      status: { open: 2, overdue: 0, completed: 1 }
    },
    defects: {
      total_defects: 5,
      status: { failed: 2, in_progress: 1, fixed: 1, in_testing: 1 }
    },
    test_case_templates: {
      id: "1",
      name: "Default Template",
      description: "Standard template for UI tests"
    },
    access_management: {
      users: { total_users: 0, data: [] },
      groups: { total_groups: 0, data: [] }
    }
  }
];

const initialCaseFields: CaseField[] = [
  { id: '1', name: 'Test Case Type', description: 'Type of the test case.', type: 'Dropdown', testCaseTemplate: ['1', '2'], options: ['Functional', 'Performance', 'Security'] },
  { id: '2', name: 'Priority', description: 'Priority of the test case.', type: 'Dropdown', testCaseTemplate: ['1', '2', '3'], options: ['High', 'Medium', 'Low'] },
  { id: '3', name: 'Assign To', description: 'The user assigned to this test case.', type: 'User', testCaseTemplate: ['1'] },
  { id: '4', name: 'Preconditions', description: 'Conditions that must be met before the test case can be executed.', type: 'Text', testCaseTemplate: ['1', '2', '3'] },
  { id: '5', name: 'Is Automated', description: 'Check if this test case is automated.', type: 'Checkbox', testCaseTemplate: ['1'] },
  { id: '6', name: 'Sprint', description: 'The sprint number associated with this test case.', type: 'String', testCaseTemplate: ['1'] },
  { id: '7', name: 'Browser', description: 'The browser used for testing.', type: 'Dropdown', testCaseTemplate: ['1'], options: ['Chrome', 'Firefox', 'Safari', 'Edge'] },
];

const initialTestStepTemplates: TestStepTemplate[] = [
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
];

const initialTestCaseTemplates: TestCaseTemplate[] = [
  { 
    id: '1', 
    name: 'Default Template', 
    description: 'Standard template for UI tests', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: '1', width: 6, section: 3, column: 1}, 
      {id: '2', width: 6, section: 3, column: 2}, 
      {id: '3', width: 6, section: 4, column: 1}, 
      {id: '4', width: 12, section: 4, column: 2}, 
      {id: '5', width: 6, section: 5, column: 1}, 
      {id: '6', width: 6, section: 5, column: 2}, 
      {id: '7', width: 6, section: 5, column: 3}
    ], 
    testStepTemplateMode: 'dynamic' 
  },
  { 
    id: '2', 
    name: 'API Template', 
    description: 'Template for backend API tests', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: '1', width: 6, section: 3, column: 1}, 
      {id: '2', width: 6, section: 3, column: 2}, 
      {id: '4', width: 12, section: 4, column: 1}
    ], 
    testStepTemplateMode: 'strict', 
    testStepTemplateId: '1' 
  },
];

const defaultPermissions: RolePermissions = {
  projects: { create: false, read: true, update: false, delete: false },
  testPlans: { create: false, read: true, update: false, delete: false },
  testCases: { create: false, read: true, update: false, delete: false },
  testRuns: { create: false, read: true, update: false, delete: false },
  milestones: { create: false, read: true, update: false, delete: false },
  bugs: { create: false, read: true, update: false, delete: false },
  settings_manageProjects: { create: false, read: false, update: false, delete: false },
  settings_manageUsersRoles: { create: false, read: false, update: false, delete: false },
  settings_manageCustomizations: { create: false, read: false, update: false, delete: false },
  settings_manageIntegrations: { create: false, read: false, update: false, delete: false },
  settings_manageDataManagement: { create: false, read: false, update: false, delete: false },
  settings_manageSiteSettings: { create: false, read: false, update: false, delete: false },
};

const adminPermissions: RolePermissions = {
  projects: { create: true, read: true, update: true, delete: true },
  testPlans: { create: true, read: true, update: true, delete: true },
  testCases: { create: true, read: true, update: true, delete: true },
  testRuns: { create: true, read: true, update: true, delete: true },
  milestones: { create: true, read: true, update: true, delete: true },
  bugs: { create: true, read: true, update: true, delete: true },
  settings_manageProjects: { create: true, read: true, update: true, delete: true },
  settings_manageUsersRoles: { create: true, read: true, update: true, delete: true },
  settings_manageCustomizations: { create: true, read: true, update: true, delete: true },
  settings_manageIntegrations: { create: true, read: true, update: true, delete: true },
  settings_manageDataManagement: { create: true, read: true, update: true, delete: true },
  settings_manageSiteSettings: { create: true, read: true, update: true, delete: true },
};

const initialRoles: Role[] = [
  { id: 'role-1', name: 'Admin', description: 'Full access to all projects and settings.', users: 2, permissions: adminPermissions },
  { id: 'role-2', name: 'Lead', description: 'Can manage projects and users within their groups.', users: 5, permissions: { ...defaultPermissions, projects: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-3', name: 'Developer', description: 'Can execute tests and manage defects.', users: 10, permissions: { ...defaultPermissions, bugs: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-4', name: 'Tester', description: 'Can execute tests and report defects.', users: 15, permissions: { ...defaultPermissions, testRuns: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-5', name: 'Guest', description: 'Read-only access to assigned projects.', users: 3, permissions: defaultPermissions },
];

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@example.com', avatar: 'https://picsum.photos/seed/admin/100/100', role: 'Lead', status: 'Active', groups: 2, projects: 3, lastActive: '2 hours ago' },
  { id: 'usr-2', name: 'Alice Johnson', email: 'alice.j@example.com', avatar: 'https://picsum.photos/seed/alice/100/100', role: 'Tester', status: 'Active', groups: 1, projects: 3, lastActive: '5 hours ago' },
  { id: 'usr-3', name: 'Bob Williams', email: 'bob.w@example.com', avatar: 'https://picsum.photos/seed/bob/100/100', role: 'Developer', status: 'Active', groups: 1, projects: 2, lastActive: '1 day ago' },
];

const initialGroups: Group[] = [
  { id: 'grp-1', name: 'Frontend Team', description: 'QA engineers focusing on frontend testing.', users: 5, projects: 2 },
  { id: 'grp-2', name: 'Backend Team', description: 'QA engineers focusing on API and backend testing.', users: 4, projects: 3 },
  { id: 'grp-3', name: 'Mobile Team', description: 'QA engineers focusing on iOS and Android apps.', users: 6, projects: 4 },
];

const initialMilestones: Milestone[] = [
  { id: 'ms-1', projectId: 'PRJ-1', name: 'Q1 Release', description: 'First quarter release focusing on core features.', startDate: '2024-01-01', endDate: '2024-03-31', status: 'Completed' },
  { id: 'ms-2', projectId: 'PRJ-1', name: 'Q2 Release', description: 'Second quarter release focusing on performance.', startDate: '2024-04-01', endDate: '2024-06-30', status: 'Open' },
];

const initialTestRuns: TestRun[] = [
  { id: 'tr-1', projectId: 'PRJ-1', name: 'Sprint 1 Regression', description: 'Regression tests for sprint 1', milestoneId: 'ms-1', includeAllCases: true, status: 'Completed', stats: { passed: 40, failed: 5, untested: 0, total: 45 } },
  { id: 'tr-2', projectId: 'PRJ-1', name: 'Sprint 2 New Features', description: 'Testing new features for sprint 2', milestoneId: 'ms-2', includeAllCases: false, specificCaseIds: ['tc-1', 'tc-2'], status: 'In Progress', stats: { passed: 10, failed: 2, untested: 8, total: 20 } },
];

const initialTestPlans: TestPlan[] = [
  { id: 'tp-1', projectId: 'PRJ-1', name: 'Q1 Master Test Plan', description: 'Master plan for Q1 release', milestoneId: 'ms-1', testRunIds: ['tr-1'], status: 'Completed' },
  { id: 'tp-2', projectId: 'PRJ-1', name: 'Q2 Master Test Plan', description: 'Master plan for Q2 release', milestoneId: 'ms-2', testRunIds: ['tr-2'], status: 'In Progress' },
];

const initialTestCases: TestCase[] = [
  { id: 'NOBI-1', projectId: 'PRJ-1', title: 'Redirect to Login Page when not authenticated', type: 'Functional', priority: 'Critical', status: 'Untested', reviewStatus: 'Approved', assignee: 'Admin User', directory: 'dir-1' },
  { id: 'NOBI-2', projectId: 'PRJ-1', title: 'Redirect to Register Page from Login', type: 'Functional', priority: 'High', status: 'Untested', reviewStatus: 'Approved', assignee: 'Admin User', directory: 'dir-1' },
  { id: 'NOBI-3', projectId: 'PRJ-1', title: 'Redirect to Forgot Password Page from Login', type: 'Functional', priority: 'High', status: 'Untested', reviewStatus: 'Approved', assignee: 'Admin User', directory: 'dir-1' },
  { id: 'NOBI-4', projectId: 'PRJ-1', title: 'login Test #1', type: 'Functional', priority: 'Critical', status: 'Untested', reviewStatus: 'Draft', assignee: 'Admin User', directory: 'dir-5' },
  { id: 'NOBI-5', projectId: 'PRJ-1', title: 'login Test #2', type: 'Functional', priority: 'High', status: 'Untested', reviewStatus: 'In Review', assignee: 'Admin User', directory: 'dir-5' },
  { id: 'NOBI-6', projectId: 'PRJ-1', title: 'login Test #3', type: 'Functional', priority: 'Medium', status: 'Untested', reviewStatus: 'Approved', assignee: 'Admin User', directory: 'dir-5' },
  { id: 'NOBI-7', projectId: 'PRJ-1', title: 'login Test #4', type: 'Functional', priority: 'Low', status: 'Untested', reviewStatus: 'Need Update', assignee: 'Admin User', directory: 'dir-5' },
  { id: 'NOBI-8', projectId: 'PRJ-1', title: 'login Test #5', type: 'Functional', priority: 'Critical', status: 'Untested', reviewStatus: 'Draft', assignee: 'Admin User', directory: 'dir-5' },
  { id: 'NOBI-9', projectId: 'PRJ-1', title: 'login Test #6', type: 'Functional', priority: 'High', status: 'Untested', reviewStatus: 'In Review', assignee: 'Admin User', directory: 'dir-5' },
  { id: 'NOBI-10', projectId: 'PRJ-1', title: 'login Test #7', type: 'Functional', priority: 'Medium', status: 'Untested', reviewStatus: 'Approved', assignee: 'Admin User', directory: 'dir-5' },
];

const initialDefects: Defect[] = [
  { id: 'DEF-1', projectId: 'PRJ-1', title: 'Login fails with special characters in password', description: 'When using @ or # in password, login fails even if correct.', status: 'Open', severity: 'High', assigneeId: 'u1', testRunId: 'tr-1', testCaseId: 'NDK-2' },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get data from localStorage or initialize it
const getStoredData = <T>(key: string, initialData: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

// Helper to set data to localStorage
const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock API Service
export const mockApi = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    await delay(500);
    return getStoredData('mock_projects', initialProjects);
  },
  addProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    await delay(500);
    const projects = getStoredData('mock_projects', initialProjects);
    const newProject: Project = {
      ...project,
      id: `PRJ-${projects.length + 1}`,
    };
    setStoredData('mock_projects', [...projects, newProject]);
    return newProject;
  },
  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
    await delay(500);
    const projects = getStoredData('mock_projects', initialProjects);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updatedProject = { ...projects[index], ...project };
    projects[index] = updatedProject;
    setStoredData('mock_projects', projects);
    return updatedProject;
  },
  deleteProject: async (id: string): Promise<void> => {
    await delay(500);
    const projects = getStoredData('mock_projects', initialProjects);
    setStoredData('mock_projects', projects.filter(p => p.id !== id));
  },

  // Case Fields
  getCaseFields: async (): Promise<CaseField[]> => {
    await delay(500);
    return getStoredData('mock_caseFields', initialCaseFields);
  },
  addCaseField: async (field: Omit<CaseField, 'id'>): Promise<CaseField> => {
    await delay(500);
    const fields = getStoredData('mock_caseFields', initialCaseFields);
    const newField: CaseField = { ...field, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_caseFields', [...fields, newField]);
    return newField;
  },
  updateCaseField: async (id: string, field: Partial<CaseField>): Promise<CaseField> => {
    await delay(500);
    const fields = getStoredData('mock_caseFields', initialCaseFields);
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Case Field not found');
    const updatedField = { ...fields[index], ...field };
    fields[index] = updatedField;
    setStoredData('mock_caseFields', fields);
    return updatedField;
  },
  deleteCaseField: async (id: string): Promise<void> => {
    await delay(500);
    const fields = getStoredData('mock_caseFields', initialCaseFields);
    setStoredData('mock_caseFields', fields.filter(f => f.id !== id));
  },

  // Test Step Templates
  getTestStepTemplates: async (): Promise<TestStepTemplate[]> => {
    await delay(500);
    return getStoredData('mock_testStepTemplates', initialTestStepTemplates);
  },
  addTestStepTemplate: async (template: Omit<TestStepTemplate, 'id'>): Promise<TestStepTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testStepTemplates', initialTestStepTemplates);
    const newTemplate: TestStepTemplate = { ...template, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_testStepTemplates', [...templates, newTemplate]);
    return newTemplate;
  },
  updateTestStepTemplate: async (id: string, template: Partial<TestStepTemplate>): Promise<TestStepTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testStepTemplates', initialTestStepTemplates);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Test Step Template not found');
    const updatedTemplate = { ...templates[index], ...template };
    templates[index] = updatedTemplate;
    setStoredData('mock_testStepTemplates', templates);
    return updatedTemplate;
  },
  deleteTestStepTemplate: async (id: string): Promise<void> => {
    await delay(500);
    const templates = getStoredData('mock_testStepTemplates', initialTestStepTemplates);
    setStoredData('mock_testStepTemplates', templates.filter(t => t.id !== id));
  },

  // Test Case Templates
  getTestCaseTemplates: async (): Promise<TestCaseTemplate[]> => {
    await delay(500);
    return getStoredData('mock_testCaseTemplates', initialTestCaseTemplates);
  },
  addTestCaseTemplate: async (template: Omit<TestCaseTemplate, 'id'>): Promise<TestCaseTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testCaseTemplates', initialTestCaseTemplates);
    const newTemplate: TestCaseTemplate = { ...template, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_testCaseTemplates', [...templates, newTemplate]);
    return newTemplate;
  },
  updateTestCaseTemplate: async (id: string, template: Partial<TestCaseTemplate>): Promise<TestCaseTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testCaseTemplates', initialTestCaseTemplates);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Test Case Template not found');
    const updatedTemplate = { ...templates[index], ...template };
    templates[index] = updatedTemplate;
    setStoredData('mock_testCaseTemplates', templates);
    return updatedTemplate;
  },
  deleteTestCaseTemplate: async (id: string): Promise<void> => {
    await delay(500);
    const templates = getStoredData('mock_testCaseTemplates', initialTestCaseTemplates);
    setStoredData('mock_testCaseTemplates', templates.filter(t => t.id !== id));
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    await delay(500);
    return getStoredData('mock_roles', initialRoles);
  },
  addRole: async (role: Omit<Role, 'id'>): Promise<Role> => {
    await delay(500);
    const roles = getStoredData('mock_roles', initialRoles);
    const newRole: Role = { ...role, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_roles', [...roles, newRole]);
    return newRole;
  },
  updateRole: async (id: string, role: Partial<Role>): Promise<Role> => {
    await delay(500);
    const roles = getStoredData('mock_roles', initialRoles);
    const index = roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    const updatedRole = { ...roles[index], ...role };
    roles[index] = updatedRole;
    setStoredData('mock_roles', roles);
    return updatedRole;
  },
  deleteRole: async (id: string): Promise<void> => {
    await delay(500);
    const roles = getStoredData('mock_roles', initialRoles);
    setStoredData('mock_roles', roles.filter(r => r.id !== id));
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return getStoredData('mock_users', initialUsers);
  },
  addUser: async (user: Omit<User, 'id' | 'lastActive'>): Promise<User> => {
    await delay(500);
    const users = getStoredData('mock_users', initialUsers);
    const newUser: User = { ...user, id: Math.random().toString(36).substring(2, 9), lastActive: 'Just now' };
    setStoredData('mock_users', [...users, newUser]);
    return newUser;
  },
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    await delay(500);
    const users = getStoredData('mock_users', initialUsers);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    const updatedUser = { ...users[index], ...user };
    users[index] = updatedUser;
    setStoredData('mock_users', users);
    return updatedUser;
  },
  deleteUser: async (id: string): Promise<void> => {
    await delay(500);
    const users = getStoredData('mock_users', initialUsers);
    setStoredData('mock_users', users.filter(u => u.id !== id));
  },

  // Groups
  getGroups: async (): Promise<Group[]> => {
    await delay(500);
    return getStoredData('mock_groups', initialGroups);
  },
  addGroup: async (group: Omit<Group, 'id'>): Promise<Group> => {
    await delay(500);
    const groups = getStoredData('mock_groups', initialGroups);
    const newGroup: Group = { ...group, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_groups', [...groups, newGroup]);
    return newGroup;
  },
  updateGroup: async (id: string, group: Partial<Group>): Promise<Group> => {
    await delay(500);
    const groups = getStoredData('mock_groups', initialGroups);
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Group not found');
    const updatedGroup = { ...groups[index], ...group };
    groups[index] = updatedGroup;
    setStoredData('mock_groups', groups);
    return updatedGroup;
  },
  deleteGroup: async (id: string): Promise<void> => {
    await delay(500);
    const groups = getStoredData('mock_groups', initialGroups);
    setStoredData('mock_groups', groups.filter(g => g.id !== id));
  },

  // Milestones
  getMilestones: async (projectId: string): Promise<Milestone[]> => {
    await delay(500);
    const milestones = getStoredData('mock_milestones', initialMilestones);
    return milestones.filter(m => m.projectId === projectId);
  },
  addMilestone: async (milestone: Omit<Milestone, 'id'>): Promise<Milestone> => {
    await delay(500);
    const milestones = getStoredData('mock_milestones', initialMilestones);
    const newMilestone: Milestone = { ...milestone, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_milestones', [...milestones, newMilestone]);
    return newMilestone;
  },
  updateMilestone: async (id: string, milestone: Partial<Milestone>): Promise<Milestone> => {
    await delay(500);
    const milestones = getStoredData('mock_milestones', initialMilestones);
    const index = milestones.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Milestone not found');
    const updatedMilestone = { ...milestones[index], ...milestone };
    milestones[index] = updatedMilestone;
    setStoredData('mock_milestones', milestones);
    return updatedMilestone;
  },
  deleteMilestone: async (id: string): Promise<void> => {
    await delay(500);
    const milestones = getStoredData('mock_milestones', initialMilestones);
    setStoredData('mock_milestones', milestones.filter(m => m.id !== id));
  },

  // Test Runs
  getTestRuns: async (projectId: string): Promise<TestRun[]> => {
    await delay(500);
    const runs = getStoredData('mock_testRuns', initialTestRuns);
    return runs.filter(r => r.projectId === projectId);
  },
  addTestRun: async (run: Omit<TestRun, 'id' | 'stats'>): Promise<TestRun> => {
    await delay(500);
    const runs = getStoredData('mock_testRuns', initialTestRuns);
    const newRun: TestRun = { 
      ...run, 
      id: Math.random().toString(36).substring(2, 9),
      stats: { passed: 0, failed: 0, untested: 0, total: 0 } // Mock stats
    };
    setStoredData('mock_testRuns', [...runs, newRun]);
    return newRun;
  },
  updateTestRun: async (id: string, run: Partial<TestRun>): Promise<TestRun> => {
    await delay(500);
    const runs = getStoredData('mock_testRuns', initialTestRuns);
    const index = runs.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Test Run not found');
    const updatedRun = { ...runs[index], ...run };
    runs[index] = updatedRun;
    setStoredData('mock_testRuns', runs);
    return updatedRun;
  },
  deleteTestRun: async (id: string): Promise<void> => {
    await delay(500);
    const runs = getStoredData('mock_testRuns', initialTestRuns);
    setStoredData('mock_testRuns', runs.filter(r => r.id !== id));
  },

  // Test Plans
  getTestPlans: async (projectId: string): Promise<TestPlan[]> => {
    await delay(500);
    const plans = getStoredData('mock_testPlans', initialTestPlans);
    return plans.filter(p => p.projectId === projectId);
  },
  addTestPlan: async (plan: Omit<TestPlan, 'id'>): Promise<TestPlan> => {
    await delay(500);
    const plans = getStoredData('mock_testPlans', initialTestPlans);
    const newPlan: TestPlan = { ...plan, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_testPlans', [...plans, newPlan]);
    return newPlan;
  },
  updateTestPlan: async (id: string, plan: Partial<TestPlan>): Promise<TestPlan> => {
    await delay(500);
    const plans = getStoredData('mock_testPlans', initialTestPlans);
    const index = plans.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Test Plan not found');
    const updatedPlan = { ...plans[index], ...plan };
    plans[index] = updatedPlan;
    setStoredData('mock_testPlans', plans);
    return updatedPlan;
  },
  deleteTestPlan: async (id: string): Promise<void> => {
    await delay(500);
    const plans = getStoredData('mock_testPlans', initialTestPlans);
    setStoredData('mock_testPlans', plans.filter(p => p.id !== id));
  },

  // Test Cases
  getTestCases: async (projectId: string): Promise<TestCase[]> => {
    await delay(500);
    const cases = getStoredData('mock_testCases', initialTestCases);
    return cases.filter(c => c.projectId === projectId);
  },
  addTestCase: async (testCase: Omit<TestCase, 'id'>): Promise<TestCase> => {
    await delay(500);
    const cases = getStoredData('mock_testCases', initialTestCases);
    const projects = getStoredData('mock_projects', []);
    const project = projects.find(p => p.id === testCase.projectId);
    const key = project?.key || 'TC';
    
    // Find the highest number for this project key
    const projectCases = cases.filter(c => c.id.startsWith(`${key}-`));
    let maxNum = 0;
    projectCases.forEach(c => {
      const num = parseInt(c.id.replace(`${key}-`, ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    
    const newCase: TestCase = { ...testCase, id: `${key}-${maxNum + 1}` };
    setStoredData('mock_testCases', [...cases, newCase]);
    return newCase;
  },
  updateTestCase: async (id: string, testCase: Partial<TestCase>): Promise<TestCase> => {
    await delay(500);
    const cases = getStoredData('mock_testCases', initialTestCases);
    const index = cases.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Test Case not found');
    const updatedCase = { ...cases[index], ...testCase };
    cases[index] = updatedCase;
    setStoredData('mock_testCases', cases);
    return updatedCase;
  },
  deleteTestCase: async (id: string): Promise<void> => {
    await delay(500);
    const cases = getStoredData('mock_testCases', initialTestCases);
    setStoredData('mock_testCases', cases.filter(c => c.id !== id));
  },

  // Defects
  getDefects: async (projectId: string): Promise<Defect[]> => {
    await delay(500);
    const defects = getStoredData('mock_defects', initialDefects);
    return defects.filter(d => d.projectId === projectId);
  },
  addDefect: async (defect: Omit<Defect, 'id'>): Promise<Defect> => {
    await delay(500);
    const defects = getStoredData('mock_defects', initialDefects);
    const newId = `DEF-${Date.now().toString().slice(-4)}`;
    const newDefect = { ...defect, id: newId };
    setStoredData('mock_defects', [...defects, newDefect]);
    return newDefect;
  },
  updateDefect: async (id: string, defect: Partial<Defect>): Promise<Defect> => {
    await delay(500);
    const defects = getStoredData('mock_defects', initialDefects);
    const index = defects.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Defect not found');
    const updatedDefect = { ...defects[index], ...defect };
    defects[index] = updatedDefect;
    setStoredData('mock_defects', defects);
    return updatedDefect;
  },
  deleteDefect: async (id: string): Promise<void> => {
    await delay(500);
    const defects = getStoredData('mock_defects', initialDefects);
    setStoredData('mock_defects', defects.filter(d => d.id !== id));
  },
};
