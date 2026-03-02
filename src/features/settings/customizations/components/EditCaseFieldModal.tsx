import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { CaseField } from '../store/useCustomizationStore';

interface EditCaseFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, field: Partial<CaseField>) => void;
  initialData: CaseField | null;
}

const FIELD_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'url', label: 'URL' },
  { value: 'user', label: 'User' },
  { value: 'group', label: 'Group' },
];

const DATE_ONLY_FORMATS = [
  'DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD',
  'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD',
  'DD.MM.YYYY', 'MM.DD.YYYY', 'YYYY.MM.DD',
  'DD MMM YYYY', 'MMM DD, YYYY', 'YYYY MMM DD'
];

const DATE_TIME_FORMATS = [
  'DD-MM-YYYY HH:mm:ss', 'MM-DD-YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss',
  'DD/MM/YYYY HH:mm:ss', 'MM/DD/YYYY HH:mm:ss', 'YYYY/MM/DD HH:mm:ss',
  'DD.MM.YYYY HH:mm:ss', 'MM.DD.YYYY HH:mm:ss', 'YYYY.MM.DD HH:mm:ss',
  'DD MMM YYYY HH:mm:ss', 'MMM DD, YYYY HH:mm:ss', 'YYYY MMM DD HH:mm:ss',
  'DD-MM-YYYY HH:mm', 'MM-DD-YYYY HH:mm', 'YYYY-MM-DD HH:mm',
  'DD/MM/YYYY HH:mm', 'MM/DD/YYYY HH:mm', 'YYYY/MM/DD HH:mm',
  'DD.MM.YYYY HH:mm', 'MM.DD.YYYY HH:mm', 'YYYY.MM.DD HH:mm',
  'DD MMM YYYY HH:mm', 'MMM DD, YYYY HH:mm', 'YYYY MMM DD HH:mm'
];

const formatDateString = (date: Date, formatStr: string) => {
  // Convert user-friendly format to date-fns format
  const dateFnsFormat = formatStr
    .replace(/YYYY/g, 'yyyy')
    .replace(/DD/g, 'dd');
  try {
    return format(date, dateFnsFormat);
  } catch (e) {
    return 'Invalid Format';
  }
};

