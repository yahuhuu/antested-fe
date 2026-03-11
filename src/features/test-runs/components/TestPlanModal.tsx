import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useTestExecutionStore, TestPlan } from '../store/useTestExecutionStore';
import { useMilestoneStore } from '@/features/projects/store/useMilestoneStore';

interface TestPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  testPlan?: TestPlan;
  projectId: string;
}

export function TestPlanModal({ isOpen, onClose, testPlan, projectId }: TestPlanModalProps) {
  const { addTestPlan, updateTestPlan, testRuns, fetchTestRuns, isLoading } = useTestExecutionStore();
  const { milestones, fetchMilestones } = useMilestoneStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    milestoneId: '',
    testRunIds: [] as string[],
    status: 'Open' as 'Open' | 'In Progress' | 'Completed',
  });

  useEffect(() => {
    if (isOpen) {
      fetchMilestones(projectId);
      fetchTestRuns(projectId);
    }
  }, [isOpen, projectId, fetchMilestones, fetchTestRuns]);

  useEffect(() => {
    if (testPlan) {
      setFormData({
        name: testPlan.name,
        description: testPlan.description,
        milestoneId: testPlan.milestoneId || '',
        testRunIds: testPlan.testRunIds || [],
        status: testPlan.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        milestoneId: '',
        testRunIds: [],
        status: 'Open',
      });
    }
  }, [testPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      milestoneId: formData.milestoneId || undefined,
    };

    if (testPlan) {
      await updateTestPlan(testPlan.id, submitData);
    } else {
      await addTestPlan({ ...submitData, projectId });
    }
    onClose();
  };

  const handleTestRunToggle = (runId: string) => {
    setFormData(prev => ({
      ...prev,
      testRunIds: prev.testRunIds.includes(runId)
        ? prev.testRunIds.filter(id => id !== runId)
        : [...prev.testRunIds, runId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">
            {testPlan ? 'Edit Test Plan' : 'New Test Plan'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-text-muted hover:text-text">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Q1 Master Test Plan"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Test plan details..."
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="milestoneId" className="block text-sm font-medium text-text mb-1">
              Milestone
            </label>
            <Select
              id="milestoneId"
              value={formData.milestoneId}
              onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
              options={[
                { value: '', label: 'None' },
                ...milestones.map(m => ({ value: m.id, label: m.name }))
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Add Test Runs
            </label>
            <div className="max-h-40 overflow-y-auto border border-border rounded-md p-2 space-y-2">
              {testRuns.length === 0 ? (
                <p className="text-sm text-text-muted p-2">No test runs available.</p>
              ) : (
                testRuns.map(run => (
                  <label key={run.id} className="flex items-center space-x-2 p-1 hover:bg-surface-hover rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.testRunIds.includes(run.id)}
                      onChange={() => handleTestRunToggle(run.id)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text">{run.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {testPlan && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text mb-1">
                Status
              </label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Open' | 'In Progress' | 'Completed' })}
                options={[
                  { value: 'Open', label: 'Open' },
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'Completed', label: 'Completed' },
                ]}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : testPlan ? 'Save Changes' : 'Create Test Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
