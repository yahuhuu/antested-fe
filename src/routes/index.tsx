import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { ProjectDetail } from '@/features/projects/components/ProjectDetail';
import { TestRunExecution } from '@/features/test-runs/components/TestRunExecution';
import { TestExecutionList } from '@/features/test-runs/components/TestExecutionList';
import { ProjectDashboard } from '@/features/projects/components/ProjectDashboard';
import { SettingsProjectList } from '@/features/settings/projects/components/SettingsProjectList';
import { SettingsUsersList } from '@/features/settings/users/components/SettingsUsersList';
import { MilestoneList } from '@/features/projects/components/MilestoneList';
import { DefectList } from '@/features/projects/components/DefectList';

import { SettingsCustomizations } from '@/features/settings/customizations/components/SettingsCustomizations';

// Placeholders for new pages
import { useParams } from 'react-router-dom';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, Bug, PlayCircle, FolderKanban } from 'lucide-react';

const ProjectTestRuns = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Test Runs</h1>
      <p className="text-slate-500 dark:text-slate-400">Manage and execute test runs for this project.</p>
    </div>
  </div>
);

const ProjectDefects = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Defects</h1>
      <p className="text-slate-500 dark:text-slate-400">Track and manage defects linked to test cases.</p>
    </div>
  </div>
);

const ProjectReports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports</h1>
      <p className="text-slate-500 dark:text-slate-400">View analytics and traceability matrices.</p>
    </div>
  </div>
);

const SettingsPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400">Manage {title.toLowerCase()} settings.</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'projects',
        element: <ProjectList />,
      },
      {
        path: 'projects/:projectId',
        element: <ProjectDashboard />,
      },
      {
        path: 'projects/:projectId/test-cases',
        element: <ProjectDetail />,
      },
      {
        path: 'projects/:projectId/test-runs',
        element: <TestExecutionList />,
      },
      {
        path: 'projects/:projectId/milestones',
        element: <MilestoneList />,
      },
      {
        path: 'projects/:projectId/defects',
        element: <DefectList />,
      },
      {
        path: 'projects/:projectId/reports',
        element: <ProjectReports />,
      },
      {
        path: 'settings',
        element: <Navigate to="/settings/projects" replace />,
      },
      {
        path: 'settings/projects',
        element: <SettingsProjectList />,
      },
      {
        path: 'settings/users',
        element: <SettingsUsersList />,
      },
      {
        path: 'settings/customizations',
        element: <SettingsCustomizations />,
      },
      {
        path: 'settings/integrations',
        element: <SettingsPage title="Integrations" />,
      },
      {
        path: 'settings/data',
        element: <SettingsPage title="Data Management" />,
      },
      {
        path: 'settings/site',
        element: <SettingsPage title="Site Settings" />,
      },
    ],
  },
  {
    path: 'projects/:projectId/test-runs/:runId/execute',
    element: <TestRunExecution />,
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
