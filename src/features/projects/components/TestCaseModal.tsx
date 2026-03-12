import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useTestCaseStore, TestCase } from '../store/useTestCaseStore';
import { useProjectStore } from '../store/useProjectStore';
import { useDirectoryStore } from '../store/useDirectoryStore';
import { useCustomizationStore } from '@/features/settings/customizations/store/useCustomizationStore';
import { reconstructSections } from '@/features/settings/customizations/utils/sectionUtils';

interface TestCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  testCase?: TestCase;
}

export function TestCaseModal({ isOpen, onClose, projectId, testCase }: TestCaseModalProps) {
  const { addTestCase, updateTestCase } = useTestCaseStore();
  const { projects } = useProjectStore();
  const { directories } = useDirectoryStore();
  const { testCaseTemplates, caseFields } = useCustomizationStore();

  const project = projects.find(p => p.id === projectId);
  const template = testCaseTemplates.find(t => t.id === project?.test_case_templates?.id);

  const [title, setTitle] = useState('');
  const [directory, setDirectory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [type, setType] = useState('Functional');
  const [customFields, setCustomFields] = useState<Record<string, any>>({});

  const projectDirs = useMemo(() => directories.filter(d => d.projectId === projectId), [directories, projectId]);

  // Build a flat list of directories with indentation for the select dropdown
  const directoryOptions = useMemo(() => {
    const options: { id: string; name: string; level: number }[] = [];
    const buildTree = (parentId: string | null, level: number) => {
      const children = projectDirs.filter(d => d.parentId === parentId);
      children.forEach(child => {
        options.push({ id: child.id, name: child.name, level });
        buildTree(child.id, level + 1);
      });
    };
    buildTree(null, 0);
    return options;
  }, [projectDirs]);

  useEffect(() => {
    if (testCase) {
      setTitle(testCase.title);
      setDirectory(testCase.directory || '');
      setPriority(testCase.priority);
      setType(testCase.type);
      
      // Map legacy fields to custom fields if they don't exist
      const initialCustomFields = { ...testCase.customFields };
      if (!initialCustomFields['cf1'] && !initialCustomFields['cf2']) {
        if (template?.fields.some(f => f.id === 'cf1')) initialCustomFields['cf1'] = testCase.type;
        if (template?.fields.some(f => f.id === 'cf2')) initialCustomFields['cf2'] = testCase.type;
      }
      if (!initialCustomFields['cf5'] && !initialCustomFields['cf6']) {
        if (template?.fields.some(f => f.id === 'cf5')) initialCustomFields['cf5'] = testCase.priority;
        if (template?.fields.some(f => f.id === 'cf6')) initialCustomFields['cf6'] = testCase.priority;
      }
      
      setCustomFields(initialCustomFields);
    } else {
      setTitle('');
      setDirectory('');
      setPriority('Medium');
      setType('Functional');
      setCustomFields({});
    }
  }, [testCase, isOpen, template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      projectId,
      title,
      directory: directory || 'Uncategorized',
      priority: customFields['cf5'] || customFields['cf6'] || priority,
      type: customFields['cf1'] || customFields['cf2'] || type,
      status: testCase?.status || 'Untested',
      customFields,
    };

    if (testCase) {
      await updateTestCase(testCase.id, data);
    } else {
      await addTestCase(data);
    }
    onClose();
  };

  const sections = template ? reconstructSections(template.fields) : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={testCase ? 'Edit Test Case' : 'Create Test Case'}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <form id="test-case-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {sections.length > 0 ? sections.map(section => (
              <div key={section.id} className="grid gap-6" style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}>
                {section.fields.map((fieldId, index) => {
                  if (!fieldId) {
                    return <div key={index} className="min-h-[80px]" />;
                  }

                  if (fieldId === 'title') {
                    return (
                      <div key={`${section.id}-${index}`}>
                        <label className="block text-sm font-medium text-text mb-1">Title <span className="text-red-500">*</span></label>
                        <Input
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter test case title"
                          className="bg-background"
                        />
                      </div>
                    );
                  }

                  if (fieldId === 'directory') {
                    return (
                      <div key={`${section.id}-${index}`}>
                        <label className="block text-sm font-medium text-text mb-1">Directory</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          value={directory}
                          onChange={(e) => setDirectory(e.target.value)}
                        >
                          <option value="">Select directory...</option>
                          {directoryOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>
                              {'\u00A0'.repeat(opt.level * 4)}{opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  const fieldConfig = caseFields.find(cf => cf.id === fieldId);
                  if (!fieldConfig) return <div key={index} className="min-h-[80px]" />;

                  return (
                    <div key={`${section.id}-${index}`}>
                      <label className="block text-sm font-medium text-text mb-1">
                        {fieldConfig.name} {fieldConfig.required && <span className="text-red-500">*</span>}
                      </label>
                      {fieldConfig.type === 'Text' || fieldConfig.type === 'Textarea' ? (
                        <textarea
                          className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(e) => setCustomFields({ ...customFields, [fieldId]: e.target.value })}
                          placeholder={`Enter ${fieldConfig.name}`}
                        />
                      ) : fieldConfig.type === 'Checkbox' ? (
                        <div className="flex items-center gap-2 h-9">
                          <input
                            type="checkbox"
                            className="rounded border-border text-primary bg-background"
                            checked={!!customFields[fieldId]}
                            onChange={(e) => setCustomFields({ ...customFields, [fieldId]: e.target.checked })}
                          />
                          <span className="text-sm text-text">Check to enable</span>
                        </div>
                      ) : fieldConfig.type === 'Dropdown' ? (
                        <select
                          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(e) => setCustomFields({ ...customFields, [fieldId]: e.target.value })}
                        >
                          <option value="">Select option...</option>
                          {fieldConfig.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(e) => setCustomFields({ ...customFields, [fieldId]: e.target.value })}
                          placeholder={`Enter ${fieldConfig.name}`}
                          className="bg-background"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-text">Title <span className="text-red-500">*</span></label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter test case title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Suite / Directory</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={directory}
                    onChange={(e) => setDirectory(e.target.value)}
                  >
                    <option value="">Select directory...</option>
                    {directoryOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {'\u00A0'.repeat(opt.level * 4)}{opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Priority</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Type</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Functional">Functional</option>
                    <option value="Performance">Performance</option>
                    <option value="Security">Security</option>
                    <option value="Usability">Usability</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {testCase ? 'Save Changes' : 'Create Test Case'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
