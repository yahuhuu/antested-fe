import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, Folder, FileText, Plus, Search, Filter, Play } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProjectStore } from '../store/useProjectStore';

const mockSuites = [
  {
    id: 'S1',
    name: 'Authentication',
    cases: [
      { id: 'TC-1', title: 'User can login with valid credentials', priority: 'High', status: 'Automated' },
      { id: 'TC-2', title: 'User cannot login with invalid password', priority: 'High', status: 'Manual' },
      { id: 'TC-3', title: 'Password reset flow', priority: 'Medium', status: 'Manual' },
    ]
  },
  {
    id: 'S2',
    name: 'Checkout Flow',
    cases: [
      { id: 'TC-4', title: 'Guest checkout with credit card', priority: 'Critical', status: 'Automated' },
      { id: 'TC-5', title: 'Logged in user checkout', priority: 'High', status: 'Automated' },
    ]
  }
];

export function ProjectDetail() {
  const { projectId } = useParams();
  const { projects } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  const [activeSuite, setActiveSuite] = useState(mockSuites[0].id);

  if (!project) {
    return <div className="p-6 text-text-muted">Project not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-text-muted">
          <Link to="/projects" className="hover:text-text">Projects</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/projects/${projectId}`} className="font-medium text-text hover:underline">{project.name}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-text">Test Repository</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Play className="mr-2 h-4 w-4" />
            New Test Run
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Test Case
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar - Test Suites */}
        <div className="flex w-64 flex-col rounded-xl border border-border bg-surface transition-colors">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-text-muted" />
              <Input placeholder="Filter suites..." className="h-8 pl-8 text-xs bg-surface-hover border-border" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {mockSuites.map((suite) => (
              <button
                key={suite.id}
                onClick={() => setActiveSuite(suite.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-left transition-colors",
                  activeSuite === suite.id ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-hover"
                )}
              >
                <div className="flex items-center gap-2">
                  <Folder className={cn("h-4 w-4", activeSuite === suite.id ? "text-primary" : "text-text-muted")} />
                  <span className="truncate">{suite.name}</span>
                </div>
                <span className="text-xs text-text-muted">{suite.cases.length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Test Cases */}
        <div className="flex flex-1 flex-col rounded-xl border border-border bg-surface transition-colors">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold text-text">
              {mockSuites.find(s => s.id === activeSuite)?.name}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-border bg-surface/80 backdrop-blur transition-colors">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-muted w-24">ID</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Title</th>
                  <th className="px-4 py-3 font-medium text-text-muted w-32">Priority</th>
                  <th className="px-4 py-3 font-medium text-text-muted w-32">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockSuites.find(s => s.id === activeSuite)?.cases.map((tc) => (
                  <tr key={tc.id} className="group hover:bg-surface-hover cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">{tc.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                        <span className="font-medium text-text group-hover:text-primary">{tc.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={tc.priority === 'Critical' ? 'destructive' : tc.priority === 'High' ? 'warning' : 'secondary'}>
                        {tc.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {tc.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
