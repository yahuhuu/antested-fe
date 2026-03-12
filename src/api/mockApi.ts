import { Project } from '@/features/projects/store/useProjectStore';
import { Milestone } from '@/features/projects/store/useMilestoneStore';
import { TestCase } from '@/features/projects/store/useTestCaseStore';
import { Defect } from '@/features/projects/store/useDefectStore';
import { TestRun, TestPlan } from '@/features/test-runs/store/useTestExecutionStore';
import { CaseField, TestStepTemplate, TestCaseTemplate } from '@/features/settings/customizations/store/useCustomizationStore';
import { Role, RolePermissions } from '@/features/settings/users/store/useRoleStore';
import { User } from '@/features/settings/users/store/useUserStore';
import { Group } from '@/features/settings/users/store/useGroupStore';
import { Directory } from '@/features/projects/store/useDirectoryStore';
import generatedData from './generated_data.json';

const initialProjects: Project[] = generatedData.projects;
const initialTestCases: TestCase[] = generatedData.testCases as TestCase[];
const initialDirectories: Directory[] = generatedData.directories;

const initialCaseFields: CaseField[] = [
  { id: 'cf1', name: 'Test Case Type (Required)', description: '', type: 'Dropdown', testCaseTemplate: ['1'], required: true, options: ['Functional', 'Performance', 'Security', 'Usability'] },
  { id: 'cf2', name: 'Test Case Type (Not Required)', description: '', type: 'Dropdown', testCaseTemplate: ['2'], required: false, options: ['Functional', 'Performance', 'Security', 'Usability'] },
  { id: 'cf3', name: 'Test Suite Type (Required)', description: '', type: 'Dropdown', testCaseTemplate: ['1'], required: true, options: ['smoke', 'sanity', 'regression', 'integration', 'end-to-end (E2E)', 'User Acceptance Testing (UAT)', 'Sistem Integration Testing (SIT)'] },
  { id: 'cf4', name: 'Test Suite Type (Not Required)', description: '', type: 'Dropdown', testCaseTemplate: ['2'], required: false, options: ['smoke', 'sanity', 'regression', 'integration', 'end-to-end (E2E)', 'User Acceptance Testing (UAT)', 'Sistem Integration Testing (SIT)'] },
  { id: 'cf5', name: 'Priority (Required)', description: '', type: 'Dropdown', testCaseTemplate: ['1'], required: true, options: ['critical', 'high', 'medium', 'low'] },
  { id: 'cf6', name: 'Priority (Not Required)', description: '', type: 'Dropdown', testCaseTemplate: ['2'], required: false, options: ['critical', 'high', 'medium', 'low'] },
  { id: 'cf7', name: 'Assign To User (Required)', description: '', type: 'User', testCaseTemplate: ['1'], required: true },
  { id: 'cf8', name: 'Assign To User (Not Required)', description: '', type: 'User', testCaseTemplate: ['2'], required: false },
  { id: 'cf9', name: 'Assign To Group (Required)', description: '', type: 'Group', testCaseTemplate: ['1'], required: true },
  { id: 'cf10', name: 'Assign To Group (Not Required)', description: '', type: 'Group', testCaseTemplate: ['2'], required: false },
  { id: 'cf11', name: 'Pre-conditions (Required)', description: '', type: 'Text', testCaseTemplate: ['1'], required: true },
  { id: 'cf12', name: 'Pre-conditions (Not Required)', description: '', type: 'Text', testCaseTemplate: ['2'], required: false },
  { id: 'cf13', name: 'Is Automated (Not Required)', description: '', type: 'Checkbox', testCaseTemplate: ['1', '2'], required: false },
  { id: 'cf14', name: 'Browser (Required)', description: '', type: 'Dropdown', testCaseTemplate: ['1'], required: true, options: ['chrome', 'mozila', 'safari', 'Microsoft edge'] },
  { id: 'cf15', name: 'Browser (Not Required)', description: '', type: 'Dropdown', testCaseTemplate: ['2'], required: false, options: ['chrome', 'mozila', 'safari', 'Microsoft edge'] },
];

