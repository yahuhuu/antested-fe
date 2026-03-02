import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, FolderKanban, Edit2, Trash2 } from 'lucide-react';
import { useProjectStore, Project } from '../store/useProjectStore';
import { ProjectModal } from './ProjectModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

export function ProjectList() {
  const { projects, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  const handleOpenModal = (project?: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(undefined);
  };

  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Projects</h1>
          <p className="text-text-muted">Manage your testing projects and repositories.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="transition-all hover:shadow-md group relative flex flex-col h-[220px]">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 shrink-0">
              <div className="space-y-1 overflow-hidden pr-2">
                <CardTitle className="text-base line-clamp-2" title={project.name}>
                  <Link to={`/projects/${project.id}`} className="hover:underline text-text">
                    {project.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs font-mono truncate">{project.id}</CardDescription>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" onClick={(e) => { e.preventDefault(); handleOpenModal(project); }}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-red-500" onClick={(e) => handleDeleteClick(project, e)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 overflow-hidden">
              <p className="text-sm text-text-muted mb-4 line-clamp-3 flex-1" title={project.description}>{project.description}</p>
              <div className="flex items-center gap-4 text-xs text-text-muted shrink-0 mt-auto">
                <div className="flex items-center gap-1">
                  <FolderKanban className="h-3.5 w-3.5" />
                  {project.testCases || 0} Cases
                </div>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    {(project.activeRuns || 0) > 0 && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${(project.activeRuns || 0) > 0 ? 'bg-emerald-500' : 'bg-surface-hover'}`}></span>
                  </span>
                  {project.activeRuns || 0} Active Runs
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        project={editingProject}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={projectToDelete ? `Delete Project ${projectToDelete.name}` : 'Delete Project'}
        description={projectToDelete ? `Are you sure you want to delete Project ${projectToDelete.name}? This action cannot be undone.` : 'Are you sure you want to delete this project? This action cannot be undone.'}
      />
    </div>
  );
}
