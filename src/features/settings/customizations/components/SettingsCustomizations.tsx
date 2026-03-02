import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Trash2, MoreHorizontal, Edit, ChevronLeft, ChevronRight, Eye, LayoutTemplate, ListTree, Type } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { useCustomizationStore, CaseField, TestStepTemplate, TestCaseTemplate } from '../store/useCustomizationStore';
import { AddCaseFieldModal } from './AddCaseFieldModal';
import { EditCaseFieldModal } from './EditCaseFieldModal';
import { ViewCaseFieldPanel } from './ViewCaseFieldPanel';
import { AddTestStepTemplateModal } from './AddTestStepTemplateModal';
import { EditTestStepTemplateModal } from './EditTestStepTemplateModal';
import { ViewTestStepTemplatePanel } from './ViewTestStepTemplatePanel';
import { AddTestCaseTemplateModal } from './AddTestCaseTemplateModal';
import { EditTestCaseTemplateModal } from './EditTestCaseTemplateModal';
import { ViewTestCaseTemplatePanel } from './ViewTestCaseTemplatePanel';

export function SettingsCustomizations() {
  const { 
    caseFields, addCaseField, updateCaseField, deleteCaseField,
    testStepTemplates, addTestStepTemplate, updateTestStepTemplate, deleteTestStepTemplate,
    testCaseTemplates, addTestCaseTemplate, updateTestCaseTemplate, deleteTestCaseTemplate
  } = useCustomizationStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'case-field' | 'test-step-template' | 'test-case-template'>('case-field');
  
  const [selectedCaseFields, setSelectedCaseFields] = useState<string[]>([]);
  const [selectedTestStepTemplates, setSelectedTestStepTemplates] = useState<string[]>([]);
  const [selectedTestCaseTemplates, setSelectedTestCaseTemplates] = useState<string[]>([]);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CaseField | TestStepTemplate | TestCaseTemplate | null>(null);
  const [deleteType, setDeleteType] = useState<'case-field' | 'test-step-template' | 'test-case-template'>('case-field');
  
  const [isAddCaseFieldModalOpen, setIsAddCaseFieldModalOpen] = useState(false);
  const [isEditCaseFieldModalOpen, setIsEditCaseFieldModalOpen] = useState(false);
  const [isViewCaseFieldPanelOpen, setIsViewCaseFieldPanelOpen] = useState(false);
  const [selectedFieldForEdit, setSelectedFieldForEdit] = useState<CaseField | null>(null);
  const [selectedFieldForView, setSelectedFieldForView] = useState<CaseField | null>(null);

  const [isAddTestStepTemplateModalOpen, setIsAddTestStepTemplateModalOpen] = useState(false);
  const [isEditTestStepTemplateModalOpen, setIsEditTestStepTemplateModalOpen] = useState(false);
  const [isViewTestStepTemplatePanelOpen, setIsViewTestStepTemplatePanelOpen] = useState(false);
  const [selectedTestStepTemplateForEdit, setSelectedTestStepTemplateForEdit] = useState<TestStepTemplate | null>(null);
  const [selectedTestStepTemplateForView, setSelectedTestStepTemplateForView] = useState<TestStepTemplate | null>(null);

  const [isAddTestCaseTemplateModalOpen, setIsAddTestCaseTemplateModalOpen] = useState(false);
  const [isEditTestCaseTemplateModalOpen, setIsEditTestCaseTemplateModalOpen] = useState(false);
  const [isViewTestCaseTemplatePanelOpen, setIsViewTestCaseTemplatePanelOpen] = useState(false);
  const [selectedTestCaseTemplateForEdit, setSelectedTestCaseTemplateForEdit] = useState<TestCaseTemplate | null>(null);
  const [selectedTestCaseTemplateForView, setSelectedTestCaseTemplateForView] = useState<TestCaseTemplate | null>(null);

  const filteredCaseFields = caseFields.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTestStepTemplates = testStepTemplates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTestCaseTemplates = testCaseTemplates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDataLength = 
    activeTab === 'case-field' ? filteredCaseFields.length : 
    activeTab === 'test-step-template' ? filteredTestStepTemplates.length : 
    filteredTestCaseTemplates.length;
    
  const totalPages = Math.ceil(currentDataLength / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  
  const paginatedCaseFields = filteredCaseFields.slice(startIndex, startIndex + rowsPerPage);
  const paginatedTestStepTemplates = filteredTestStepTemplates.slice(startIndex, startIndex + rowsPerPage);
  const paginatedTestCaseTemplates = filteredTestCaseTemplates.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab === 'case-field') {
      setSelectedCaseFields(e.target.checked ? paginatedCaseFields.map(f => f.id) : []);
    } else if (activeTab === 'test-step-template') {
      setSelectedTestStepTemplates(e.target.checked ? paginatedTestStepTemplates.map(t => t.id) : []);
    } else if (activeTab === 'test-case-template') {
      setSelectedTestCaseTemplates(e.target.checked ? paginatedTestCaseTemplates.map(t => t.id) : []);
    }
  };

  const handleSelectItem = (id: string) => {
    if (activeTab === 'case-field') {
      setSelectedCaseFields(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else if (activeTab === 'test-step-template') {
      setSelectedTestStepTemplates(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else if (activeTab === 'test-case-template') {
      setSelectedTestCaseTemplates(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }
  };

  const handleDeleteSelectedClick = () => {
    setItemToDelete(null);
    setDeleteType(activeTab);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (field: CaseField) => {
    setSelectedFieldForEdit(field);
    setIsEditCaseFieldModalOpen(true);
    setActiveDropdown(null);
  };

  const handleViewClick = (field: CaseField) => {
    setSelectedFieldForView(field);
    setIsViewCaseFieldPanelOpen(true);
    setActiveDropdown(null);
  };

  const handleEditTestStepTemplateClick = (template: TestStepTemplate) => {
    setSelectedTestStepTemplateForEdit(template);
    setIsEditTestStepTemplateModalOpen(true);
    setActiveDropdown(null);
  };

  const handleViewTestStepTemplateClick = (template: TestStepTemplate) => {
    setSelectedTestStepTemplateForView(template);
    setIsViewTestStepTemplatePanelOpen(true);
    setActiveDropdown(null);
  };

  const handleEditTestCaseTemplateClick = (template: TestCaseTemplate) => {
    setSelectedTestCaseTemplateForEdit(template);
    setIsEditTestCaseTemplateModalOpen(true);
    setActiveDropdown(null);
  };

  const handleViewTestCaseTemplateClick = (template: TestCaseTemplate) => {
    setSelectedTestCaseTemplateForView(template);
    setIsViewTestCaseTemplatePanelOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteSingleClick = (item: CaseField | TestStepTemplate | TestCaseTemplate, type: 'case-field' | 'test-step-template' | 'test-case-template') => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'case-field') {
      if (itemToDelete) {
        deleteCaseField(itemToDelete.id);
        setSelectedCaseFields(prev => prev.filter(id => id !== itemToDelete.id));
      } else {
        selectedCaseFields.forEach(id => deleteCaseField(id));
        setSelectedCaseFields([]);
      }
    } else if (deleteType === 'test-step-template') {
      if (itemToDelete) {
        deleteTestStepTemplate(itemToDelete.id);
        setSelectedTestStepTemplates(prev => prev.filter(id => id !== itemToDelete.id));
      } else {
        selectedTestStepTemplates.forEach(id => deleteTestStepTemplate(id));
        setSelectedTestStepTemplates([]);
      }
    } else if (deleteType === 'test-case-template') {
      if (itemToDelete) {
        deleteTestCaseTemplate(itemToDelete.id);
        setSelectedTestCaseTemplates(prev => prev.filter(id => id !== itemToDelete.id));
      } else {
        selectedTestCaseTemplates.forEach(id => deleteTestCaseTemplate(id));
        setSelectedTestCaseTemplates([]);
      }
    }
    
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const getSelectedCount = () => {
    if (activeTab === 'case-field') return selectedCaseFields.length;
    if (activeTab === 'test-step-template') return selectedTestStepTemplates.length;
    return selectedTestCaseTemplates.length;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-text">Customizations</h1>
      </div>

      <div className="flex border-b border-border shrink-0">
        <button 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'case-field' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
          onClick={() => { setActiveTab('case-field'); setCurrentPage(1); setSearchQuery(''); }}
        >
          <Type className="h-4 w-4" />
          Case Field
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'test-step-template' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
          onClick={() => { setActiveTab('test-step-template'); setCurrentPage(1); setSearchQuery(''); }}
        >
          <ListTree className="h-4 w-4" />
          Test Step Template
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'test-case-template' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
          onClick={() => { setActiveTab('test-case-template'); setCurrentPage(1); setSearchQuery(''); }}
        >
          <LayoutTemplate className="h-4 w-4" />
          Test Case Template
        </button>
      </div>

      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder={`Search ${activeTab.replace(/-/g, ' ')}...`} 
              className="pl-8 bg-surface border-border"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getSelectedCount() > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelectedClick}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({getSelectedCount()})
            </Button>
          )}
          <Button 
            className="bg-primary hover:bg-primary-hover text-white"
            onClick={() => {
              if (activeTab === 'case-field') {
                setIsAddCaseFieldModalOpen(true);
              } else if (activeTab === 'test-step-template') {
                setIsAddTestStepTemplateModalOpen(true);
              } else if (activeTab === 'test-case-template') {
                setIsAddTestCaseTemplateModalOpen(true);
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-border bg-background overflow-hidden">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-surface-hover text-text uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 w-12">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/30 text-primary focus:ring-white bg-white/10"
                      checked={
                        (activeTab === 'case-field' && selectedCaseFields.length === paginatedCaseFields.length && paginatedCaseFields.length > 0) ||
                        (activeTab === 'test-step-template' && selectedTestStepTemplates.length === paginatedTestStepTemplates.length && paginatedTestStepTemplates.length > 0) ||
                        (activeTab === 'test-case-template' && selectedTestCaseTemplates.length === paginatedTestCaseTemplates.length && paginatedTestCaseTemplates.length > 0)
                      }
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                {activeTab === 'case-field' && <th className="px-4 py-3">Type</th>}
                {(activeTab === 'case-field' || activeTab === 'test-step-template') && <th className="px-4 py-3">Test Case Template</th>}
                <th className="px-4 py-3 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {activeTab === 'case-field' && paginatedCaseFields.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No case fields found.</td></tr>
              )}
              {activeTab === 'case-field' && paginatedCaseFields.map((field) => (
                <tr key={field.id} className="group hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary focus:ring-primary bg-background"
                        checked={selectedCaseFields.includes(field.id)}
                        onChange={() => handleSelectItem(field.id)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{field.name}</td>
                  <td className="px-4 py-3 text-text-muted">{field.description}</td>
                  <td className="px-4 py-3 text-text">{field.type}</td>
                  <td className="px-4 py-3 text-text-muted">{field.testCaseTemplate?.length || 0}</td>
                  <td className="px-4 py-3 text-center relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === field.id ? null : field.id)}
                      className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {activeDropdown === field.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-8 top-8 z-50 w-32 rounded-md border border-border bg-surface shadow-lg py-1">
                          <button 
                            onClick={() => handleViewClick(field)}
                            className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </button>
                          <button 
                            onClick={() => handleEditClick(field)}
                            className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSingleClick(field, 'case-field')}
                            className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {activeTab === 'test-step-template' && paginatedTestStepTemplates.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No test step templates found.</td></tr>
              )}
              {activeTab === 'test-step-template' && paginatedTestStepTemplates.map((template) => (
                <tr key={template.id} className="group hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary focus:ring-primary bg-background"
                        checked={selectedTestStepTemplates.includes(template.id)}
                        onChange={() => handleSelectItem(template.id)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{template.name}</td>
                  <td className="px-4 py-3 text-text-muted">{template.description}</td>
                  <td className="px-4 py-3 text-text-muted">{template.testCaseTemplate?.length || 0}</td>
                  <td className="px-4 py-3 text-center relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === template.id ? null : template.id)}
                      className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {activeDropdown === template.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-8 top-8 z-50 w-32 rounded-md border border-border bg-surface shadow-lg py-1">
                          <button 
                            onClick={() => handleViewTestStepTemplateClick(template)}
                            className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </button>
                          <button 
                            onClick={() => handleEditTestStepTemplateClick(template)}
                            className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSingleClick(template, 'test-step-template')}
                            className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {activeTab === 'test-case-template' && paginatedTestCaseTemplates.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted">No test case templates found.</td></tr>
              )}
              {activeTab === 'test-case-template' && paginatedTestCaseTemplates.map((template) => (
                <tr key={template.id} className="group hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary focus:ring-primary bg-background"
                        checked={selectedTestCaseTemplates.includes(template.id)}
                        onChange={() => handleSelectItem(template.id)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{template.name}</td>
                  <td className="px-4 py-3 text-text-muted">{template.description}</td>
                  <td className="px-4 py-3 text-center relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === template.id ? null : template.id)}
                      className="p-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {activeDropdown === template.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                        <div className="absolute right-8 top-8 z-50 w-32 rounded-md border border-border bg-surface shadow-lg py-1">
                          <button 
                            onClick={() => handleViewTestCaseTemplateClick(template)}
                            className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </button>
                          <button 
                            onClick={() => handleEditTestCaseTemplateClick(template)}
                            className="flex w-full items-center px-3 py-2 text-sm text-text hover:bg-surface-hover transition-colors"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSingleClick(template, 'test-case-template')}
                            className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="shrink-0 flex items-center justify-between border-t border-border bg-surface-hover px-4 py-3 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-xs text-text">
              {currentDataLength === 0 ? '0 items' : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, currentDataLength)} of ${currentDataLength} items`}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select 
                className="rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-text"
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
                className="w-12 rounded border border-white/20 bg-surface-hover px-2 py-1 text-xs outline-none text-center text-text" 
              />
            </div>
            <div>Page {currentPage} of {totalPages || 1}</div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-surface-hover disabled:opacity-50 text-text"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}${itemToDelete ? '' : 's'}`}
        description={`Are you sure you want to delete ${itemToDelete ? `"${itemToDelete.name}"` : `the selected ${getSelectedCount()} items`}? This action cannot be undone.`}
      />

      <AddCaseFieldModal
        isOpen={isAddCaseFieldModalOpen}
        onClose={() => setIsAddCaseFieldModalOpen(false)}
        onAdd={(field) => {
          addCaseField(field);
          setIsAddCaseFieldModalOpen(false);
        }}
      />

      <EditCaseFieldModal
        isOpen={isEditCaseFieldModalOpen}
        onClose={() => setIsEditCaseFieldModalOpen(false)}
        onEdit={(id, field) => {
          updateCaseField(id, field);
          setIsEditCaseFieldModalOpen(false);
        }}
        initialData={selectedFieldForEdit}
      />

      <ViewCaseFieldPanel
        isOpen={isViewCaseFieldPanelOpen}
        onClose={() => setIsViewCaseFieldPanelOpen(false)}
        field={selectedFieldForView}
      />
      <AddTestStepTemplateModal
        isOpen={isAddTestStepTemplateModalOpen}
        onClose={() => setIsAddTestStepTemplateModalOpen(false)}
        onAdd={(template) => {
          addTestStepTemplate(template);
          setIsAddTestStepTemplateModalOpen(false);
        }}
      />

      <EditTestStepTemplateModal
        isOpen={isEditTestStepTemplateModalOpen}
        onClose={() => setIsEditTestStepTemplateModalOpen(false)}
        onEdit={(id, template) => {
          updateTestStepTemplate(id, template);
          setIsEditTestStepTemplateModalOpen(false);
        }}
        initialData={selectedTestStepTemplateForEdit}
      />

      <ViewTestStepTemplatePanel
        isOpen={isViewTestStepTemplatePanelOpen}
        onClose={() => setIsViewTestStepTemplatePanelOpen(false)}
        template={selectedTestStepTemplateForView}
      />

      <AddTestCaseTemplateModal
        isOpen={isAddTestCaseTemplateModalOpen}
        onClose={() => setIsAddTestCaseTemplateModalOpen(false)}
        onAdd={addTestCaseTemplate}
      />

      <EditTestCaseTemplateModal
        isOpen={isEditTestCaseTemplateModalOpen}
        onClose={() => setIsEditTestCaseTemplateModalOpen(false)}
        onEdit={updateTestCaseTemplate}
        initialData={selectedTestCaseTemplateForEdit}
      />

      <ViewTestCaseTemplatePanel
        isOpen={isViewTestCaseTemplatePanelOpen}
        onClose={() => setIsViewTestCaseTemplatePanelOpen(false)}
        template={selectedTestCaseTemplateForView}
      />
    </div>
  );
}
