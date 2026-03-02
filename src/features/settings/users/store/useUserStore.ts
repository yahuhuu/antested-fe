import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'Active' | 'Inactive';
  groups: number;
  projects: number;
  lastActive: string;
}

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

const mockUsers: User[] = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@example.com', avatar: 'https://picsum.photos/seed/admin/100/100', role: 'Lead', status: 'Active', groups: 2, projects: 3, lastActive: '2 hours ago' },
  { id: 'usr-2', name: 'Alice Johnson', email: 'alice.j@example.com', avatar: 'https://picsum.photos/seed/alice/100/100', role: 'Tester', status: 'Active', groups: 1, projects: 3, lastActive: '5 hours ago' },
  { id: 'usr-3', name: 'Bob Williams', email: 'bob.w@example.com', avatar: 'https://picsum.photos/seed/bob/100/100', role: 'Developer', status: 'Active', groups: 1, projects: 2, lastActive: '1 day ago' },
  { id: 'usr-4', name: 'Charlie Brown', email: 'charlie.b@example.com', avatar: 'https://picsum.photos/seed/charlie/100/100', role: 'Tester', status: 'Inactive', groups: 1, projects: 2, lastActive: '2 weeks ago' },
  { id: 'usr-5', name: 'Diana Prince', email: 'diana.p@example.com', avatar: 'https://picsum.photos/seed/diana/100/100', role: 'Lead', status: 'Active', groups: 3, projects: 5, lastActive: '10 mins ago' },
  { id: 'usr-6', name: 'Evan Davis', email: 'evan.d@example.com', avatar: 'https://picsum.photos/seed/evan/100/100', role: 'Developer', status: 'Active', groups: 2, projects: 1, lastActive: '3 days ago' },
  { id: 'usr-7', name: 'Fiona Gallagher', email: 'fiona.g@example.com', avatar: 'https://picsum.photos/seed/fiona/100/100', role: 'Tester', status: 'Active', groups: 1, projects: 4, lastActive: '1 hour ago' },
  { id: 'usr-8', name: 'George Miller', email: 'george.m@example.com', avatar: 'https://picsum.photos/seed/george/100/100', role: 'Developer', status: 'Inactive', groups: 0, projects: 0, lastActive: '1 month ago' },
  { id: 'usr-9', name: 'Hannah Abbott', email: 'hannah.a@example.com', avatar: 'https://picsum.photos/seed/hannah/100/100', role: 'Tester', status: 'Active', groups: 2, projects: 2, lastActive: '4 hours ago' },
  { id: 'usr-10', name: 'Ian Wright', email: 'ian.w@example.com', avatar: 'https://picsum.photos/seed/ian/100/100', role: 'Lead', status: 'Active', groups: 1, projects: 3, lastActive: '2 days ago' },
  { id: 'usr-11', name: 'Julia Roberts', email: 'julia.r@example.com', avatar: 'https://picsum.photos/seed/julia/100/100', role: 'Tester', status: 'Active', groups: 3, projects: 4, lastActive: '30 mins ago' },
  { id: 'usr-12', name: 'Kevin Hart', email: 'kevin.h@example.com', avatar: 'https://picsum.photos/seed/kevin/100/100', role: 'Developer', status: 'Active', groups: 1, projects: 1, lastActive: '5 days ago' },
  { id: 'usr-13', name: 'Laura Palmer', email: 'laura.p@example.com', avatar: 'https://picsum.photos/seed/laura/100/100', role: 'Tester', status: 'Inactive', groups: 2, projects: 2, lastActive: '3 weeks ago' },
  { id: 'usr-14', name: 'Michael Scott', email: 'michael.s@example.com', avatar: 'https://picsum.photos/seed/michael/100/100', role: 'Lead', status: 'Active', groups: 4, projects: 6, lastActive: '1 min ago' },
  { id: 'usr-15', name: 'Nina Simone', email: 'nina.s@example.com', avatar: 'https://picsum.photos/seed/nina/100/100', role: 'Developer', status: 'Active', groups: 1, projects: 3, lastActive: '6 hours ago' },
];

export const useUserStore = create<UserState>((set) => ({
  users: mockUsers,
  addUser: (user) => set((state) => ({
    users: [...state.users, { ...user, id: `usr-${state.users.length + 1}` }]
  })),
  updateUser: (id, updatedUser) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updatedUser } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
  toggleUserStatus: (id) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)
  }))
}));
