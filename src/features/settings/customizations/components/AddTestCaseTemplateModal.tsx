import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, ChevronUp, ChevronDown, Eye, LayoutTemplate } from 'lucide-react';
import { useCustomizationStore, TestCaseFieldConfig } from '../store/useCustomizationStore';

interface AddTestCaseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (template: any) => void;
}

export function AddTestCaseTemplateModal({ isOpen, onClose, onAdd }: AddTestCaseTemplateModalProps) {
  const { caseFields, testStepTemplates } = useCustomizationStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // 'title' and 'directory' are built-in and always present
  const [selectedFields, setSelectedFields] = useState<TestCaseFieldConfig[]>([
    { id: 'title', width: 12 },
    { id: 'directory', width: 6 }
  ]);
  
  const [testStepTemplateMode, setTestStepTemplateMode] = useState<'dynamic' | 'strict'>('dynamic');
  const [testStepTemplateId, setTestStepTemplateId] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setSelectedFields([
        { id: 'title', width: 12 },
        { id: 'directory', width: 6 }
      ]);
      setTestStepTemplateMode('dynamic');
      setTestStepTemplateId(testStepTemplates[0]?.id || '');
      setActiveTab('editor');
    }
  }, [isOpen, testStepTemplates]);

  const handleAddField = (fieldId: string) => {
    if (!selectedFields.find(f => f.id === fieldId)) {
      setSelectedFields([...selectedFields, { id: fieldId, width: 6 }]);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    if (fieldId !== 'title' && fieldId !== 'directory') {
      setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
    }
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...selectedFields];
    if (direction === 'up' && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    }
    setSelectedFields(newFields);
  };

  const handleUpdateFieldWidth = (id: string, width: number) => {
    setSelectedFields(selectedFields.map(f => f.id === id ? { ...f, width } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      description,
      fields: selectedFields,
      testStepTemplateMode,
      testStepTemplateId: testStepTemplateMode === 'strict' ? testStepTemplateId : undefined
    });
    onClose();
  };

  const availableFields = caseFields.filter(f => !selectedFields.find(sf => sf.id === f.id));

  const renderPreview = () => {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text mb-4 border-b border-border pb-2">Test Case Details</h3>
          <div className="grid grid-cols-12 gap-6">
            {selectedFields.map((fieldConfig) => {
              const isBuiltIn = fieldConfig.id === 'title' || fieldConfig.id === 'directory';
              const field = isBuiltIn 
                ? { id: fieldConfig.id, name: fieldConfig.id.charAt(0).toUpperCase() + fieldConfig.id.slice(1), type: 'string' }
                : caseFields.find(f => f.id === fieldConfig.id);
              
              if (!field) return null;

              const colSpanClass = `col-span-${fieldConfig.width}`;

              return (
                <div key={fieldConfig.id} className={colSpanClass} style={{ gridColumn: `span ${fieldConfig.width} / span ${fieldConfig.width}` }}>
                  <label className="block text-sm font-medium text-text mb-1">{field.name}</label>
                  {field.type === 'text' ? (
                    <textarea className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px]" readOnly placeholder={`Enter ${field.name}`} />
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 h-9">
                      <input type="checkbox" className="rounded border-border text-primary bg-background" readOnly />
                      <span className="text-sm text-text">Check to enable</span>
                    </div>
                  ) : field.type === 'dropdown' ? (
                    <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm" disabled>
                      <option>Select option...</option>
                    </select>
                  ) : field.type === 'radio' ? (
                    <div className="flex gap-4 h-9 items-center">
                      <label className="flex items-center gap-2"><input type="radio" disabled /> Option 1</label>
                      <label className="flex items-center gap-2"><input type="radio" disabled /> Option 2</label>
                    </div>
                  ) : (
                    <Input placeholder={`Enter ${field.name}`} readOnly className="bg-background" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text mb-4 border-b border-border pb-2">Test Steps</h3>
          {testStepTemplateMode === 'dynamic' ? (
            <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-background/50">
              <p className="text-text-muted">User will select a Test Step Template when creating a Test Case.</p>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-background/50">
              <p className="text-text-muted">
                Using fixed template: <span className="font-medium text-text">{testStepTemplates.find(t => t.id === testStepTemplateId)?.name || 'None selected'}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Test Case Template" 
      className="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="text-text">
            Cancel
          </Button>
          <Button type="submit" form="add-test-case-template-form" disabled={!name}>
            Add Template
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6 shrink-0">
          <button 
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'editor' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
            onClick={() => setActiveTab('editor')}
          >
            <LayoutTemplate className="h-4 w-4" />
            Editor
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {activeTab === 'editor' ? (
            <form id="add-test-case-template-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Standard UI Test"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Descriptions
                  </label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this template"
                  />
                </div>
              </div>

              {/* Test Case Details Configuration */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-text">Test Case Details Configuration</h3>
                  <p className="text-sm text-text-muted">Add and arrange fields to customize the layout of the test case details section.</p>
                </div>
                
                <div className="flex gap-3">
                  <select 
                    className="flex-1 h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm focus:ring-1 focus:ring-primary outline-none"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddField(e.target.value);
                        e.target.value = ''; // Reset select
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>+ Add Field</option>
                    {availableFields.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {selectedFields.map((fieldConfig, index) => {
                    const isBuiltIn = fieldConfig.id === 'title' || fieldConfig.id === 'directory';
                    const field = isBuiltIn 
                      ? { id: fieldConfig.id, name: fieldConfig.id.charAt(0).toUpperCase() + fieldConfig.id.slice(1) + ' (Built-in)', type: 'Built-in' }
                      : caseFields.find(f => f.id === fieldConfig.id);
                    
                    if (!field) return null;

                    return (
                      <div key={fieldConfig.id} className="flex items-center justify-between bg-surface border border-border rounded-md p-3">
                        <span className="text-sm font-medium text-text flex-1">{field.name}</span>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted">Width:</span>
                            <select
                              value={fieldConfig.width}
                              onChange={(e) => handleUpdateFieldWidth(fieldConfig.id, Number(e.target.value))}
                              className="h-8 rounded-md border border-border bg-background px-2 py-1 text-xs text-text shadow-sm focus:ring-1 focus:ring-primary outline-none"
                            >
                              <option value={12}>Full Width</option>
                              <option value={6}>1/2 Width</option>
                              <option value={4}>1/3 Width</option>
                              <option value={3}>1/4 Width</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1 border-l border-border pl-4">
                            <button 
                              type="button"
                              onClick={() => handleMoveField(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-text-muted hover:text-text hover:bg-background rounded disabled:opacity-50"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleMoveField(index, 'down')}
                              disabled={index === selectedFields.length - 1}
                              className="p-1 text-text-muted hover:text-text hover:bg-background rounded disabled:opacity-50"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleRemoveField(fieldConfig.id)}
                              disabled={isBuiltIn}
                              className="p-1 text-text-muted hover:text-red-500 rounded ml-2 disabled:opacity-50 flex items-center gap-1"
                              title={isBuiltIn ? "Built-in fields cannot be removed" : "Remove field"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test Step Details Configuration */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-text">Test Step Details Configuration</h3>
                  <p className="text-sm text-text-muted">Configure how test steps will be added to this test case.</p>
                </div>

                <div className="bg-[#0A0A1B] border border-border/20 rounded-xl p-6 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="testStepTemplateMode"
                      checked={testStepTemplateMode === 'dynamic'}
                      onChange={() => setTestStepTemplateMode('dynamic')}
                      className="text-primary focus:ring-primary bg-transparent border-white/30 w-4 h-4"
                    />
                    <span className="text-sm text-white font-medium">Dynamic (User selects when creating Test Case)</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="testStepTemplateMode"
                      checked={testStepTemplateMode === 'strict'}
                      onChange={() => setTestStepTemplateMode('strict')}
                      className="text-primary focus:ring-primary bg-transparent border-white/30 w-4 h-4"
                    />
                    <span className="text-sm text-white font-medium">Strict (Fixed template)</span>
                  </label>

                  {testStepTemplateMode === 'strict' && (
                    <div className="pl-7 pt-2">
                      <label className="block text-sm font-medium text-white/80 mb-2">Select Test Step Template</label>
                      <select
                        value={testStepTemplateId}
                        onChange={(e) => setTestStepTemplateId(e.target.value)}
                        className="flex h-10 w-full md:w-1/2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {testStepTemplates.map(t => (
                          <option key={t.id} value={t.id} className="bg-[#0A0A1B]">{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </form>
          ) : (
            renderPreview()
          )}
        </div>
      </div>
    </Modal>
  );
}
