import { Modal } from '@/components/ui/Modal';
import { Project } from '@/features/projects/store/useProjectStore';
import { Button } from '@/components/ui/Button';

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export function ProjectViewModal({ isOpen, onClose, project }: ProjectViewModalProps) {
  if (!project) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Project Details"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Project Name</h3>
          <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">{project.name}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Key</h3>
          <p className="mt-1 text-sm font-mono text-slate-900 dark:text-white">{project.id.toUpperCase()}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</h3>
          <p className="mt-1 text-sm text-slate-900 dark:text-white whitespace-pre-wrap">
            {project.description || 'No description provided.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg border border-slate-200 dark:border-neon-border bg-slate-50 dark:bg-neon-dark p-3">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test Cases</h4>
            <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{project.testCases || 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-neon-border bg-slate-50 dark:bg-neon-dark p-3">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Runs</h4>
            <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{project.activeRuns || 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-neon-border bg-slate-50 dark:bg-neon-dark p-3">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pass Rate</h4>
            <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{project.passRate || 0}%</p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-neon-border bg-slate-50 dark:bg-neon-dark p-3">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Defects</h4>
            <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{project.defects || 0}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
