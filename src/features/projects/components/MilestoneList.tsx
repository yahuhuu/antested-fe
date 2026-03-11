import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MilestoneModal } from './MilestoneModal';
import { useMilestoneStore, Milestone } from '../store/useMilestoneStore';

export function MilestoneList() {
  const { projectId } = useParams<{ projectId: string }>();
  const { milestones, isLoading, fetchMilestones, deleteMilestone } = useMilestoneStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>();

  useEffect(() => {
    if (projectId) {
      fetchMilestones(projectId);
    }
  }, [projectId, fetchMilestones]);

  const handleOpenModal = (milestone?: Milestone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMilestone(undefined);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      await deleteMilestone(id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading milestones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Milestones</h1>
          <p className="text-text-muted">Manage milestones for this project.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          New Milestone
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-muted uppercase bg-surface-hover border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Start Date</th>
                <th className="px-6 py-4 font-semibold">End Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {milestones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                    No milestones found. Create one to get started.
                  </td>
                </tr>
              ) : (
                milestones.map((milestone) => (
                  <tr key={milestone.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{milestone.name}</div>
                      {milestone.description && (
                        <div className="text-xs text-text-muted mt-1 line-clamp-1">{milestone.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {milestone.startDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {milestone.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        milestone.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {milestone.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(milestone)}>
                          <Edit2 className="h-4 w-4 text-text-muted hover:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(milestone.id)}>
                          <Trash2 className="h-4 w-4 text-text-muted hover:text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && projectId && (
        <MilestoneModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          milestone={selectedMilestone}
          projectId={projectId}
        />
      )}
    </div>
  );
}