const initialTestStepTemplates: TestStepTemplate[] = [
  { 
    id: '1', 
    name: 'Test Step (Single Steps)', 
    description: 'A simple template with one area for steps and one for expected results.', 
    testCaseTemplate: ['1'],
    fields: [
      { id: 'f1', name: 'Steps', type: 'Text Area' },
      { id: 'f2', name: 'Expected Result', type: 'Text Area' }
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
          { id: 'sf1', name: 'Test Step', type: 'Text Area' },
          { id: 'sf2', name: 'Expected Result', type: 'Text Area' }
        ]
      }
    ]
  },
  { 
    id: '3', 
    name: 'Test Step (Multiple Steps With Test Data)', 
    description: 'A template for test cases with multiple steps and test data.', 
    testCaseTemplate: ['1'],
    fields: [
      { 
        id: 'f4', 
        name: 'Steps', 
        type: 'Repeater',
        subFields: [
          { id: 'sf3', name: 'Test Step', type: 'Text Area' },
          { id: 'sf4', name: 'Test Data', type: 'Text Area' },
          { id: 'sf5', name: 'Expected Result', type: 'Text Area' }
        ]
      }
    ]
  },
  { 
    id: '4', 
    name: 'Behaviour Driven Development', 
    description: 'A template for BDD scenarios.', 
    testCaseTemplate: ['1'],
    fields: [
      { id: 'f5', name: 'Scenario Description', type: 'Text Area' }
    ]
  },
  { 
    id: '5', 
    name: 'Exploratory Sessions', 
    description: 'A template for exploratory testing sessions.', 
    testCaseTemplate: ['1'],
    fields: [
      { id: 'f6', name: 'Missions', type: 'Text Area' },
      { id: 'f7', name: 'Goals', type: 'Text Area' }
    ]
  },
];