export function EditCaseFieldModal({ isOpen, onClose, onEdit, initialData }: EditCaseFieldModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    required: false,
    type: 'string',
    placeholder: '',
    defaultValue: '',
    minChars: '',
    maxChars: '',
    allowNegative: false,
    checkedByDefault: false,
    dateType: 'date_only',
    dateFormat: 'DD-MM-YYYY',
    options: ['Sample Option 1', 'Sample Option 2'],
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (initialData && isOpen) {
      const typeValue = FIELD_TYPES.find(t => t.label === initialData.type)?.value || 'string';
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        required: initialData.required || false,
        type: typeValue,
        placeholder: initialData.placeholder || '',
        defaultValue: initialData.defaultValue || '',
        minChars: initialData.minChars || '',
        maxChars: initialData.maxChars || '',
        allowNegative: initialData.allowNegative || false,
        checkedByDefault: initialData.checkedByDefault || false,
        dateType: initialData.dateType || 'date_only',
        dateFormat: initialData.dateFormat || 'DD-MM-YYYY',
        options: initialData.options || ['Sample Option 1', 'Sample Option 2'],
      });
      setSelectedDate(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (field: string, value: any) => {
    if (field === 'type') {
      setFormData((prev) => ({
        ...prev,
        type: value,
        placeholder: '',
        defaultValue: '',
        minChars: '',
        maxChars: '',
        allowNegative: false,
        checkedByDefault: false,
        dateType: 'date_only',
        dateFormat: 'DD-MM-YYYY',
        options: ['Sample Option 1', 'Sample Option 2'],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, `Option ${prev.options.length + 1}`],
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = () => {
    if (!initialData) return;
    onEdit(initialData.id, {
      name: formData.name || 'Untitled Field',
      type: FIELD_TYPES.find((t) => t.value === formData.type)?.label || 'String',
      description: formData.description,
      required: formData.required,
      placeholder: formData.placeholder,
      defaultValue: formData.defaultValue,
      minChars: formData.minChars,
      maxChars: formData.maxChars,
      allowNegative: formData.allowNegative,
      checkedByDefault: formData.checkedByDefault,
      dateType: formData.dateType,
      dateFormat: formData.dateFormat,
      options: formData.options,
    });
    onClose();
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'string':
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Placeholder</label>
              <Input
                value={formData.placeholder}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Default Value</label>
              <Input
                value={formData.defaultValue}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                placeholder="Enter default value"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Min Characters</label>
                <Input
                  type="number"
                  value={formData.minChars}
                  onChange={(e) => handleChange('minChars', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Max Characters</label>
                <Input
                  type="number"
                  value={formData.maxChars}
                  onChange={(e) => handleChange('maxChars', e.target.value)}
                  placeholder="255"
                />
              </div>
            </div>
          </div>
        );
      case 'number':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Default Value</label>
              <Input
                type="number"
                value={formData.defaultValue}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                placeholder="Enter default value"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowNegative}
                onChange={(e) => handleChange('allowNegative', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary bg-surface"
              />
              <span className="text-sm text-text">Allow negative values</span>
            </label>
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.checkedByDefault}
                onChange={(e) => handleChange('checkedByDefault', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary bg-surface"
              />
              <span className="text-sm text-text">Checked by default</span>
            </label>
          </div>
        );
      case 'date':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateType"
                  checked={formData.dateType === 'date_only'}
                  onChange={() => handleChange('dateType', 'date_only')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-text">Date Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateType"
                  checked={formData.dateType === 'date_time'}
                  onChange={() => handleChange('dateType', 'date_time')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-text">Date Time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateType"
                  checked={formData.dateType === 'custom'}
                  onChange={() => handleChange('dateType', 'custom')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-text">Custom</span>
              </label>
            </div>

            {formData.dateType === 'date_only' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Format</label>
                <select
                  value={formData.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {DATE_ONLY_FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt}>{fmt}</option>
                  ))}
                </select>
              </div>
            )}
            {formData.dateType === 'date_time' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Format</label>
                <select
                  value={formData.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {DATE_TIME_FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt}>{fmt}</option>
                  ))}
                </select>
              </div>
            )}
            {formData.dateType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">Custom Format</label>
                <Input
                  value={formData.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  placeholder="e.g., YYYY/MM/DD"
                />
              </div>
            )}
          </div>
        );
      case 'dropdown':
      case 'radio':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text mb-1">Options</label>
            <div className="space-y-2">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(idx)}
                    className="text-text-muted hover:text-red-500 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleAddOption} className="w-full text-text">
              <Plus className="h-4 w-4 mr-2" />
              Add New Option
            </Button>
          </div>
        );
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Placeholder</label>
              <Input
                value={formData.placeholder}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Default Value</label>
              <Input
                value={formData.defaultValue}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );
      case 'user':
      case 'group':
        return <p className="text-sm text-text-muted">No additional configuration required for this type.</p>;
      default:
        return null;
    }
  };

  const renderPreview = () => {
    return (
      <div className="p-4 border border-border rounded-lg bg-surface space-y-2">
        {formData.type !== 'checkbox' && (
          <>
            <label className="block text-sm font-medium text-text">
              {formData.name || 'Field Name'}
              {formData.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {formData.description && (
              <p className="text-xs text-text-muted">{formData.description}</p>
            )}
          </>
        )}
        
        {/* Render input based on type */}
        {(() => {
          switch (formData.type) {
            case 'number':
              return (
                <Input
                  type="number"
                  placeholder={formData.placeholder}
                  defaultValue={formData.defaultValue}
                  min={formData.allowNegative ? undefined : "0"}
                />
              );
            case 'string':
            case 'url':
              return (
                <Input
                  type="text"
                  placeholder={formData.placeholder}
                  defaultValue={formData.defaultValue}
                />
              );
            case 'text':
              return (
                <textarea
                  className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-muted min-h-[80px]"
                  placeholder={formData.placeholder}
                  defaultValue={formData.defaultValue}
                />
              );
            case 'checkbox':
              return (
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.checkedByDefault}
                    readOnly
                    className="rounded border-border text-primary bg-surface mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-text">
                      {formData.name || 'Checkbox Label'}
                      {formData.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    {formData.description && (
                      <p className="text-xs text-text-muted">{formData.description}</p>
                    )}
                  </div>
                </div>
              );
            case 'date':
              return (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={formData.dateFormat || 'YYYY-MM-DD'}
                    value={selectedDate ? formatDateString(selectedDate, formData.dateFormat || 'YYYY-MM-DD') : ''}
                    readOnly
                  />
                  <input
                    type={formData.dateType === 'date_time' ? 'datetime-local' : 'date'}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={(e) => {
                      if (!e.target.value) {
                        setSelectedDate(null);
                        return;
                      }
                      const date = new Date(e.target.value);
                      if (!isNaN(date.getTime())) {
                        setSelectedDate(date);
                      } else {
                        setSelectedDate(null);
                      }
                    }}
                  />
                </div>
              );
            case 'dropdown':
              return (
                <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm">
                  {formData.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              );
            case 'radio':
              return (
                <div className="space-y-2">
                  {formData.options.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input type="radio" name="preview-radio" className="text-primary" />
                      <span className="text-sm text-text">{opt}</span>
                    </label>
                  ))}
                </div>
              );
            case 'user':
              return (
                <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm">
                  <option>Select User...</option>
                </select>
              );
            case 'group':
              return (
                <select className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm">
                  <option>Select Group...</option>
                </select>
              );
            default:
              return <Input />;
          }
        })()}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Case Field"
      className="max-w-4xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-text">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Details Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-text border-b border-border pb-2">Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Field Name <span className="text-red-500">*</span></label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter field name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.required}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary bg-surface"
              />
              <span className="text-sm text-text">This field is a required field</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-text shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-text mb-4">Type Configuration</h4>
              {renderTypeSpecificFields()}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-text border-b border-border pb-2">Preview</h3>
          <div className="bg-background/50 p-6 rounded-xl border border-border/50">
            {renderPreview()}
          </div>
        </div>
      </div>
    </Modal>
  );
}
