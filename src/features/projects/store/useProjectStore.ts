import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  testCases: number;
  activeRuns: number;
  passRate?: number;
  defects?: number;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'testCases' | 'activeRuns'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const initialProjects: Project[] = [
  { id: 'PRJ-1', name: 'Nobi Dana Kripto', description: 'Platform for crypto investment and savings.', testCases: 450, activeRuns: 2, passRate: 94.2, defects: 12 },
  { id: 'PRJ-2', name: 'Akulaku Finance', description: 'Financial services and buy-now-pay-later platform.', testCases: 320, activeRuns: 1, passRate: 88.5, defects: 8 },
  { id: 'PRJ-3', name: 'Travel (Traveloka)', description: 'All-in-one travel booking platform for flights, hotels, and activities.', testCases: 150, activeRuns: 0, passRate: 98.1, defects: 2 },
  { id: 'PRJ-4', name: 'Travel & Entertainment (Tokopedia)', description: 'Travel and entertainment booking services integrated within Tokopedia.', testCases: 210, activeRuns: 3, passRate: 92.4, defects: 5 },
  { id: 'PRJ-5', name: 'Gojek Super App', description: 'Multi-service platform for ride-hailing, food delivery, and payments.', testCases: 550, activeRuns: 5, passRate: 95.0, defects: 15 },
  { id: 'PRJ-6', name: 'Shopee E-Commerce', description: 'Online shopping platform with integrated logistics and payments.', testCases: 480, activeRuns: 4, passRate: 93.8, defects: 10 },
  { id: 'PRJ-7', name: 'OVO E-Wallet', description: 'Digital payment and financial services application.', testCases: 290, activeRuns: 2, passRate: 97.2, defects: 3 },
  { id: 'PRJ-8', name: 'Dana Digital Wallet', description: 'Mobile wallet for cashless and cardless payments.', testCases: 310, activeRuns: 1, passRate: 96.5, defects: 4 },
  { id: 'PRJ-9', name: 'LinkAja Payment', description: 'State-owned digital payment service.', testCases: 180, activeRuns: 0, passRate: 98.5, defects: 1 },
  { id: 'PRJ-10', name: 'Bibit Investment', description: 'Robo-advisor mutual fund investment app.', testCases: 240, activeRuns: 2, passRate: 99.0, defects: 2 },
  { id: 'PRJ-11', name: 'Ajaib Stock Broker', description: 'Online stock and mutual fund trading platform.', testCases: 360, activeRuns: 3, passRate: 94.5, defects: 7 },
  { id: 'PRJ-12', name: 'Halodoc Healthcare', description: 'Telemedicine and healthcare services platform.', testCases: 420, activeRuns: 4, passRate: 96.0, defects: 6 },
  { id: 'PRJ-13', name: 'Ruangguru Edtech', description: 'Online learning and tutoring platform.', testCases: 380, activeRuns: 2, passRate: 95.5, defects: 9 },
  { id: 'PRJ-14', name: 'Kredivo Lending', description: 'Digital credit card and personal loan platform.', testCases: 270, activeRuns: 1, passRate: 97.0, defects: 4 },
  { id: 'PRJ-15', name: 'Sayurbox Grocery', description: 'Fresh produce and grocery delivery service.', testCases: 190, activeRuns: 0, passRate: 98.2, defects: 2 },
];

export const useProjectStore = create<ProjectState>((set) => ({
  projects: initialProjects,
  addProject: (project) => set((state) => {
    const newId = `PRJ-${state.projects.length + 1}`;
    return {
      projects: [...state.projects, { ...project, id: newId, testCases: 0, activeRuns: 0, passRate: 0, defects: 0 }]
    };
  }),
  updateProject: (id, updatedProject) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id)
  })),
}));
