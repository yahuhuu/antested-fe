import { SidePanel } from '@/components/ui/SidePanel';
import { CaseField, useCustomizationStore } from '../store/useCustomizationStore';
import { Input } from '@/components/ui/Input';

interface ViewCaseFieldPanelProps {
  isOpen: boolean;
  onClose: () => void;
  field: CaseField | null;
}

export function ViewCaseFieldPanel({ isOpen, onClose, field }: ViewCaseFieldPanelProps) {
  const { testCaseTemplates } = useCustomizationStore();

  if (!field) return null;

  const usedTemplates = testCaseTemplates.filter(t => field.testCaseTemplate?.includes(t.id));

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      title="View Case Field"
      defaultWidth={500}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-1">Field Name</h3>
          <p className="text-base text-text font-medium">{field.name}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-1">Description</h3>
          <p className="text-sm text-text bg-background p-3 rounded-md border border-border">
            {field.description || 'No description provided.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Type</h3>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {field.type}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-1">Required</h3>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${field.required ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
              {field.required ? 'Yes' : 'No'}
            </div>
          </div>
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
            {field.type.toLowerCase() !== 'checkbox' && (
              <>
                <label className="block text-sm font-medium text-text mb-2">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-text-muted mb-2">{field.description}</p>
                )}
              </>
            )}
            
            {/* Simple preview based on type */}
            {(() => {
              const typeLower = field.type.toLowerCase();
              if (typeLower.includes('number')) {
                return <Input type="number" placeholder={field.placeholder} defaultValue={field.defaultValue} min={field.allowNegative ? undefined : "0"} />;
              }
              if (typeLower.includes('string') || typeLower.includes('url')) {
                return <Input type="text" placeholder={field.placeholder} defaultValue={field.defaultValue} />;
              }
              if (typeLower.includes('text')) {
                return <textarea className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-muted min-h-[80px]" placeholder={field.placeholder} defaultValue={field.defaultValue} />;
              }
              if (typeLower.includes('checkbox')) {
                return (
                  <div className="flex items-start gap-2">
                    <input type="checkbox" defaultChecked={field.checkedByDefault} className="rounded border-border text-primary bg-surface mt-1" />
                    <div>
                      <span className="text-sm font-medium text-text">
                        {field.name || 'Checkbox Label'}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      {field.description && (
                        <p className="text-xs text-text-muted">{field.description}</p>
                      )}
                    </div>
                  </div>
                );
              }
              if (typeLower.includes('date')) {
                return <Input type={field.dateType === 'date_time' ? 'datetime-local' : 'date'} />;
              }
              if (typeLower.includes('dropdown')) {
                return (
                  <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm">
                    {field.options?.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                );
              }
              if (typeLower.includes('user') || typeLower.includes('group')) {
                return (
                  <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm">
                    <option>Select Option...</option>
                  </select>
                );
              }
              if (typeLower.includes('radio')) {
                return (
                  <div className="space-y-2">
                    {field.options?.map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2">
                        <input type="radio" name="preview-radio" className="text-primary" />
                        <span className="text-sm text-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                );
              }
              return <Input />;
            })()}
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
