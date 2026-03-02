import { create } from 'zustand';

export interface Group {
  id: string;
  name: string;
  description: string;
  users: number;
  projects: number;
}

interface GroupState {
  groups: Group[];
  addGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
}

const mockGroups: Group[] = [
  { id: 'grp-1', name: 'Developers', description: 'Responsible for application development.', users: 5, projects: 3 },
  { id: 'grp-2', name: 'QA Team', description: 'Responsible for quality assurance and testing.', users: 6, projects: 4 },
  { id: 'grp-3', name: 'Project Managers', description: 'Oversee project planning and execution.', users: 2, projects: 5 },
  { id: 'grp-4', name: 'Designers', description: 'UI/UX design team.', users: 3, projects: 2 },
  { id: 'grp-5', name: 'DevOps', description: 'Infrastructure and deployment.', users: 2, projects: 6 },
  { id: 'grp-6', name: 'Marketing', description: 'Marketing and growth team.', users: 4, projects: 1 },
  { id: 'grp-7', name: 'Sales', description: 'Sales and customer acquisition.', users: 5, projects: 1 },
  { id: 'grp-8', name: 'Customer Support', description: 'Frontline customer support.', users: 8, projects: 2 },
  { id: 'grp-9', name: 'HR', description: 'Human resources and recruitment.', users: 2, projects: 0 },
  { id: 'grp-10', name: 'Finance', description: 'Accounting and finance.', users: 3, projects: 1 },
  { id: 'grp-11', name: 'Legal', description: 'Legal and compliance.', users: 2, projects: 1 },
  { id: 'grp-12', name: 'Executive', description: 'C-level executives.', users: 4, projects: 8 },
  { id: 'grp-13', name: 'Contractors', description: 'External contractors and freelancers.', users: 10, projects: 3 },
  { id: 'grp-14', name: 'Interns', description: 'Summer interns.', users: 5, projects: 1 },
  { id: 'grp-15', name: 'Security', description: 'Information security team.', users: 3, projects: 4 },
];

export const useGroupStore = create<GroupState>((set) => ({
  groups: mockGroups,
  addGroup: (group) => set((state) => ({
    groups: [...state.groups, { ...group, id: `grp-${state.groups.length + 1}` }]
  })),
  updateGroup: (id, updatedGroup) => set((state) => ({
    groups: state.groups.map(g => g.id === id ? { ...g, ...updatedGroup } : g)
  })),
  deleteGroup: (id) => set((state) => ({
    groups: state.groups.filter(g => g.id !== id)
  }))
}));
