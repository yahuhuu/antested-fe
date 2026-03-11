import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTestExecutionStore, TestRun } from '../store/useTestExecutionStore';
import { useMilestoneStore } from '@/features/projects/store/useMilestoneStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';

interface TestRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  testRun?: TestRun;
  projectId: string;
}

export function TestRunModal({ isOpen, onClose, testRun, projectId }: TestRunModalProps) {
  const { addTestRun, updateTestRun, isLoading } = useTestExecutionStore();
  const { milestones, fetchMilestones } = useMilestoneStore();
  const { users, fetchUsers } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    milestoneId: '',
    assignedTo: '',
    includeAllCases: true,
    status: 'Open' as 'Open' | 'In Progress' | 'Completed',
  });

  useEffect(() => {
    if (isOpen) {
      fetchMilestones(projectId);
      fetchUsers();
    }
  }, [isOpen, projectId, fetchMilestones, fetchUsers]);

  useEffect(() => {
    if (testRun) {
      setFormData({
        name: testRun.name,
        description: testRun.description,
        milestoneId: testRun.milestoneId || '',
        assignedTo: testRun.assignedTo || '',
        includeAllCases: testRun.includeAllCases,
        status: testRun.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        milestoneId: '',
        assignedTo: '',
        includeAllCases: true,
        status: 'Open',
      });
    }
  }, [testRun]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      milestoneId: formData.milestoneId || undefined,
      assignedTo: formData.assignedTo || undefined,
    };

    if (testRun) {
      await updateTestRun(testRun.id, submitData);
    } else {
      await addTestRun({ ...submitData, projectId, specificCaseIds: [] });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">
            {testRun ? 'Edit Test Run' : 'New Test Run'}
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
              placeholder="e.g., Sprint 1 Regression"
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
              placeholder="Test run details..."
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
            <label htmlFor="assignedTo" className="block text-sm font-medium text-text mb-1">
              Assign To
            </label>
            <Select
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              options={[
                { value: '', label: 'Unassigned' },
                ...users.map(u => ({ value: u.id, label: u.name }))
              ]}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="includeAllCases"
              checked={formData.includeAllCases}
              onCheckedChange={(checked) => setFormData({ ...formData, includeAllCases: checked as boolean })}
            />
            <label
              htmlFor="includeAllCases"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text"
            >
              Include all test cases
            </label>
          </div>
          {!formData.includeAllCases && (
            <p className="text-xs text-text-muted ml-6">
              You will be able to select specific test cases after creating the test run.
            </p>
          )}

          {testRun && (
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
              {isLoading ? 'Saving...' : testRun ? 'Save Changes' : 'Create Test Run'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
