import { SidePanel } from '@/components/ui/SidePanel';
import { TestCaseTemplate, useCustomizationStore } from '../store/useCustomizationStore';
import { Input } from '@/components/ui/Input';

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

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="View Test Case Template"
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
          <h3 className="text-sm font-medium text-text-muted mb-1">Test Step Template Configuration</h3>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {getTestStepTemplateName()}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-text mb-4">Test Case Details Layout Preview</h3>
          <div className="bg-background/50 p-6 rounded-xl border border-border/50">
            <div className="grid grid-cols-12 gap-4">
              {template.fields?.map(fieldConfig => {
                // Handle legacy string array or new object array
                const fieldId = typeof fieldConfig === 'string' ? fieldConfig : fieldConfig.id;
                const width = typeof fieldConfig === 'string' ? (fieldId === 'title' ? 12 : 6) : fieldConfig.width;
                
                const isBuiltIn = fieldId === 'title' || fieldId === 'directory';
                const field = isBuiltIn 
                  ? { id: fieldId, name: fieldId.charAt(0).toUpperCase() + fieldId.slice(1), type: 'Built-in' }
                  : caseFields.find(f => f.id === fieldId);
                
                if (!field) return null;

                const colSpanClass = `col-span-${width}`;

                return (
                  <div key={fieldId} className={colSpanClass} style={{ gridColumn: `span ${width} / span ${width}` }}>
                    <label className="block text-sm font-medium text-text mb-1">
                      {field.name}
                      {isBuiltIn && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {isBuiltIn ? (
                      <Input placeholder={`Enter ${field.name.toLowerCase()}`} readOnly />
                    ) : (
                      <div className="text-sm text-text-muted italic bg-surface p-2 rounded border border-border">
                        Custom Field ({field.type})
                      </div>
                    )}
                  </div>
                );
              })}
              {(!template.fields || template.fields.length === 0) && (
                <div className="col-span-12">
                  <p className="text-sm text-text-muted">No fields configured for this template.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
