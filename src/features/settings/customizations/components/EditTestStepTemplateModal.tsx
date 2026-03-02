import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { TestStepTemplate, TestStepField } from '../store/useCustomizationStore';

interface EditTestStepTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, template: Partial<TestStepTemplate>) => void;
  initialData: TestStepTemplate | null;
}

const FIELD_TYPES = ['Text Area', 'Repeater', 'String'];

export function EditTestStepTemplateModal({ isOpen, onClose, onEdit, initialData }: EditTestStepTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<TestStepField[]>([]);
  const [repeaterRows, setRepeaterRows] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setFields(initialData.fields || []);
      setRepeaterRows({});
    }
  }, [isOpen, initialData]);

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: Math.random().toString(36).substring(2, 9), name: 'New Field', type: 'Text Area' }
    ]);
  };

  const handleUpdateField = (id: string, updates: Partial<TestStepField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    if (direction === 'up' && index > 0) {
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    } else if (direction === 'down' && index < newFields.length - 1) {
      [newFields[index + 1], newFields[index]] = [newFields[index], newFields[index + 1]];
    }
    setFields(newFields);
  };

  const handleAddSubField = (parentId: string) => {
    setFields(fields.map(f => {
      if (f.id === parentId) {
        return {
          ...f,
          subFields: [
            ...(f.subFields || []),
            { id: Math.random().toString(36).substring(2, 9), name: 'New Field', type: 'Text Area' }
          ]
        };
      }
      return f;
    }));
  };

  const handleUpdateSubField = (parentId: string, subId: string, updates: Partial<TestStepField>) => {
    setFields(fields.map(f => {
      if (f.id === parentId) {
        return {
          ...f,
          subFields: f.subFields?.map(sf => sf.id === subId ? { ...sf, ...updates } : sf)
        };
      }
      return f;
    }));
  };

  const handleDeleteSubField = (parentId: string, subId: string) => {
    setFields(fields.map(f => {
      if (f.id === parentId) {
        return {
          ...f,
          subFields: f.subFields?.filter(sf => sf.id !== subId)
        };
      }
      return f;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onEdit(initialData.id, {
        name,
        description,
        fields
      });
    }
    onClose();
  };

  const renderPreview = () => {
    if (fields.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-text-muted text-sm">
          Add fields to see preview
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {fields.map(field => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-text">{field.name}</label>
            {field.type === 'Text Area' && (
              <textarea 
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-muted min-h-[80px]"
                placeholder={`Enter ${field.name}`}
                readOnly
              />
            )}
            {field.type === 'String' && (
              <Input placeholder={`Enter ${field.name}`} readOnly />
            )}
            {field.type === 'Repeater' && (
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface border-b border-border text-text-muted">
                    <tr>
                      <th className="w-8 px-4 py-2">#</th>
                      {field.subFields?.map(sf => (
                        <th key={sf.id} className="px-4 py-2 font-medium">{sf.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-background">
                    {Array.from({ length: repeaterRows[field.id] || 1 }).map((_, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/50">
                        <td className="px-4 py-3 text-text-muted">{rowIndex + 1}</td>
                        {field.subFields?.map(sf => (
                          <td key={sf.id} className="px-4 py-2">
                            {sf.type === 'Text Area' ? (
                              <textarea className="w-full bg-surface border border-border rounded p-2 text-sm min-h-[40px]" readOnly />
                            ) : (
                              <input type="text" className="w-full bg-surface border border-border rounded p-2 text-sm" readOnly />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-2 bg-surface border-t border-border">
                  <button 
                    type="button" 
                    className="text-sm text-primary hover:text-primary-hover flex items-center"
                    onClick={() => setRepeaterRows(prev => ({ ...prev, [field.id]: (prev[field.id] || 1) + 1 }))}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Step
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Test Step Template" 
      className="max-w-5xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="text-text">
            Cancel
          </Button>
          <Button type="submit" form="edit-test-step-template-form" disabled={!name}>
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] overflow-hidden">
        {/* Form Details */}
        <div className="flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
          <form id="edit-test-step-template-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Standard Step"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Description
                </label>
                <textarea
                  className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-muted min-h-[80px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-text mb-3">Fields</h3>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-surface border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Input 
                        value={field.name}
                        onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                        className="flex-1"
                      />
                      <select 
                        className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm w-40"
                        value={field.type}
                        onChange={(e) => handleUpdateField(field.id, { type: e.target.value })}
                      >
                        {FIELD_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1">
                        <button 
                          type="button"
                          onClick={() => handleMoveField(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-text-muted hover:text-text hover:bg-background rounded disabled:opacity-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleMoveField(index, 'down')}
                          disabled={index === fields.length - 1}
                          className="p-1.5 text-text-muted hover:text-text hover:bg-background rounded disabled:opacity-50"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteField(field.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded ml-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {field.type === 'Repeater' && (
                      <div className="pl-4 border-l-2 border-border/50 space-y-3 mt-3">
                        {field.subFields?.map(sf => (
                          <div key={sf.id} className="flex items-center gap-3">
                            <Input 
                              value={sf.name}
                              onChange={(e) => handleUpdateSubField(field.id, sf.id, { name: e.target.value })}
                              className="flex-1 bg-background"
                            />
                            <button 
                              type="button"
                              onClick={() => handleDeleteSubField(field.id, sf.id)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddSubField(field.id)}
                          className="text-sm text-primary hover:text-primary-hover flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add sub-field
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddField}
                  className="w-full py-3 border-2 border-dashed border-border rounded-lg text-text-muted hover:text-text hover:border-text-muted transition-colors flex items-center justify-center text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="flex flex-col h-full bg-background/50 rounded-xl border border-border/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 bg-surface/50">
            <h3 className="text-sm font-medium text-text">Preview</h3>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {renderPreview()}
          </div>
        </div>
      </div>
    </Modal>
  );
}
