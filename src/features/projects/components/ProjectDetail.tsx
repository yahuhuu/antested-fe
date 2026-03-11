import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';
import { Modal } from '@/components/ui/Modal';
import { 
  ChevronRight, ChevronLeft, Folder, FileText, Plus, Search, Filter, Play, Edit2, Trash2,
  Sparkles, MoreHorizontal, ChevronDown, FileEdit, Trash, Eye
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useProjectStore } from '../store/useProjectStore';
import { useTestCaseStore, TestCase } from '../store/useTestCaseStore';
import { useDirectoryStore, Directory } from '../store/useDirectoryStore';
import { TestCaseModal } from './TestCaseModal';
import { TestCaseSidePanel } from './TestCaseSidePanel';

interface DirNode {
  id: string;
  name: string;
  path: string;
  description?: string;
  count: number;
  children: Record<string, DirNode>;
}

export function ProjectDetail() {
  const { projectId } = useParams();
  const { projects } = useProjectStore();
  const { testCases, fetchTestCases, deleteTestCase, isLoading } = useTestCaseStore();
  const { directories, fetchDirectories, addDirectory, updateDirectory, deleteDirectory } = useDirectoryStore();
  
  const project = projects.find(p => p.id === projectId);
  
  const [activeSuite, setActiveSuite] = useState<string>('All Test Cases');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | undefined>();
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['dir-1']));
  
  // Directory Modal State
  const [isDirModalOpen, setIsDirModalOpen] = useState(false);
  const [editingDir, setEditingDir] = useState<Directory | undefined>();
  const [parentDirId, setParentDirId] = useState<string | null>(null);
  const [dirFormData, setDirFormData] = useState({ name: '', description: '' });
  const [viewingDir, setViewingDir] = useState<Directory | undefined>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeDirMenu, setActiveDirMenu] = useState<string | null>(null);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [activeTestCaseMenu, setActiveTestCaseMenu] = useState<string | null>(null);
  const [viewingTestCase, setViewingTestCase] = useState<TestCase | undefined>();
  const [deletingTestCase, setDeletingTestCase] = useState<string | 'selected' | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDirMenu(null);
      setActiveTestCaseMenu(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchTestCases(projectId);
      fetchDirectories(projectId);
    }
  }, [projectId, fetchTestCases, fetchDirectories]);

  const tree = useMemo(() => {
    const root: DirNode = { id: 'root', name: 'root', path: '', count: 0, children: {} };
    const projectDirs = directories.filter(d => d.projectId === projectId);
    
    // Build tree structure
    const dirMap = new Map<string, DirNode>();
    projectDirs.forEach(dir => {
      dirMap.set(dir.id, { id: dir.id, name: dir.name, path: dir.name, description: dir.description, count: 0, children: {} });
    });

    projectDirs.forEach(dir => {
      const node = dirMap.get(dir.id)!;
      if (dir.parentId && dirMap.has(dir.parentId)) {
        const parentNode = dirMap.get(dir.parentId)!;
        parentNode.children[dir.id] = node;
        node.path = `${parentNode.path}/${node.name}`;
      } else {
        root.children[dir.id] = node;
      }
    });

    // Count test cases
    testCases.forEach(tc => {
      let currentDirId: string | null = tc.directory || null;
      while (currentDirId && dirMap.has(currentDirId)) {
        const node = dirMap.get(currentDirId)!;
        node.count++;
        const dir = projectDirs.find(d => d.id === currentDirId);
        currentDirId = dir?.parentId || null;
      }
    });

    return root;
  }, [directories, testCases, projectId]);

  const filteredCases = useMemo(() => {
    let cases = testCases;
    if (activeSuite !== 'All Test Cases' && activeSuite !== 'Drafts' && activeSuite !== 'Trash') {
      // Get all descendant directory IDs
      const getDescendantIds = (parentId: string): string[] => {
        const children = directories.filter(d => d.parentId === parentId).map(d => d.id);
        return [parentId, ...children.flatMap(getDescendantIds)];
      };
      const validDirIds = getDescendantIds(activeSuite);
      cases = testCases.filter(tc => validDirIds.includes(tc.directory || 'Uncategorized'));
    } else if (activeSuite === 'Drafts') {
      cases = testCases.filter(tc => tc.reviewStatus === 'Draft');
    } else if (activeSuite === 'Trash') {
      cases = [];
    }
      
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cases = cases.filter(tc => 
        tc.title.toLowerCase().includes(q) || 
        tc.id.toLowerCase().includes(q)
      );
    }
    return cases;
  }, [activeSuite, testCases, searchQuery]);

  const handleDelete = (id: string) => {
    setDeletingTestCase(id);
  };

  const handleDeleteSelected = () => {
    setDeletingTestCase('selected');
  };

  const confirmDelete = async () => {
    if (deletingTestCase === 'selected') {
      for (const id of selectedTestCases) {
        await deleteTestCase(id);
      }
      setSelectedTestCases([]);
    } else if (deletingTestCase) {
      await deleteTestCase(deletingTestCase);
      setSelectedTestCases(prev => prev.filter(tcId => tcId !== deletingTestCase));
    }
    setDeletingTestCase(null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTestCases(filteredCases.map(tc => tc.id));
    } else {
      setSelectedTestCases([]);
    }
  };

  const handleSelectTestCase = (id: string) => {
    setSelectedTestCases(prev => 
      prev.includes(id) ? prev.filter(tcId => tcId !== id) : [...prev, id]
    );
  };

  const handleEdit = (tc: TestCase) => {
    setSelectedTestCase(tc);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTestCase(undefined);
    setIsModalOpen(true);
  };

  const toggleDir = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const handleAddDir = (parentId: string | null = null) => {
    setEditingDir(undefined);
    setParentDirId(parentId);
    setDirFormData({ name: '', description: '' });
    setIsDirModalOpen(true);
  };

  const handleEditDir = (dir: Directory) => {
    setEditingDir(dir);
    setParentDirId(dir.parentId);
    setDirFormData({ name: dir.name, description: dir.description || '' });
    setIsDirModalOpen(true);
  };

  const handleDeleteDir = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this directory and all its subdirectories?')) {
      await deleteDirectory(id);
      if (activeSuite === id) {
        setActiveSuite('All Test Cases');
      }
    }
  };

  const handleViewDir = (dir: Directory) => {
    setViewingDir(dir);
  };

  const handleDirSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDir) {
      await updateDirectory(editingDir.id, { name: dirFormData.name, description: dirFormData.description });
    } else {
      await addDirectory({
        projectId: projectId!,
        name: dirFormData.name,
        description: dirFormData.description,
        parentId: parentDirId
      });
    }
    setIsDirModalOpen(false);
  };

  const renderTree = (node: DirNode, level = 0) => {
    const children = Object.values(node.children);
    if (children.length === 0 && level === 0) return null;

    return (
      <div className="space-y-0.5">
        {children.map(child => {
          const isExpanded = expandedDirs.has(child.id);
          const hasChildren = Object.keys(child.children).length > 0;
          const isActive = activeSuite === child.id;
          const isMenuOpen = activeDirMenu === child.id;

          return (
            <div key={child.id}>
              <div 
                className={cn(
                  "group flex items-center justify-between rounded-md py-1.5 px-2 text-sm cursor-pointer transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-hover hover:text-text"
                )}
                style={{ paddingLeft: `${(level * 12) + 8}px` }}
                onClick={() => setActiveSuite(child.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  {hasChildren ? (
                    <button onClick={(e) => toggleDir(child.id, e)} className="p-0.5 hover:bg-surface-hover rounded shrink-0">
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  ) : (
                    <div className="w-4.5 shrink-0" /> // Spacer
                  )}
                  <Folder className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-text-muted")} />
                  <span className="truncate" title={child.name}>{child.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Badge variant="secondary" className={cn(
                    "h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] bg-surface-hover text-text-muted border-none transition-all",
                    isMenuOpen ? "opacity-100" : "group-hover:opacity-100"
                  )}>
                    {child.count}
                  </Badge>
                  <div className={cn(
                    "flex items-center transition-opacity",
                    isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDirMenu(isMenuOpen ? null : child.id);
                        }}
                        className="p-0.5 hover:bg-surface-hover rounded text-text-muted"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                          <button onClick={(e) => { e.stopPropagation(); handleViewDir(directories.find(d => d.id === child.id)!); setActiveDirMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleAddDir(child.id); setActiveDirMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2">
                            <Plus className="h-3.5 w-3.5" /> Add Subdirectory
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleEditDir(directories.find(d => d.id === child.id)!); setActiveDirMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2">
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteDir(child.id); setActiveDirMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {isExpanded && renderTree(child, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  if (!project) {
    return <div className="p-6 text-text-muted">Project not found.</div>;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden gap-6">
      <div className="flex flex-1 overflow-hidden gap-6">
        {/* Sidebar - Directory */}
        <div className={cn(
          "flex flex-col border border-border bg-surface rounded-xl transition-all duration-300 shrink-0 z-10 overflow-hidden",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isSidebarCollapsed && <h2 className="font-semibold text-text">Directory</h2>}
            <div className={cn("flex items-center", isSidebarCollapsed ? "mx-auto flex-col gap-2" : "gap-1")}>
              {!isSidebarCollapsed && (
                <Button variant="ghost" size="icon" onClick={() => handleAddDir()} className="h-6 w-6 text-text-muted hover:text-text">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="h-6 w-6 text-text-muted hover:text-text">
                <ChevronLeft className={cn("h-4 w-4 transition-transform", isSidebarCollapsed && "rotate-180")} />
              </Button>
            </div>
          </div>
          
          <div className={cn("flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4", isSidebarCollapsed && "hidden")}>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveSuite('All Test Cases')}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                  activeSuite === 'All Test Cases' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-hover hover:text-text"
                )}
              >
                <div className="flex items-center gap-2">
                  <Folder className={cn("h-4 w-4", activeSuite === 'All Test Cases' ? "text-primary" : "text-text-muted")} />
                  <span>All Test Cases</span>
                </div>
                <Badge variant="secondary" className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] bg-surface-hover text-text-muted border-none">
                  {testCases.length}
                </Badge>
              </button>
              
              {project.enable_test_case_approval && (
                <button
                  onClick={() => setActiveSuite('Drafts')}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                    activeSuite === 'Drafts' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-hover hover:text-text"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileEdit className={cn("h-4 w-4", activeSuite === 'Drafts' ? "text-primary" : "text-text-muted")} />
                    <span>Drafts</span>
                  </div>
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] bg-surface-hover text-text-muted border-none">
                    {testCases.filter(tc => tc.reviewStatus === 'Draft').length}
                  </Badge>
                </button>
              )}
              
              <button
                onClick={() => setActiveSuite('Trash')}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                  activeSuite === 'Trash' ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-hover hover:text-text"
                )}
              >
                <div className="flex items-center gap-2">
                  <Trash className={cn("h-4 w-4", activeSuite === 'Trash' ? "text-primary" : "text-text-muted")} />
                  <span>Trash</span>
                </div>
                <Badge variant="secondary" className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] bg-surface-hover text-text-muted border-none">
                  0
                </Badge>
              </button>
            </div>
            
            <div className="h-px bg-border mx-2" />
            
            {renderTree(tree)}
          </div>
        </div>

        {/* Main Content - Test Cases */}
        <div className="flex flex-1 flex-col bg-surface border border-border rounded-xl transition-colors overflow-hidden">
          <div className="flex flex-col gap-4 p-6 shrink-0 border-b border-border">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-text">Test Cases</h1>
              <div className="flex items-center gap-3">
                {selectedTestCases.length > 0 && (
                  <Button onClick={handleDeleteSelected} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-none">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedTestCases.length})
                  </Button>
                )}
                <Button className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate Test Case
                </Button>
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Test Case
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input 
                  placeholder="Search cases..." 
                  className="h-9 pl-9 bg-surface-hover border-border text-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                {project.enable_test_case_approval && (
                  <select className="h-9 rounded-md border border-border bg-surface-hover px-3 text-sm text-text-muted focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Status: All</option>
                    <option>Approved</option>
                    <option>Draft</option>
                    <option>In Review</option>
                    <option>Need Update</option>
                  </select>
                )}
                <select className="h-9 rounded-md border border-border bg-surface-hover px-3 text-sm text-text-muted focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Priority: All</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select className="h-9 rounded-md border border-border bg-surface-hover px-3 text-sm text-text-muted focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Assignee: All</option>
                  <option>Admin User</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-text-muted">Loading test cases...</div>
            ) : filteredCases.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-text-muted">No test cases found.</div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-hover border-b border-border sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">
                          <Checkbox 
                            checked={selectedTestCases.length === filteredCases.length && filteredCases.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider">Case ID</th>
                        <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider">Directory</th>
                        <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider">Priority</th>
                        {project.enable_test_case_approval && (
                          <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider">Status</th>
                        )}
                        <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider">Assignee</th>
                        <th className="px-4 py-3 font-medium text-text-muted text-xs uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                      {filteredCases.map((tc) => (
                        <tr key={tc.id} className="group hover:bg-surface-hover transition-colors">
                          <td className="px-4 py-3 text-center">
                            <Checkbox 
                              checked={selectedTestCases.includes(tc.id)}
                              onCheckedChange={() => handleSelectTestCase(tc.id)}
                            />
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-text-muted">{tc.id}</td>
                          <td className="px-4 py-3 font-medium text-text">{tc.title}</td>
                          <td className="px-4 py-3 text-text-muted">{directories.find(d => d.id === tc.directory)?.name || tc.directory}</td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant="outline"
                              className={cn(
                                "font-medium border-none px-2 py-0.5 rounded-full text-xs",
                                tc.priority === 'Critical' ? 'bg-purple-500/10 text-purple-500' : 
                                tc.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                                tc.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                                'bg-blue-500/10 text-blue-500'
                              )}
                            >
                              {tc.priority}
                            </Badge>
                          </td>
                          {project.enable_test_case_approval && (
                            <td className="px-4 py-3">
                              <Badge 
                                variant="outline"
                                className={cn(
                                  "font-medium border-none px-2 py-0.5 rounded-full text-xs",
                                  tc.reviewStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                                  tc.reviewStatus === 'Draft' ? 'bg-slate-500/10 text-slate-500' : 
                                  tc.reviewStatus === 'In Review' ? 'bg-teal-500/10 text-teal-500' : 
                                  tc.reviewStatus === 'Need Update' ? 'bg-orange-500/10 text-orange-500' :
                                  'bg-slate-500/10 text-slate-500'
                                )}
                              >
                                {tc.reviewStatus || 'Draft'}
                              </Badge>
                            </td>
                          )}
                          <td className="px-4 py-3 text-text-muted">{tc.assignee || 'Unassigned'}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="relative inline-block text-left">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-text-muted hover:text-text" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setActiveTestCaseMenu(activeTestCaseMenu === tc.id ? null : tc.id); 
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              {activeTestCaseMenu === tc.id && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-md shadow-lg z-50 py-1">
                                  <button onClick={(e) => { e.stopPropagation(); setViewingTestCase(tc); setActiveTestCaseMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2">
                                    <Eye className="h-3.5 w-3.5" /> View
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleEdit(tc); setActiveTestCaseMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-text hover:bg-surface-hover flex items-center gap-2">
                                    <Edit2 className="h-3.5 w-3.5" /> Edit
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleDelete(tc.id); setActiveTestCaseMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-hover text-xs text-text-muted shrink-0">
                  <div>
                    1-{filteredCases.length} of {testCases.length} items
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span>Rows per page:</span>
                      <select className="bg-surface border border-border rounded px-1 py-0.5">
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Go to page:</span>
                      <input type="number" defaultValue={1} className="w-12 bg-surface border border-border rounded px-1 py-0.5 text-center" />
                    </div>
                    <div>Page 1 of 4</div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" disabled>
                        <ChevronRight className="h-4 w-4 rotate-180" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isModalOpen && projectId && (
        <TestCaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={projectId}
          testCase={selectedTestCase}
        />
      )}

      <Modal
        isOpen={isDirModalOpen}
        onClose={() => setIsDirModalOpen(false)}
        title={editingDir ? 'Edit Directory' : 'Create Directory'}
        className="max-w-md"
        footer={
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsDirModalOpen(false)} className="text-text-muted hover:text-text">Cancel</Button>
            <Button type="button" onClick={handleDirSubmit}>{editingDir ? 'Save Changes' : 'Create'}</Button>
          </div>
        }
      >
        <form id="dir-form" onSubmit={handleDirSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dir-name" className="text-sm font-medium text-text">Directory Name <span className="text-red-500">*</span></label>
            <Input 
              id="dir-name" 
              value={dirFormData.name} 
              onChange={(e) => setDirFormData({ ...dirFormData, name: e.target.value })} 
              placeholder="e.g., Authentication" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="dir-desc" className="text-sm font-medium text-text">Description</label>
            <textarea 
              id="dir-desc" 
              value={dirFormData.description} 
              onChange={(e) => setDirFormData({ ...dirFormData, description: e.target.value })} 
              placeholder="Brief description..." 
              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px] text-text"
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!viewingDir}
        onClose={() => setViewingDir(undefined)}
        title="Directory Details"
        className="max-w-md"
        footer={
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setViewingDir(undefined)}>Close</Button>
          </div>
        }
      >
        {viewingDir && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-text-muted">Name</h3>
              <p className="mt-1 text-base font-medium text-text">{viewingDir.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-muted">Description</h3>
              <p className="mt-1 text-sm text-text whitespace-pre-wrap">
                {viewingDir.description || 'No description provided.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
      <TestCaseSidePanel
        isOpen={!!viewingTestCase}
        onClose={() => setViewingTestCase(undefined)}
        testCase={viewingTestCase || null}
      />

      <Modal
        isOpen={!!deletingTestCase}
        onClose={() => setDeletingTestCase(null)}
        title="Confirm Deletion"
        className="max-w-md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeletingTestCase(null)} className="text-text-muted hover:text-text">Cancel</Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-text">
            {deletingTestCase === 'selected' 
              ? `Are you sure you want to delete ${selectedTestCases.length} selected test cases?`
              : 'Are you sure you want to delete this test case?'
            }
          </p>
          <p className="text-sm text-text-muted">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
