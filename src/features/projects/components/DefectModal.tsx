import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';
import { useDefectStore, Defect } from '../store/useDefectStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';
import { useTestExecutionStore } from '@/features/test-runs/store/useTestExecutionStore';
import { useTestCaseStore } from '../store/useTestCaseStore';

interface DefectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defect?: Defect;
  initialTestCaseId?: string;
  initialTestRunId?: string;
}

export function DefectModal({ isOpen, onClose, projectId, defect, initialTestCaseId, initialTestRunId }: DefectModalProps) {
  const { addDefect, updateDefect } = useDefectStore();
  const { users } = useUserStore();
  const { testRuns, fetchTestRuns } = useTestExecutionStore();
  const { testCases, fetchTestCases } = useTestCaseStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Defect['status']>('Open');
  const [severity, setSeverity] = useState<Defect['severity']>('Medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [testRunId, setTestRunId] = useState('');
  const [testCaseId, setTestCaseId] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTestRuns(projectId);
      fetchTestCases(projectId);
    }
  }, [isOpen, projectId, fetchTestRuns, fetchTestCases]);

  useEffect(() => {
    if (defect) {
      setTitle(defect.title);
      setDescription(defect.description);
      setStatus(defect.status);
      setSeverity(defect.severity);
      setAssigneeId(defect.assigneeId || '');
      setTestRunId(defect.testRunId || '');
      setTestCaseId(defect.testCaseId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('Open');
      setSeverity('Medium');
      setAssigneeId('');
      setTestRunId(initialTestRunId || '');
      setTestCaseId(initialTestCaseId || '');
    }
  }, [defect, isOpen, initialTestRunId, initialTestCaseId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      title,
      description,
      status,
      severity,
      assigneeId: assigneeId || undefined,
      testRunId: testRunId || undefined,
      testCaseId: testCaseId || undefined,
    };

    if (defect) {
      await updateDefect(defect.id, data);
      
      // Defect Management Logic: Prompt for retest if resolved/closed
      if ((status === 'Resolved' || status === 'Closed') && defect.status !== status && data.testCaseId) {
        if (window.confirm(`Defect marked as ${status}. Would you like to set the associated Test Case to 'Retest'?`)) {
          const { updateTestCase } = useTestCaseStore.getState();
          await updateTestCase(data.testCaseId, { status: 'Retest' });
        }
      }
    } else {
      await addDefect(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-semibold text-text">
            {defect ? 'Edit Defect' : 'Add Defect'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Title <span className="text-red-500">*</span></label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter defect title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Description</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the defect..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Defect['status'])}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Severity</label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as Defect['severity'])}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Assignee</label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text">Test Run (Optional)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={testRunId}
                  onChange={(e) => setTestRunId(e.target.value)}
                >
                  <option value="">None</option>
                  {testRuns.map(tr => (
                    <option key={tr.id} value={tr.id}>{tr.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-text">Test Case (Optional)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={testCaseId}
                  onChange={(e) => setTestCaseId(e.target.value)}
                >
                  <option value="">None</option>
                  {testCases.map(tc => (
                    <option key={tc.id} value={tc.id}>[{tc.id}] {tc.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border shrink-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {defect ? 'Save Changes' : 'Create Defect'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
