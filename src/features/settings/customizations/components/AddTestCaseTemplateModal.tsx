import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, LayoutTemplate, Plus, Trash2 } from 'lucide-react';
import { useCustomizationStore, TestCaseFieldConfig } from '../store/useCustomizationStore';
import { Section, reconstructSections, flattenSections } from '../utils/sectionUtils';
import { TestCaseTemplateEditor } from './TestCaseTemplateEditor';

interface AddTestCaseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (template: any) => void;
}

export function AddTestCaseTemplateModal({ isOpen, onClose, onAdd }: AddTestCaseTemplateModalProps) {
  const { caseFields, testStepTemplates } = useCustomizationStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [sections, setSections] = useState<Section[]>([]);
  
  const [testStepTemplateMode, setTestStepTemplateMode] = useState<'dynamic' | 'strict'>('dynamic');
  const [testStepTemplateId, setTestStepTemplateId] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [previewTestStepTemplateId, setPreviewTestStepTemplateId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      // Default layout: 1 full width row, 1 full width row
      setSections([
        { id: 'default-1', columns: 1, fields: ['title'] },
        { id: 'default-2', columns: 1, fields: ['directory'] }
      ]);
      setTestStepTemplateMode('dynamic');
      setTestStepTemplateId(testStepTemplates[0]?.id || '');
      setPreviewTestStepTemplateId('');
      setActiveTab('editor');
    }
  }, [isOpen, testStepTemplates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      description,
      fields: flattenSections(sections),
      testStepTemplateMode,
      testStepTemplateId: testStepTemplateMode === 'strict' ? testStepTemplateId : undefined
    });
    onClose();
  };

  const renderTestStepFields = (templateId: string) => {
    const template = testStepTemplates.find(t => t.id === templateId);
    if (!template) return null;
    
    return (
      <div className="space-y-4 mt-4 p-4 border border-border rounded-lg bg-background/50">
        {template.fields.map(field => {
          if (field.type === 'Repeater' && field.subFields) {
            return (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-text mb-1">{field.name}</label>
                <div className="border border-border rounded-md overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface border-b border-border text-text-muted">
                      <tr>
                        <th className="px-4 py-2 font-medium w-12">#</th>
                        {field.subFields.map(subField => (
                          <th key={subField.id} className="px-4 py-2 font-medium">{subField.name}</th>
                        ))}
                        <th className="px-4 py-2 font-medium w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="bg-background">
                        <td className="px-4 py-3 text-text-muted">1</td>
                        {field.subFields.map(subField => (
                          <td key={subField.id} className="px-4 py-3">
                            <textarea 
                              className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[60px]" 
                              placeholder={`Enter ${subField.name}`} 
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm" className="text-text-muted hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
              </div>
            );
          }

          return (
            <div key={field.id}>
              <label className="block text-sm font-medium text-text mb-1">{field.name}</label>
              {field.type === 'Text Area' ? (
                <textarea className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px]" placeholder={`Enter ${field.name}`} />
              ) : field.type === 'Checkbox' ? (
                <div className="flex items-center gap-2 h-9">
                  <input type="checkbox" className="rounded border-border text-primary bg-background" />
                  <span className="text-sm text-text">Check to enable</span>
                </div>
              ) : field.type === 'Dropdown' ? (
                <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm">
                  <option>Select option...</option>
                </select>
              ) : (
                <Input placeholder={`Enter ${field.name}`} className="bg-background" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-8">
        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text mb-4 border-b border-border pb-2">Test Case Details</h3>
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.id} className="grid gap-6" style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}>
                {section.fields.map((fieldId, index) => {
                  if (!fieldId) {
                    return <div key={index} className="min-h-[80px]" />; // Empty space for null fields
                  }

                  if (fieldId === 'directory') {
                    return (
                      <div key={`${section.id}-${index}`}>
                        <label className="block text-sm font-medium text-text mb-1">Directory</label>
                        <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm">
                          <option value="">Select directory...</option>
                          <option value="root">Root</option>
                          <option value="login">Authentication / Login</option>
                          <option value="checkout">E-commerce / Checkout</option>
                        </select>
                      </div>
                    );
                  }

                  const isBuiltIn = fieldId === 'title';
                  const field = isBuiltIn 
                    ? { id: fieldId, name: fieldId.charAt(0).toUpperCase() + fieldId.slice(1), type: 'string' }
                    : caseFields.find(f => f.id === fieldId);
                  
                  if (!field) return <div key={index} className="min-h-[80px]" />;

                  return (
                    <div key={`${section.id}-${index}`}>
                      <label className="block text-sm font-medium text-text mb-1">{field.name}</label>
                      {field.type === 'text' ? (
                        <textarea className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px]" placeholder={`Enter ${field.name}`} />
                      ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 h-9">
                          <input type="checkbox" className="rounded border-border text-primary bg-background" />
                          <span className="text-sm text-text">Check to enable</span>
                        </div>
                      ) : field.type === 'dropdown' ? (
                        <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm">
                          <option>Select option...</option>
                        </select>
                      ) : field.type === 'radio' ? (
                        <div className="flex gap-4 h-9 items-center">
                          <label className="flex items-center gap-2"><input type="radio" name={`radio-${field.id}`} /> Option 1</label>
                          <label className="flex items-center gap-2"><input type="radio" name={`radio-${field.id}`} /> Option 2</label>
                        </div>
                      ) : (
                        <Input placeholder={`Enter ${field.name}`} className="bg-background" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text mb-4 border-b border-border pb-2">Test Steps</h3>
          {testStepTemplateMode === 'dynamic' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Test Step Template</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm"
                  value={previewTestStepTemplateId}
                  onChange={(e) => setPreviewTestStepTemplateId(e.target.value)}
                >
                  <option value="">Select a template...</option>
                  {testStepTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              {previewTestStepTemplateId && renderTestStepFields(previewTestStepTemplateId)}
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                const template = testStepTemplates.find(t => t.id === testStepTemplateId);
                if (!template) {
                  return (
                    <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-background/50">
                      <p className="text-text-muted">No template selected.</p>
                    </div>
                  );
                }
                
                return renderTestStepFields(testStepTemplateId);
              })()}
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
      className="max-w-5xl w-full h-[90vh]"
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
      {/* Tabs - Fixed at top */}
      <div className="flex border-b border-border shrink-0 bg-surface sticky -top-4 z-10 -mx-6 px-6 pt-4 mb-6">
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

      <div>
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
                <TestCaseTemplateEditor sections={sections} onChange={setSections} />
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
    </Modal>
  );
}
