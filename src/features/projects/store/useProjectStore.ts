import { create } from 'zustand';
import { mockApi } from '@/api/mockApi';

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  enable_test_case_approval: boolean;
  test_cases: {
    total_test_cases: number;
    status: {
      draft?: number;
      under_review?: number;
      rejected?: number;
      ready: number;
    };
  };
  test_runs: {
    total_test_runs: number;
    status: {
      open: number;
      overdue: number;
      completed: number;
    };
  };
  test_plans: {
    total_test_plans: number;
    status: {
      open: number;
      overdue: number;
      completed: number;
    };
  };
  milestones: {
    total_milestones: number;
    status: {
      open: number;
      overdue: number;
      completed: number;
    };
  };
  defects: {
    total_defects: number;
    status: {
      failed: number;
      in_progress: number;
      fixed: number;
      in_testing: number;
    };
  };
  test_case_templates: {
    id: string;
    name: string;
    description: string;
  };
  access_management: {
    users: {
      total_users: number;
      data: {
        id: string;
        name: string;
        email: string;
      }[];
    };
    groups: {
      total_groups: number;
      data: {
        id: string;
        name: string;
        description: string;
      }[];
    };
  };
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await mockApi.getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects', error);
      set({ isLoading: false });
    }
  },
  addProject: async (project) => {
    try {
      const newProject = await mockApi.addProject(project);
      set((state) => ({ projects: [...state.projects, newProject] }));
    } catch (error) {
      console.error('Failed to add project', error);
    }
  },
  updateProject: async (id, updatedProject) => {
    try {
      const updated = await mockApi.updateProject(id, updatedProject);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p))
      }));
    } catch (error) {
      console.error('Failed to update project', error);
    }
  },
  deleteProject: async (id) => {
    try {
      await mockApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  },
}));
