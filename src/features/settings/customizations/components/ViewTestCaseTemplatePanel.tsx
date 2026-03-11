import { SidePanel } from '@/components/ui/SidePanel';
import { TestCaseTemplate, useCustomizationStore, TestCaseFieldConfig } from '../store/useCustomizationStore';
import { Input } from '@/components/ui/Input';
import { reconstructSections } from '../utils/sectionUtils';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface ViewTestCaseTemplatePanelProps {
  isOpen: boolean;
  onClose: () => void;
  template: TestCaseTemplate | null;
}

export function ViewTestCaseTemplatePanel({ isOpen, onClose, template }: ViewTestCaseTemplatePanelProps) {
  const { caseFields, testStepTemplates } = useCustomizationStore();

  if (!template) return null;

  const getTestStepTemplateName = () => {
    if (template.testStepTemplateMode === 'dynamic') return 'Dynamic (User selects)';
    const tsTemplate = testStepTemplates.find(t => t.id === template.testStepTemplateId);
    return tsTemplate ? `Strict: ${tsTemplate.name}` : 'Strict: Unknown Template';
  };

  const normalizedFields = template.fields?.map((f, index) => 
    typeof f === 'string' ? { id: f, width: f === 'title' || f === 'directory' ? 12 : 6, section: index + 1, column: 1 } : f
  ) as TestCaseFieldConfig[] || [];
  const sections = reconstructSections(normalizedFields);

  const renderTestStepFields = (templateId: string) => {
    const tsTemplate = testStepTemplates.find(t => t.id === templateId);
    if (!tsTemplate) return null;
    
    return (
      <div className="space-y-4 mt-4 p-4 border border-border rounded-lg bg-background/50">
        {tsTemplate.fields.map(field => {
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
                              readOnly
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm" className="text-text-muted hover:text-destructive" disabled>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button variant="outline" size="sm" className="mt-2" disabled>
                  <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
              </div>
            );
          }

          return (
            <div key={field.id}>
              <label className="block text-sm font-medium text-text mb-1">{field.name}</label>
              {field.type === 'Text Area' ? (
                <textarea className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px]" placeholder={`Enter ${field.name}`} readOnly />
              ) : field.type === 'Checkbox' ? (
                <div className="flex items-center gap-2 h-9">
                  <input type="checkbox" className="rounded border-border text-primary bg-background" disabled />
                  <span className="text-sm text-text">Check to enable</span>
                </div>
              ) : field.type === 'Dropdown' ? (
                <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm" disabled>
                  <option>Select option...</option>
                </select>
              ) : (
                <Input placeholder={`Enter ${field.name}`} className="bg-background" readOnly />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="View Test Case Template"
      defaultWidth={800}
    >
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Template Name</h3>
            <p className="text-base text-text font-medium">{template.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Test Step Template Configuration</h3>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
              {getTestStepTemplateName()}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-1">Description</h3>
          <p className="text-sm text-text bg-background p-3 rounded-md border border-border">
            {template.description || 'No description provided.'}
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-text mb-4">Test Case Details Layout Preview</h3>
          <div className="bg-background/50 p-6 rounded-xl border border-border/50">
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
                          <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm" disabled>
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
                          <textarea className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px]" placeholder={`Enter ${field.name}`} readOnly />
                        ) : field.type === 'checkbox' ? (
                          <div className="flex items-center gap-2 h-9">
                            <input type="checkbox" className="rounded border-border text-primary bg-background" disabled />
                            <span className="text-sm text-text">Check to enable</span>
                          </div>
                        ) : field.type === 'dropdown' ? (
                          <select className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm" disabled>
                            <option>Select option...</option>
                          </select>
                        ) : field.type === 'radio' ? (
                          <div className="flex gap-4 h-9 items-center">
                            <label className="flex items-center gap-2"><input type="radio" name={`radio-${field.id}`} disabled /> Option 1</label>
                            <label className="flex items-center gap-2"><input type="radio" name={`radio-${field.id}`} disabled /> Option 2</label>
                          </div>
                        ) : (
                          <Input placeholder={`Enter ${field.name}`} className="bg-background" readOnly />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {sections.length === 0 && (
                <div className="col-span-12">
                  <p className="text-sm text-text-muted">No fields configured for this template.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-text mb-4">Test Step Details Layout Preview</h3>
          <div className="bg-background/50 p-6 rounded-xl border border-border/50">
            {template.testStepTemplateMode === 'dynamic' ? (
              <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-background/50">
                <p className="text-text-muted">Dynamic Mode: The user will select a Test Step Template when creating a Test Case.</p>
              </div>
            ) : template.testStepTemplateId ? (
              renderTestStepFields(template.testStepTemplateId)
            ) : (
              <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-background/50">
                <p className="text-text-muted">No test step template selected.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
