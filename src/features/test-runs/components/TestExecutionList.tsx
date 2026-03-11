import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, PlayCircle, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTestExecutionStore, TestRun, TestPlan } from '../store/useTestExecutionStore';
import { TestRunModal } from './TestRunModal';
import { TestPlanModal } from './TestPlanModal';

type ExecutionItem = 
  | (TestRun & { type: 'Test Run' })
  | (TestPlan & { type: 'Test Plan', stats?: { passed: number, failed: number, untested: number, total: number } });

export function TestExecutionList() {
  const { projectId } = useParams<{ projectId: string }>();
  const { testRuns, testPlans, isLoading, fetchTestRuns, fetchTestPlans, deleteTestRun, deleteTestPlan } = useTestExecutionStore();
  
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<TestRun | undefined>();
  const [selectedPlan, setSelectedPlan] = useState<TestPlan | undefined>();

  useEffect(() => {
    if (projectId) {
      fetchTestRuns(projectId);
      fetchTestPlans(projectId);
    }
  }, [projectId, fetchTestRuns, fetchTestPlans]);

  const handleOpenRunModal = (run?: TestRun) => {
    setSelectedRun(run);
    setIsRunModalOpen(true);
  };

  const handleOpenPlanModal = (plan?: TestPlan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleDelete = async (item: ExecutionItem) => {
    if (window.confirm(`Are you sure you want to delete this ${item.type}?`)) {
      if (item.type === 'Test Run') {
        await deleteTestRun(item.id);
      } else {
        await deleteTestPlan(item.id);
      }
    }
  };

  // Combine and calculate stats for plans
  const items: ExecutionItem[] = [
    ...testRuns.map(r => ({ ...r, type: 'Test Run' as const })),
    ...testPlans.map(p => {
      // Calculate aggregated stats for test plan based on its test runs
      const planRuns = testRuns.filter(r => p.testRunIds.includes(r.id));
      const stats = planRuns.reduce((acc, run) => ({
        passed: acc.passed + run.stats.passed,
        failed: acc.failed + run.stats.failed,
        untested: acc.untested + run.stats.untested,
        total: acc.total + run.stats.total,
      }), { passed: 0, failed: 0, untested: 0, total: 0 });

      return { ...p, type: 'Test Plan' as const, stats };
    })
  ].sort((a, b) => a.name.localeCompare(b.name));

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading test executions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Test Runs & Plans</h1>
          <p className="text-text-muted">Manage your test executions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleOpenPlanModal()}>
            <Plus className="mr-2 h-4 w-4" />
            New Test Plan
          </Button>
          <Button onClick={() => handleOpenRunModal()}>
            <Plus className="mr-2 h-4 w-4" />
            New Test Run
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-surface-hover border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Passed</th>
                <th className="px-6 py-4 font-semibold text-center">Failed</th>
                <th className="px-6 py-4 font-semibold text-center">Untested</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                    No test runs or plans found. Create one to get started.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const stats = item.stats || { passed: 0, failed: 0, untested: 0, total: 0 };
                  const passedPct = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
                  const failedPct = stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0;
                  const untestedPct = stats.total > 0 ? Math.round((stats.untested / stats.total) * 100) : 0;

                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-text">
                          {item.type === 'Test Run' ? (
                            <Link to={`/projects/${projectId}/test-runs/${item.id}/execute`} className="hover:underline text-primary">
                              {item.name}
                            </Link>
                          ) : (
                            <span>{item.name}</span>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-xs text-text-muted mt-1 line-clamp-1">{item.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        <div className="flex items-center gap-2">
                          {item.type === 'Test Plan' ? <FolderKanban className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : item.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-emerald-500 font-medium">{passedPct}%</span>
                        <div className="text-xs text-text-muted">{stats.passed}/{stats.total}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-red-500 font-medium">{failedPct}%</span>
                        <div className="text-xs text-text-muted">{stats.failed}/{stats.total}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-slate-500 font-medium">{untestedPct}%</span>
                        <div className="text-xs text-text-muted">{stats.untested}/{stats.total}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => item.type === 'Test Run' ? handleOpenRunModal(item as TestRun) : handleOpenPlanModal(item as TestPlan)}
                          >
                            <Edit2 className="h-4 w-4 text-text-muted hover:text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                            <Trash2 className="h-4 w-4 text-text-muted hover:text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isRunModalOpen && projectId && (
        <TestRunModal
          isOpen={isRunModalOpen}
          onClose={() => setIsRunModalOpen(false)}
          testRun={selectedRun}
          projectId={projectId}
        />
      )}

      {isPlanModalOpen && projectId && (
        <TestPlanModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          testPlan={selectedPlan}
          projectId={projectId}
        />
      )}
    </div>
  );
}
