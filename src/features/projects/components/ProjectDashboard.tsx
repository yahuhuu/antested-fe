import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, Map, PlayCircle, FileText, Bug, CheckCircle2, AlertCircle, XCircle, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockChartData = [
  { date: '10/12', passed: 0, blocked: 0, skipped: 0, failed: 0, autoPassed: 0, autoFailed: 0, autoError: 0 },
  { date: '10/13', passed: 0, blocked: 0, skipped: 0, failed: 0, autoPassed: 0, autoFailed: 0, autoError: 0 },
  { date: '10/14', passed: 0, blocked: 0, skipped: 0, failed: 0, autoPassed: 0, autoFailed: 0, autoError: 0 },
  { date: '10/15', passed: 5, blocked: 1, skipped: 2, failed: 1, autoPassed: 0, autoFailed: 0, autoError: 0 },
  { date: '10/16', passed: 21, blocked: 2, skipped: 4, failed: 8, autoPassed: 0, autoFailed: 0, autoError: 0 },
  { date: '10/17', passed: 15, blocked: 1, skipped: 2, failed: 4, autoPassed: 0, autoFailed: 0, autoError: 0 },
];

const mockMilestones = [
  { name: 'Phase 1: UI/UX Freeze', date: '2024-08-15', progress: 90 },
  { name: 'Phase 2: Backend API Completion', date: '2024-09-01', progress: 75 },
  { name: 'UAT Deployment', date: '2024-09-20', progress: 30 },
];

const mockRecentRuns = [
  { name: 'Regression Cycle - v1.2.3', passed: 18, total: 20, status: 'Completed' },
  { name: 'Smoke Test - New Auth Feature', passed: 5, total: 8, status: 'In Progress' },
  { name: 'Full Regression - Pre-Release', passed: 145, total: 150, status: 'Completed' },
];

const mockActivities = [
  { user: 'Alice Johnson', action: "created a new test plan 'User Authentication'.", time: '2 hours ago' },
  { user: 'Charlie Brown', action: "started test run 'Smoke Test - Build #582'.", time: '1 day ago' },
  { user: 'Alice Johnson', action: "marked milestone 'UI/UX Freeze' as 90% complete.", time: '2 days ago' },
  { user: 'David Smith', action: "reported a new defect 'Login button unresponsive on mobile'.", time: '3 days ago' },
  { user: 'Eve Davis', action: "updated test case 'TC-15: Password Reset'.", time: '4 days ago' },
  { user: 'Charlie Brown', action: "completed test run 'Regression Cycle - v1.2.2'.", time: '5 days ago' },
  { user: 'Alice Johnson', action: "added 5 new test cases to 'Checkout Flow' suite.", time: '1 week ago' },
];

export function ProjectDashboard() {
  const { projectId } = useParams();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (isLoading) {
    return <div className="p-6 text-text-muted">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-6 text-text-muted">Project not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">{project.name} Overview</h1>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Milestones</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">0</div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Test Plans</CardTitle>
            <Map className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">0</div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Test Runs</CardTitle>
            <PlayCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">0</div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Test Cases</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">0</div>
          </CardContent>
        </Card>
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Open Bugs</CardTitle>
            <Bug className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-surface border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-text">Test Case Trend</CardTitle>
          <div className="text-xs text-text-muted">In the past 6 days</div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="h-[300px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--text)' }}
                  />
                  <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="blocked" stroke="#64748b" strokeWidth={2} dot={{ r: 4, fill: '#64748b' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="skipped" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="autoPassed" stroke="#059669" strokeWidth={2} dot={{ r: 4, fill: '#059669' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="autoFailed" stroke="#dc2626" strokeWidth={2} dot={{ r: 4, fill: '#dc2626' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="autoError" stroke="#a855f7" strokeWidth={2} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-72 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-semibold text-text">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    15 Passed
                  </div>
                  <span className="text-text-muted ml-4.5 text-[10px]">68% set to Passed</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-semibold text-text">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                    1 Blocked
                  </div>
                  <span className="text-text-muted ml-4.5 text-[10px]">5% set to Blocked</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-semibold text-text">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    2 Skipped
                  </div>
                  <span className="text-text-muted ml-4.5 text-[10px]">9% set to Skipped</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 font-semibold text-text">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                    4 Failed
                  </div>
                  <span className="text-text-muted ml-4.5 text-[10px]">18% set to Failed</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-semibold text-text">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                      0 Automation Passed
                    </div>
                    <span className="text-text-muted ml-4.5 text-[10px]">0% set to Passed</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-semibold text-text">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                      0 Automation Failed
                    </div>
                    <span className="text-text-muted ml-4.5 text-[10px]">0% set to Failed</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 font-semibold text-text">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                      0 Automation Error
                    </div>
                    <span className="text-text-muted ml-4.5 text-[10px]">0% set to Error</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Milestones */}
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text">Milestones</CardTitle>
            <Link to={`/projects/${projectId}/milestones`} className="text-xs text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMilestones.map((milestone, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-text">{milestone.name}</span>
                  <span className="text-text-muted">{milestone.date}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${milestone.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Test Runs */}
        <Card className="bg-surface border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-text">Recent Test Runs</CardTitle>
            <Link to={`/projects/${projectId}/test-runs`} className="text-xs text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentRuns.map((run, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-text">{run.name}</div>
                  <div className="text-[10px] text-text-muted">Passed: {run.passed}/{run.total}</div>
                </div>
                <Badge variant={run.status === 'Completed' ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">
                  {run.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <Card className="bg-surface border-border flex flex-col h-[300px]">
        <CardHeader className="pb-2 shrink-0">
          <CardTitle className="text-sm font-semibold text-text">Activity</CardTitle>
          <div className="flex gap-4 text-xs mt-2 border-b border-border pb-2">
            <button className="text-primary font-medium border-b-2 border-primary pb-2 -mb-[9px]">History</button>
            <button className="text-text-muted hover:text-text pb-2 -mb-[9px]">Test Changes</button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4 mt-2">
            {mockActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-text-muted">
                  <span className="text-xs font-medium">{activity.user.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <div className="text-xs text-text-muted">
                    <span className="font-semibold text-text">{activity.user}</span> {activity.action}
                  </div>
                  <div className="text-[10px] text-text-muted">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