const initialTestCaseTemplates: TestCaseTemplate[] = [
  { 
    id: '1', 
    name: 'Behaviour Driven Development', 
    description: 'Template for BDD scenarios', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: 'cf1', width: 3, section: 3, column: 1}, 
      {id: 'cf3', width: 3, section: 3, column: 2}, 
      {id: 'cf15', width: 3, section: 3, column: 3}, 
      {id: 'cf5', width: 3, section: 3, column: 4}
    ], 
    testStepTemplateMode: 'strict',
    testStepTemplateId: '4'
  },
  { 
    id: '2', 
    name: 'Test Step (Single Steps)', 
    description: 'Template for single step test cases', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: 'cf11', width: 12, section: 3, column: 1}, 
      {id: 'cf1', width: 3, section: 4, column: 1}, 
      {id: 'cf3', width: 3, section: 4, column: 2}, 
      {id: 'cf15', width: 3, section: 4, column: 3}, 
      {id: 'cf5', width: 3, section: 4, column: 4},
      {id: 'cf8', width: 6, section: 5, column: 1},
      {id: 'cf10', width: 6, section: 5, column: 2}
    ], 
    testStepTemplateMode: 'strict', 
    testStepTemplateId: '1' 
  },
  { 
    id: '3', 
    name: 'Test Step (Multiple Steps)', 
    description: 'Template for multiple steps test cases', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: 'cf11', width: 12, section: 3, column: 1}, 
      {id: 'cf1', width: 3, section: 4, column: 1}, 
      {id: 'cf3', width: 3, section: 4, column: 2}, 
      {id: 'cf15', width: 3, section: 4, column: 3}, 
      {id: 'cf5', width: 3, section: 4, column: 4},
      {id: 'cf7', width: 4, section: 5, column: 1},
      {id: 'cf10', width: 4, section: 5, column: 2},
      {id: 'cf14', width: 4, section: 5, column: 3}
    ], 
    testStepTemplateMode: 'strict', 
    testStepTemplateId: '2' 
  },
  { 
    id: '4', 
    name: 'Test Step (Multiple Steps With Test Data)', 
    description: 'Template for multiple steps with test data', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: 'cf11', width: 12, section: 3, column: 1}, 
      {id: 'cf1', width: 3, section: 4, column: 1}, 
      {id: 'cf3', width: 3, section: 4, column: 2}, 
      {id: 'cf15', width: 3, section: 4, column: 3}, 
      {id: 'cf5', width: 3, section: 4, column: 4},
      {id: 'cf7', width: 4, section: 5, column: 1},
      {id: 'cf10', width: 4, section: 5, column: 2},
      {id: 'cf14', width: 4, section: 5, column: 3}
    ], 
    testStepTemplateMode: 'strict', 
    testStepTemplateId: '3' 
  },
  { 
    id: '5', 
    name: 'Exploratory Sessions', 
    description: 'Template for exploratory sessions', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: 'cf12', width: 12, section: 3, column: 1}, 
      {id: 'cf2', width: 3, section: 4, column: 1}, 
      {id: 'cf4', width: 3, section: 4, column: 2}, 
      {id: 'cf15', width: 3, section: 4, column: 3}, 
      {id: 'cf5', width: 6, section: 5, column: 1},
      {id: 'cf14', width: 6, section: 5, column: 2}
    ], 
    testStepTemplateMode: 'strict', 
    testStepTemplateId: '3' 
  },
  { 
    id: '6', 
    name: 'Dynamic Template', 
    description: 'Template with dynamic test steps', 
    fields: [
      {id: 'title', width: 12, section: 1, column: 1}, 
      {id: 'directory', width: 12, section: 2, column: 1}, 
      {id: 'cf12', width: 12, section: 3, column: 1}, 
      {id: 'cf2', width: 3, section: 4, column: 1}, 
      {id: 'cf4', width: 3, section: 4, column: 2}, 
      {id: 'cf15', width: 3, section: 4, column: 3}, 
      {id: 'cf6', width: 3, section: 4, column: 4},
      {id: 'cf8', width: 4, section: 5, column: 1},
      {id: 'cf10', width: 4, section: 5, column: 2},
      {id: 'cf15', width: 4, section: 5, column: 3}
    ], 
    testStepTemplateMode: 'dynamic'
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
  { id: 'role-1', name: 'Admin', description: 'Full access to all projects and settings.', userIds: ['usr-1'], permissions: adminPermissions },
  { id: 'role-2', name: 'Lead', description: 'Can manage projects and users within their groups.', userIds: ['usr-4', 'usr-9', 'usr-16'], permissions: { ...defaultPermissions, projects: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-3', name: 'Developer', description: 'Can execute tests and manage defects.', userIds: ['usr-3', 'usr-6', 'usr-10', 'usr-12', 'usr-15', 'usr-18'], permissions: { ...defaultPermissions, bugs: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-4', name: 'Tester', description: 'Can execute tests and report defects.', userIds: ['usr-2', 'usr-5', 'usr-8', 'usr-11', 'usr-13', 'usr-17', 'usr-19'], permissions: { ...defaultPermissions, testRuns: { create: true, read: true, update: true, delete: false } } },
  { id: 'role-5', name: 'Guest', description: 'Read-only access to assigned projects.', userIds: ['usr-7', 'usr-14', 'usr-20'], permissions: defaultPermissions },
];

const initialUsers: User[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@example.com', avatar: 'https://picsum.photos/seed/admin/100/100', roleId: 'role-1', status: 'Active', groupIds: ['grp-1', 'grp-2'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3'], lastActive: '2 hours ago' },
  { id: 'usr-2', name: 'Alice Johnson', email: 'alice.j@example.com', avatar: 'https://picsum.photos/seed/alice/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-1'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3'], lastActive: '5 hours ago' },
  { id: 'usr-3', name: 'Bob Williams', email: 'bob.w@example.com', avatar: 'https://picsum.photos/seed/bob/100/100', roleId: 'role-3', status: 'Active', groupIds: ['grp-2'], projectIds: ['PRJ-1', 'PRJ-2'], lastActive: '1 day ago' },
  { id: 'usr-4', name: 'Charlie Brown', email: 'charlie.b@example.com', avatar: 'https://picsum.photos/seed/charlie/100/100', roleId: 'role-2', status: 'Inactive', groupIds: [], projectIds: ['PRJ-1'], lastActive: '2 weeks ago' },
  { id: 'usr-5', name: 'David Smith', email: 'david.s@example.com', avatar: 'https://picsum.photos/seed/david/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-3', 'grp-4'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3', 'PRJ-4'], lastActive: '10 mins ago' },
  { id: 'usr-6', name: 'Eve Davis', email: 'eve.d@example.com', avatar: 'https://picsum.photos/seed/eve/100/100', roleId: 'role-3', status: 'Active', groupIds: ['grp-1'], projectIds: ['PRJ-1', 'PRJ-2'], lastActive: '3 hours ago' },
  { id: 'usr-7', name: 'Frank Miller', email: 'frank.m@example.com', avatar: 'https://picsum.photos/seed/frank/100/100', roleId: 'role-5', status: 'Active', groupIds: [], projectIds: ['PRJ-1'], lastActive: '1 month ago' },
  { id: 'usr-8', name: 'Grace Wilson', email: 'grace.w@example.com', avatar: 'https://picsum.photos/seed/grace/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-2'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3'], lastActive: '1 hour ago' },
  { id: 'usr-9', name: 'Heidi Moore', email: 'heidi.m@example.com', avatar: 'https://picsum.photos/seed/heidi/100/100', roleId: 'role-2', status: 'Active', groupIds: ['grp-1', 'grp-3', 'grp-5'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3', 'PRJ-4', 'PRJ-5'], lastActive: 'Just now' },
  { id: 'usr-10', name: 'Ivan Taylor', email: 'ivan.t@example.com', avatar: 'https://picsum.photos/seed/ivan/100/100', roleId: 'role-3', status: 'Inactive', groupIds: [], projectIds: [], lastActive: '3 months ago' },
  { id: 'usr-11', name: 'Judy Anderson', email: 'judy.a@example.com', avatar: 'https://picsum.photos/seed/judy/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-4'], projectIds: ['PRJ-1', 'PRJ-2'], lastActive: '4 hours ago' },
  { id: 'usr-12', name: 'Kevin Thomas', email: 'kevin.t@example.com', avatar: 'https://picsum.photos/seed/kevin/100/100', roleId: 'role-3', status: 'Active', groupIds: ['grp-2', 'grp-5'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3'], lastActive: '2 days ago' },
  { id: 'usr-13', name: 'Laura Jackson', email: 'laura.j@example.com', avatar: 'https://picsum.photos/seed/laura/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-3'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3', 'PRJ-4'], lastActive: '15 mins ago' },
  { id: 'usr-14', name: 'Mike White', email: 'mike.w@example.com', avatar: 'https://picsum.photos/seed/mike/100/100', roleId: 'role-5', status: 'Active', groupIds: [], projectIds: ['PRJ-1'], lastActive: '1 week ago' },
  { id: 'usr-15', name: 'Nina Harris', email: 'nina.h@example.com', avatar: 'https://picsum.photos/seed/nina/100/100', roleId: 'role-3', status: 'Active', groupIds: ['grp-4'], projectIds: ['PRJ-1', 'PRJ-2'], lastActive: '6 hours ago' },
  { id: 'usr-16', name: 'Oscar Martin', email: 'oscar.m@example.com', avatar: 'https://picsum.photos/seed/oscar/100/100', roleId: 'role-2', status: 'Active', groupIds: ['grp-1', 'grp-2'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3', 'PRJ-4'], lastActive: '1 hour ago' },
  { id: 'usr-17', name: 'Peggy Thompson', email: 'peggy.t@example.com', avatar: 'https://picsum.photos/seed/peggy/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-3'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3'], lastActive: '30 mins ago' },
  { id: 'usr-18', name: 'Quinn Garcia', email: 'quinn.g@example.com', avatar: 'https://picsum.photos/seed/quinn/100/100', roleId: 'role-3', status: 'Inactive', groupIds: [], projectIds: ['PRJ-1'], lastActive: '2 months ago' },
  { id: 'usr-19', name: 'Romeo Martinez', email: 'romeo.m@example.com', avatar: 'https://picsum.photos/seed/romeo/100/100', roleId: 'role-4', status: 'Active', groupIds: ['grp-4'], projectIds: ['PRJ-1', 'PRJ-2'], lastActive: '5 days ago' },
  { id: 'usr-20', name: 'Sybil Robinson', email: 'sybil.r@example.com', avatar: 'https://picsum.photos/seed/sybil/100/100', roleId: 'role-5', status: 'Active', groupIds: ['grp-5'], projectIds: ['PRJ-1'], lastActive: '1 day ago' },
];

const initialGroups: Group[] = [
  { id: 'grp-1', name: 'Frontend Team', description: 'QA engineers focusing on frontend testing.', userIds: ['usr-1', 'usr-2', 'usr-6', 'usr-9', 'usr-16'], projectIds: ['PRJ-1', 'PRJ-2'] },
  { id: 'grp-2', name: 'Backend Team', description: 'QA engineers focusing on API and backend testing.', userIds: ['usr-1', 'usr-3', 'usr-8', 'usr-12', 'usr-16'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3'] },
  { id: 'grp-3', name: 'Mobile Team', description: 'QA engineers focusing on iOS and Android apps.', userIds: ['usr-5', 'usr-9', 'usr-13', 'usr-17'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3', 'PRJ-4'] },
  { id: 'grp-4', name: 'QA Automation', description: 'Engineers building and maintaining automated test suites.', userIds: ['usr-5', 'usr-11', 'usr-15', 'usr-19'], projectIds: ['PRJ-1', 'PRJ-2', 'PRJ-3', 'PRJ-4', 'PRJ-5'] },
  { id: 'grp-5', name: 'Security Team', description: 'Specialists focusing on penetration testing and security audits.', userIds: ['usr-9', 'usr-12', 'usr-20'], projectIds: ['PRJ-1', 'PRJ-2'] },
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

const initialDefects: Defect[] = [
  { id: 'DEF-1', projectId: 'PRJ-1', title: 'Login fails with special characters in password', description: 'When using @ or # in password, login fails even if correct.', status: 'Open', severity: 'High', assigneeId: 'u1', testRunId: 'tr-1', testCaseId: 'NDK-2' },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get data from localStorage or initialize it
const getStoredData = <T>(key: string, initialData: T): T => {
  const versionedKey = `${key}_v2`;
  const stored = localStorage.getItem(versionedKey);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(versionedKey, JSON.stringify(initialData));
  return initialData;
};

// Helper to set data to localStorage
const setStoredData = <T>(key: string, data: T): void => {
  const versionedKey = `${key}_v2`;
  localStorage.setItem(versionedKey, JSON.stringify(data));
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
    return getStoredData('mock_caseFields_v2', initialCaseFields);
  },
  addCaseField: async (field: Omit<CaseField, 'id'>): Promise<CaseField> => {
    await delay(500);
    const fields = getStoredData('mock_caseFields_v2', initialCaseFields);
    const newField: CaseField = { ...field, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_caseFields_v2', [...fields, newField]);
    return newField;
  },
  updateCaseField: async (id: string, field: Partial<CaseField>): Promise<CaseField> => {
    await delay(500);
    const fields = getStoredData('mock_caseFields_v2', initialCaseFields);
    const index = fields.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Case Field not found');
    const updatedField = { ...fields[index], ...field };
    fields[index] = updatedField;
    setStoredData('mock_caseFields_v2', fields);
    return updatedField;
  },
  deleteCaseField: async (id: string): Promise<void> => {
    await delay(500);
    const fields = getStoredData('mock_caseFields_v2', initialCaseFields);
    setStoredData('mock_caseFields_v2', fields.filter(f => f.id !== id));
  },

  // Test Step Templates
  getTestStepTemplates: async (): Promise<TestStepTemplate[]> => {
    await delay(500);
    return getStoredData('mock_testStepTemplates_v2', initialTestStepTemplates);
  },
  addTestStepTemplate: async (template: Omit<TestStepTemplate, 'id'>): Promise<TestStepTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testStepTemplates_v2', initialTestStepTemplates);
    const newTemplate: TestStepTemplate = { ...template, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_testStepTemplates_v2', [...templates, newTemplate]);
    return newTemplate;
  },
  updateTestStepTemplate: async (id: string, template: Partial<TestStepTemplate>): Promise<TestStepTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testStepTemplates_v2', initialTestStepTemplates);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Test Step Template not found');
    const updatedTemplate = { ...templates[index], ...template };
    templates[index] = updatedTemplate;
    setStoredData('mock_testStepTemplates_v2', templates);
    return updatedTemplate;
  },
  deleteTestStepTemplate: async (id: string): Promise<void> => {
    await delay(500);
    const templates = getStoredData('mock_testStepTemplates_v2', initialTestStepTemplates);
    setStoredData('mock_testStepTemplates_v2', templates.filter(t => t.id !== id));
  },

  // Test Case Templates
  getTestCaseTemplates: async (): Promise<TestCaseTemplate[]> => {
    await delay(500);
    return getStoredData('mock_testCaseTemplates_v3', initialTestCaseTemplates);
  },
  addTestCaseTemplate: async (template: Omit<TestCaseTemplate, 'id'>): Promise<TestCaseTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testCaseTemplates_v3', initialTestCaseTemplates);
    const newTemplate: TestCaseTemplate = { ...template, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_testCaseTemplates_v3', [...templates, newTemplate]);
    return newTemplate;
  },
  updateTestCaseTemplate: async (id: string, template: Partial<TestCaseTemplate>): Promise<TestCaseTemplate> => {
    await delay(500);
    const templates = getStoredData('mock_testCaseTemplates_v3', initialTestCaseTemplates);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Test Case Template not found');
    const updatedTemplate = { ...templates[index], ...template };
    templates[index] = updatedTemplate;
    setStoredData('mock_testCaseTemplates_v3', templates);
    return updatedTemplate;
  },
  deleteTestCaseTemplate: async (id: string): Promise<void> => {
    await delay(500);
    const templates = getStoredData('mock_testCaseTemplates_v3', initialTestCaseTemplates);
    setStoredData('mock_testCaseTemplates_v3', templates.filter(t => t.id !== id));
  },

  // Roles
  getRoles: async (): Promise<Role[]> => {
    await delay(500);
    return getStoredData('mock_roles_v3', initialRoles);
  },
  addRole: async (role: Omit<Role, 'id'>): Promise<Role> => {
    await delay(500);
    const roles = getStoredData('mock_roles_v3', initialRoles);
    const newRole: Role = { ...role, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_roles_v3', [...roles, newRole]);
    return newRole;
  },
  updateRole: async (id: string, role: Partial<Role>): Promise<Role> => {
    await delay(500);
    const roles = getStoredData('mock_roles_v3', initialRoles);
    const index = roles.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Role not found');
    const updatedRole = { ...roles[index], ...role };
    roles[index] = updatedRole;
    setStoredData('mock_roles_v3', roles);
    return updatedRole;
  },
  deleteRole: async (id: string): Promise<void> => {
    await delay(500);
    const roles = getStoredData('mock_roles_v3', initialRoles);
    setStoredData('mock_roles_v3', roles.filter(r => r.id !== id));
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return getStoredData('mock_users_v3', initialUsers);
  },
  addUser: async (user: Omit<User, 'id' | 'lastActive'>): Promise<User> => {
    await delay(500);
    const users = getStoredData('mock_users_v3', initialUsers);
    const newUser: User = { ...user, id: Math.random().toString(36).substring(2, 9), lastActive: 'Just now' };
    setStoredData('mock_users_v3', [...users, newUser]);
    return newUser;
  },
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    await delay(500);
    const users = getStoredData('mock_users_v3', initialUsers);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    const updatedUser = { ...users[index], ...user };
    users[index] = updatedUser;
    setStoredData('mock_users_v3', users);
    return updatedUser;
  },
  deleteUser: async (id: string): Promise<void> => {
    await delay(500);
    const users = getStoredData('mock_users_v3', initialUsers);
    setStoredData('mock_users_v3', users.filter(u => u.id !== id));
  },

  // Groups
  getGroups: async (): Promise<Group[]> => {
    await delay(500);
    return getStoredData('mock_groups_v3', initialGroups);
  },
  addGroup: async (group: Omit<Group, 'id'>): Promise<Group> => {
    await delay(500);
    const groups = getStoredData('mock_groups_v3', initialGroups);
    const newGroup: Group = { ...group, id: Math.random().toString(36).substring(2, 9) };
    setStoredData('mock_groups_v3', [...groups, newGroup]);
    return newGroup;
  },
  updateGroup: async (id: string, group: Partial<Group>): Promise<Group> => {
    await delay(500);
    const groups = getStoredData('mock_groups_v3', initialGroups);
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Group not found');
    const updatedGroup = { ...groups[index], ...group };
    groups[index] = updatedGroup;
    setStoredData('mock_groups_v3', groups);
    return updatedGroup;
  },
  deleteGroup: async (id: string): Promise<void> => {
    await delay(500);
    const groups = getStoredData('mock_groups_v3', initialGroups);
    setStoredData('mock_groups_v3', groups.filter(g => g.id !== id));
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

  // Directories
  getDirectories: async (projectId: string): Promise<Directory[]> => {
    await delay(500);
    const directories = getStoredData('mock_directories', initialDirectories);
    return directories.filter(d => d.projectId === projectId);
  },
  addDirectory: async (directory: Omit<Directory, 'id'>): Promise<Directory> => {
    await delay(500);
    const directories = getStoredData('mock_directories', initialDirectories);
    const newId = `dir-${Date.now().toString().slice(-4)}`;
    const newDirectory = { ...directory, id: newId };
    setStoredData('mock_directories', [...directories, newDirectory]);
    return newDirectory;
  },
  updateDirectory: async (id: string, directory: Partial<Directory>): Promise<Directory> => {
    await delay(500);
    const directories = getStoredData('mock_directories', initialDirectories);
    const index = directories.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Directory not found');
    const updatedDirectory = { ...directories[index], ...directory };
    directories[index] = updatedDirectory;
    setStoredData('mock_directories', directories);
    return updatedDirectory;
  },
  deleteDirectory: async (id: string): Promise<void> => {
    await delay(500);
    const directories = getStoredData('mock_directories', initialDirectories);
    setStoredData('mock_directories', directories.filter(d => d.id !== id && d.parentId !== id));
  },
};
