import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';
import { useTestCaseStore, TestCase } from '../store/useTestCaseStore';
import { useProjectStore } from '../store/useProjectStore';
import { useDirectoryStore } from '../store/useDirectoryStore';
import { useCustomizationStore } from '@/features/settings/customizations/store/useCustomizationStore';
import { useUserStore } from '@/features/settings/users/store/useUserStore';
import { useGroupStore } from '@/features/settings/users/store/useGroupStore';
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
  const { testCaseTemplates, caseFields, testStepTemplates, fetchCustomizations } = useCustomizationStore();
  const { users, fetchUsers } = useUserStore();
  const { groups, fetchGroups } = useGroupStore();

  const project = projects.find(p => p.id === projectId);
  const template = testCaseTemplates.find(t => t.id === project?.test_case_templates?.id);

  const [title, setTitle] = useState('');
  const [directory, setDirectory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [type, setType] = useState('Functional');
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [testStepTemplateId, setTestStepTemplateId] = useState<string>('');
  const [testStepsData, setTestStepsData] = useState<Record<string, any>>({});

  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

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
    if (isOpen) {
      fetchUsers();
      fetchGroups();
      fetchCustomizations();
    }
  }, [isOpen, fetchUsers, fetchGroups, fetchCustomizations]);

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
      setTestStepTemplateId(testCase.testStepTemplateId || template?.testStepTemplateId || '');
      setTestStepsData(testCase.testStepsData || {});
    } else {
      setTitle('');
      setDirectory('');
      setPriority('Medium');
      setType('Functional');
      setCustomFields({});
      setTestStepTemplateId(template?.testStepTemplateId || '');
      setTestStepsData({});
    }
    setIsDirty(false);
    setShowConfirmClose(false);
  }, [testCase, isOpen, template]);

  const handleFieldChange = (setter: any) => (value: any) => {
    setter(value);
    setIsDirty(true);
  };

  const handleClose = () => {
    if (isDirty && project?.enable_test_case_approval) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowConfirmClose(false);
    onClose();
  };

  const handleSubmit = async (e?: React.FormEvent, isDraft = false) => {
    if (e) e.preventDefault();
    
    let reviewStatus: any = undefined;
    if (project?.enable_test_case_approval) {
      reviewStatus = isDraft ? 'Draft' : 'Ready for Review';
    }

    const data = {
      projectId,
      title,
      directory: directory || 'Uncategorized',
      priority: customFields['cf5'] || customFields['cf6'] || priority,
      type: customFields['cf1'] || customFields['cf2'] || type,
      status: testCase?.status || 'Untested',
      reviewStatus: reviewStatus || testCase?.reviewStatus,
      customFields,
      testStepTemplateId,
      testStepsData,
    };

    if (testCase) {
      await updateTestCase(testCase.id, data);
    } else {
      await addTestCase(data);
    }
    setIsDirty(false);
    setShowConfirmClose(false);
    onClose();
  };

  const sections = useMemo(() => {
    return template ? reconstructSections(template.fields) : [];
  }, [template]);

  const renderTestStepFields = () => {
    if (!template) return null;

    let currentTemplateId = testStepTemplateId;
    
    // If dynamic, show a dropdown to select the template
    const isDynamic = template.testStepTemplateMode === 'dynamic';

    return (
      <div className="space-y-4 mt-6 pt-6 border-t border-border">
        <h3 className="text-lg font-medium text-text">Test Steps</h3>
        
        {isDynamic && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text mb-1">Select Test Step Template</label>
            <Select
              className="bg-background"
              value={currentTemplateId}
              onChange={(value) => {
                handleFieldChange(setTestStepTemplateId)(value);
                handleFieldChange(setTestStepsData)({}); // Reset data when template changes
              }}
              options={testStepTemplates.map(t => ({ value: t.id, label: t.name }))}
              placeholder="Select template..."
            />
          </div>
        )}

        {currentTemplateId && (() => {
          const tsTemplate = testStepTemplates.find(t => t.id === currentTemplateId);
          if (!tsTemplate) return null;

          return (
            <div className="space-y-6">
              {tsTemplate.fields.map(field => {
                if (field.type === 'Repeater' && field.subFields) {
                  const rows = testStepsData[field.id] || [];
                  
                  const addRow = () => {
                    const newRow = field.subFields!.reduce((acc, sf) => ({ ...acc, [sf.id]: '' }), {});
                    handleFieldChange(setTestStepsData)({
                      ...testStepsData,
                      [field.id]: [...rows, newRow]
                    });
                  };

                  const updateRow = (index: number, subFieldId: string, value: string) => {
                    const newRows = [...rows];
                    newRows[index] = { ...newRows[index], [subFieldId]: value };
                    handleFieldChange(setTestStepsData)({
                      ...testStepsData,
                      [field.id]: newRows
                    });
                  };

                  const removeRow = (index: number) => {
                    const newRows = rows.filter((_: any, i: number) => i !== index);
                    handleFieldChange(setTestStepsData)({
                      ...testStepsData,
                      [field.id]: newRows
                    });
                  };

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
                            {rows.length === 0 && (
                              <tr className="bg-background">
                                <td colSpan={field.subFields.length + 2} className="px-4 py-6 text-center text-text-muted">
                                  No steps added yet. Click "Add Step" to begin.
                                </td>
                              </tr>
                            )}
                            {rows.map((row: any, index: number) => (
                              <tr key={index} className="bg-background">
                                <td className="px-4 py-3 text-text-muted">{index + 1}</td>
                                {field.subFields!.map(subField => (
                                  <td key={subField.id} className="px-4 py-3">
                                    {subField.type === 'Text Area' ? (
                                      <textarea 
                                        className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[60px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                                        placeholder={`Enter ${subField.name}`} 
                                        value={row[subField.id] || ''}
                                        onChange={(e) => updateRow(index, subField.id, e.target.value)}
                                      />
                                    ) : (
                                      <Input 
                                        placeholder={`Enter ${subField.name}`} 
                                        className="bg-background" 
                                        value={row[subField.id] || ''}
                                        onChange={(e) => updateRow(index, subField.id, e.target.value)}
                                      />
                                    )}
                                  </td>
                                ))}
                                <td className="px-4 py-3 text-center">
                                  <Button type="button" variant="ghost" size="sm" className="text-text-muted hover:text-destructive" onClick={() => removeRow(index)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-2 text-text" onClick={addRow}>
                        <Plus className="w-4 h-4 mr-2 text-text" /> Add Step
                      </Button>
                    </div>
                  );
                }

                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-text mb-1">{field.name}</label>
                    {field.type === 'Text Area' ? (
                      <textarea 
                        className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text shadow-sm min-h-[80px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                        placeholder={`Enter ${field.name}`} 
                        value={testStepsData[field.id] || ''}
                        onChange={(e) => handleFieldChange(setTestStepsData)({ ...testStepsData, [field.id]: e.target.value })}
                      />
                    ) : field.type === 'Checkbox' ? (
                      <div className="flex items-center gap-2 h-9">
                        <input 
                          type="checkbox" 
                          className="rounded border-border text-primary bg-background" 
                          checked={!!testStepsData[field.id]}
                          onChange={(e) => handleFieldChange(setTestStepsData)({ ...testStepsData, [field.id]: e.target.checked })}
                        />
                        <span className="text-sm text-text">Check to enable</span>
                      </div>
                    ) : field.type === 'Dropdown' ? (
                      <Select
                        className="bg-background"
                        value={testStepsData[field.id] || ''}
                        onChange={(value) => handleFieldChange(setTestStepsData)({ ...testStepsData, [field.id]: value })}
                        options={[]} // Assuming options are not defined in TestStepField, but if they were, we'd map them here
                        placeholder="Select option..."
                      />
                    ) : (
                      <Input 
                        placeholder={`Enter ${field.name}`} 
                        className="bg-background" 
                        value={testStepsData[field.id] || ''}
                        onChange={(e) => handleFieldChange(setTestStepsData)({ ...testStepsData, [field.id]: e.target.value })}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={testCase ? 'Edit Test Case' : 'Create Test Case'}
        className="max-w-4xl"
        footer={
          <div className="text-text flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {project?.enable_test_case_approval && (
              <Button type="button" variant="outline" onClick={() => handleSubmit(undefined, true)}>
                Simpan sebagai Draft
              </Button>
            )}
            <Button type="submit" form="test-case-form">
              {testCase ? 'Save Changes' : 'Create Test Case'}
            </Button>
          </div>
        }
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
                          onChange={(e) => handleFieldChange(setTitle)(e.target.value)}
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
                        <Select
                          className="bg-background"
                          value={directory}
                          onChange={(value) => handleFieldChange(setDirectory)(value)}
                          options={directoryOptions.map(opt => ({
                            value: opt.id,
                            label: `${'\u00A0'.repeat(opt.level * 4)}${opt.name}`
                          }))}
                          placeholder="Select directory..."
                        />
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
                          onChange={(e) => handleFieldChange(setCustomFields)({ ...customFields, [fieldId]: e.target.value })}
                          placeholder={`Enter ${fieldConfig.name}`}
                        />
                      ) : fieldConfig.type === 'Checkbox' ? (
                        <div className="flex items-center gap-2 h-9">
                          <input
                            type="checkbox"
                            className="rounded border-border text-primary bg-background"
                            checked={!!customFields[fieldId]}
                            onChange={(e) => handleFieldChange(setCustomFields)({ ...customFields, [fieldId]: e.target.checked })}
                          />
                          <span className="text-sm text-text">Check to enable</span>
                        </div>
                      ) : fieldConfig.type === 'Dropdown' ? (
                        <Select
                          className="bg-background"
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(value) => handleFieldChange(setCustomFields)({ ...customFields, [fieldId]: value })}
                          options={fieldConfig.options?.map(opt => ({ value: opt, label: opt })) || []}
                          placeholder="Select option..."
                        />
                      ) : fieldConfig.type === 'User' ? (
                        <Select
                          className="bg-background"
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(value) => handleFieldChange(setCustomFields)({ ...customFields, [fieldId]: value })}
                          options={users.map(user => ({ value: user.id, label: user.name }))}
                          placeholder="Select user..."
                        />
                      ) : fieldConfig.type === 'Group' ? (
                        <Select
                          className="bg-background"
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(value) => handleFieldChange(setCustomFields)({ ...customFields, [fieldId]: value })}
                          options={groups.map(group => ({ value: group.id, label: group.name }))}
                          placeholder="Select group..."
                        />
                      ) : (
                        <Input
                          required={fieldConfig.required}
                          value={customFields[fieldId] || ''}
                          onChange={(e) => handleFieldChange(setCustomFields)({ ...customFields, [fieldId]: e.target.value })}
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
                    onChange={(e) => handleFieldChange(setTitle)(e.target.value)}
                    placeholder="Enter test case title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Suite / Directory</label>
                  <Select
                    className="bg-surface"
                    value={directory}
                    onChange={(value) => handleFieldChange(setDirectory)(value)}
                    options={directoryOptions.map(opt => ({
                      value: opt.id,
                      label: `${'\u00A0'.repeat(opt.level * 4)}${opt.name}`
                    }))}
                    placeholder="Select directory..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Priority</label>
                  <Select
                    className="bg-surface"
                    value={priority}
                    onChange={(value) => handleFieldChange(setPriority)(value)}
                    options={[
                      { value: 'Critical', label: 'Critical' },
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' }
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Type</label>
                  <Select
                    className="bg-surface"
                    value={type}
                    onChange={(value) => handleFieldChange(setType)(value)}
                    options={[
                      { value: 'Functional', label: 'Functional' },
                      { value: 'Performance', label: 'Performance' },
                      { value: 'Security', label: 'Security' },
                      { value: 'Usability', label: 'Usability' }
                    ]}
                  />
                </div>
              </div>
            )}
            
            {renderTestStepFields()}
          </div>
        </form>
      </div>
    </Modal>

    <Modal
      isOpen={showConfirmClose}
      onClose={() => setShowConfirmClose(false)}
      title="Perubahan Belum Disimpan"
      className="max-w-md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowConfirmClose(false)}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirmDiscard}>
            Buang Perubahan
          </Button>
          <Button onClick={() => handleSubmit(undefined, true)}>
            Simpan sebagai Draft
          </Button>
        </div>
      }
    >
      <p className="text-text">
        Anda memiliki perubahan yang belum disimpan. Apakah Anda ingin membuang perubahan ini atau menyimpannya sebagai draft?
      </p>
    </Modal>
    </>
  );
}
