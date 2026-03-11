import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, Bug } from 'lucide-react';
import { useDefectStore, Defect } from '../store/useDefectStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';
import { DefectModal } from './DefectModal';
import { cn } from '@/utils/cn';

export function DefectList() {
  const { projectId } = useParams();
  const { defects, fetchDefects, deleteDefect, isLoading } = useDefectStore();
  const { users, fetchUsers } = useUserStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<Defect | undefined>();

  useEffect(() => {
    if (projectId) {
      fetchDefects(projectId);
      fetchUsers();
    }
  }, [projectId, fetchDefects, fetchUsers]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this defect?')) {
      await deleteDefect(id);
    }
  };

  const handleEdit = (defect: Defect) => {
    setSelectedDefect(defect);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDefect(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Defects</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Defect
        </Button>
      </div>

      <div className="flex-1 rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-text-muted">Loading defects...</div>
          ) : defects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4">
              <Bug className="h-12 w-12 text-border" />
              <p>No defects found.</p>
              <Button variant="outline" onClick={handleAdd}>Create your first defect</Button>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-border bg-surface/80 backdrop-blur transition-colors z-10">
                <tr>
                  <th className="px-4 py-3 font-medium text-text-muted w-24">ID</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Title</th>
                  <th className="px-4 py-3 font-medium text-text-muted w-32">Status</th>
                  <th className="px-4 py-3 font-medium text-text-muted w-32">Severity</th>
                  <th className="px-4 py-3 font-medium text-text-muted w-48">Assignee</th>
                  <th className="px-4 py-3 font-medium text-text-muted w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {defects.map((defect) => (
                  <tr key={defect.id} className="group hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">{defect.id}</td>
                    <td className="px-4 py-3 font-medium text-text">{defect.title}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        defect.status === 'Open' ? 'bg-blue-500/10 text-blue-500' :
                        defect.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                        defect.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-slate-500/10 text-slate-500'
                      )}>
                        {defect.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={defect.severity === 'Critical' ? 'destructive' : defect.severity === 'High' ? 'warning' : 'secondary'}>
                        {defect.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {users.find(u => u.id === defect.assigneeId)?.name || 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" onClick={() => handleEdit(defect)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-red-500" onClick={() => handleDelete(defect.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && projectId && (
        <DefectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={projectId}
          defect={selectedDefect}
        />
      )}
    </div>
  );
}
