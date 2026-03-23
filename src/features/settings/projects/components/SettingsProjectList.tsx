import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Trash2, MoreHorizontal, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ProjectModal } from '@/features/projects/components/ProjectModal';
import { ProjectViewModal } from '@/features/projects/components/ProjectViewModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { Project } from '@/features/projects/store/useProjectStore';

export function SettingsProjectList() {
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [viewingProject, setViewingProject] = useState<Project | undefined>();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null); // null means bulk delete

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProjects(paginatedProjects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (id: string) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter(pId => pId !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };

  const handleDeleteSelectedClick = () => {
    setProjectToDelete(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSingleClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      // Single delete
      deleteProject(projectToDelete.id);
      setSelectedProjects(selectedProjects.filter(pId => pId !== projectToDelete.id));
    } else {
      // Bulk delete
      selectedProjects.forEach(id => deleteProject(id));
      setSelectedProjects([]);
      // Adjust page if necessary
      if (currentPage > Math.ceil((filteredProjects.length - selectedProjects.length) / rowsPerPage)) {
        setCurrentPage(Math.max(1, Math.ceil((filteredProjects.length - selectedProjects.length) / rowsPerPage)));
      }
    }
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleAdd = () => {
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const handleView = (project: Project) => {
    setViewingProject(project);
    setIsViewModalOpen(true);
    setActiveDropdown(null);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-text">Manage Projects</h1>
      </div>

      <div className="flex items-center justify-between shrink-0">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Search by name or key..." 
            className="pl-8 bg-surface border-border text-text placeholder:text-text-muted"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {selectedProjects.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelectedClick}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedProjects.length})
            </Button>
          )}
          <Button onClick={handleAdd} className="bg-primary hover:bg-primary-hover text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-surface-hover text-text uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 w-12">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/30 text-primary focus:ring-white bg-white/10"
                      checked={selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3 w-32">Key</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 w-24 text-center">Users</th>
                <th className="px-4 py-3 w-24 text-center">Groups</th>
                <th className="px-4 py-3 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    No projects found.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr key={project.id} className="group hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-border text-primary focus:ring-primary bg-background"
                          checked={selectedProjects.includes(project.id)}
                          onChange={() => handleSelectProject(project.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-text">
                      {project.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">
                      {project.id.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-text-muted truncate max-w-xs">
                      {project.description || 'No description provided.'}
                    </td>
                    <td className="px-4 py-3 text-center text-text-muted">
                      {Math.floor(Math.random() * 5)}
                    </td>
                    <td className="px-4 py-3 text-center text-text-muted">
                      {Math.floor(Math.random() * 3) + 1}
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === project.id ? null : project.id)}
                        className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {activeDropdown === project.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-8 top-8 z-50 w-32 rounded-2xl border border-border bg-surface shadow-lg py-1">
                            <button 
                              onClick={() => handleView(project)}
                              className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </button>
                            <button 
                              onClick={() => handleEdit(project)}
                              className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteSingleClick(project)}
                              className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="shrink-0 flex items-center justify-between border-t border-border bg-surface-hover px-4 py-3 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-xs text-text">
              {filteredProjects.length === 0 ? '0 items' : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredProjects.length)} of ${filteredProjects.length} items`}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select 
                className="rounded border border-white/20 bg-surface px-2 py-1 text-xs outline-none text-text"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Go to page:</span>
              <input 
                type="number" 
                min={1}
                max={totalPages || 1}
                value={currentPage}
                onChange={(e) => {
                  const page = Number(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
                className="w-12 rounded border border-white/20 bg-surface px-2 py-1 text-xs outline-none text-center text-text" 
              />
            </div>
            <div>Page {currentPage} of {totalPages || 1}</div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-primary-hover disabled:opacity-50 text-text"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-primary-hover disabled:opacity-50 text-text"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />
      
      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        project={viewingProject}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={projectToDelete ? `Delete Project ${projectToDelete.name}` : `Delete ${selectedProjects.length} Projects`}
        description={projectToDelete 
          ? `Are you sure you want to delete Project ${projectToDelete.name}? This action cannot be undone.` 
          : `Are you sure you want to delete these ${selectedProjects.length} Projects? This action cannot be undone.`}
      />
    </div>
  );
}
