import { SidePanel } from '@/components/ui/SidePanel';
import { TestStepTemplate, useCustomizationStore } from '../store/useCustomizationStore';
import { Input } from '@/components/ui/Input';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ViewTestStepTemplatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  template: TestStepTemplate | null;
}

export function ViewTestStepTemplatePanel({ isOpen, onClose, template }: ViewTestStepTemplatePanelProps) {
  const { testCaseTemplates } = useCustomizationStore();
  const [repeaterRows, setRepeaterRows] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isOpen) {
      setRepeaterRows({});
    }
  }, [isOpen, template]);

  if (!template) return null;

  const usedTemplates = testCaseTemplates.filter(t => template.testCaseTemplate?.includes(t.id));

  const renderPreview = () => {
    if (!template.fields || template.fields.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-text-muted text-sm p-6">
          No fields defined for this template.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {template.fields.map(field => (
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
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="View Test Step Template"
      defaultWidth={600}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-1">Template Name</h3>
          <p className="text-base text-text font-medium">{template.name}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-1">Description</h3>
          <p className="text-sm text-text bg-background p-3 rounded-md border border-border">
            {template.description || 'No description provided.'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-text-muted mb-2">Used in Test Case Templates</h3>
          {usedTemplates.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-text space-y-1">
              {usedTemplates.map(t => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">Not used in any templates.</p>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-text mb-4">Preview</h3>
          <div className="bg-background/50 p-6 rounded-xl border border-border/50">
            {renderPreview()}
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
