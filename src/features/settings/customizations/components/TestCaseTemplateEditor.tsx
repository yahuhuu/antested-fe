import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, GripVertical, LayoutTemplate, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCustomizationStore, CaseField } from '../store/useCustomizationStore';
import { Section } from '../utils/sectionUtils';

interface TestCaseTemplateEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export function TestCaseTemplateEditor({ sections, onChange }: TestCaseTemplateEditorProps) {
  const { caseFields } = useCustomizationStore();
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  
  const builtInFields = [
    { id: 'title', name: 'Title (Built-in)', type: 'string' },
    { id: 'directory', name: 'Directory (Built-in)', type: 'string' }
  ];

  const allFields = [...builtInFields, ...caseFields];

  const getField = (id: string | null) => {
    if (!id) return null;
    return allFields.find(f => f.id === id);
  };

  const availableFields = allFields.filter(f => 
    !sections.some(s => s.fields.includes(f.id))
  );

  const hasEmptySlot = sections.some(s => s.fields.includes(null));

  const handleAddSection = (columns: number) => {
    const newSection: Section = {
      id: `section-${Math.random().toString(36).substr(2, 9)}`,
      columns,
      fields: Array(columns).fill(null)
    };
    onChange([...sections, newSection]);
    setShowAddSection(false);
  };

  const handleEditSectionColumns = (sectionId: string, newColumns: number) => {
    const newSections = sections.map(s => {
      if (s.id === sectionId) {
        let newFields = [...s.fields];
        if (newFields.length > newColumns) {
          // Truncate extra fields (they will return to available fields)
          newFields = newFields.slice(0, newColumns);
        } else if (newFields.length < newColumns) {
          // Pad with nulls
          newFields = [...newFields, ...Array(newColumns - newFields.length).fill(null)];
        }
        return { ...s, columns: newColumns, fields: newFields };
      }
      return s;
    });
    onChange(newSections);
    setEditingSectionId(null);
  };

  const handleRemoveSection = (sectionId: string) => {
    onChange(sections.filter(s => s.id !== sectionId));
  };

  const handleAddFieldToGrid = (fieldId: string) => {
    if (!hasEmptySlot) return;

    const newSections = [...sections];
    for (let i = 0; i < newSections.length; i++) {
      const emptyIndex = newSections[i].fields.findIndex(f => f === null);
      if (emptyIndex !== -1) {
        newSections[i].fields[emptyIndex] = fieldId;
        break;
      }
    }
    onChange(newSections);
  };

  const handleRemoveFieldFromGrid = (sectionId: string, fieldIndex: number) => {
    const newSections = sections.map(s => {
      if (s.id === sectionId) {
        const newFields = [...s.fields];
        newFields[fieldIndex] = null;
        return { ...s, fields: newFields };
      }
      return s;
    });
    onChange(newSections);
  };

  const moveField = (sectionIndex: number, fieldIndex: number, direction: 'up' | 'down' | 'left' | 'right') => {
    const newSections = [...sections];
    const section = newSections[sectionIndex];
    const fieldId = section.fields[fieldIndex];

    let targetSectionIndex = sectionIndex;
    let targetFieldIndex = fieldIndex;

    if (direction === 'left' && fieldIndex > 0) {
      targetFieldIndex = fieldIndex - 1;
    } else if (direction === 'right' && fieldIndex < section.columns - 1) {
      targetFieldIndex = fieldIndex + 1;
    } else if (direction === 'up' && sectionIndex > 0) {
      targetSectionIndex = sectionIndex - 1;
      targetFieldIndex = Math.min(fieldIndex, newSections[targetSectionIndex].columns - 1);
    } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
      targetSectionIndex = sectionIndex + 1;
      targetFieldIndex = Math.min(fieldIndex, newSections[targetSectionIndex].columns - 1);
    } else {
      return;
    }

    const targetFieldId = newSections[targetSectionIndex].fields[targetFieldIndex];
    if (targetFieldId === 'title' || targetFieldId === 'directory') return;

    // Swap
    const temp = newSections[targetSectionIndex].fields[targetFieldIndex];
    newSections[targetSectionIndex].fields[targetFieldIndex] = fieldId;
    newSections[sectionIndex].fields[fieldIndex] = temp;
    
    onChange(newSections);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, fieldId: string, sourceSectionId?: string, sourceIndex?: number) => {
    e.dataTransfer.setData('fieldId', fieldId);
    if (sourceSectionId) {
      e.dataTransfer.setData('sourceSectionId', sourceSectionId);
      e.dataTransfer.setData('sourceIndex', sourceIndex!.toString());
    }
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string, targetIndex: number) => {
    e.preventDefault();
    const fieldId = e.dataTransfer.getData('fieldId');
    const sourceSectionId = e.dataTransfer.getData('sourceSectionId');
    const sourceIndexStr = e.dataTransfer.getData('sourceIndex');

    if (!fieldId) return;

    const newSections = [...sections];
    const targetSection = newSections.find(s => s.id === targetSectionId)!;

    // Prevent dropping onto built-in fields
    const targetFieldId = targetSection.fields[targetIndex];
    if (targetFieldId === 'title' || targetFieldId === 'directory') {
      return;
    }

    if (sourceSectionId) {
      // Move within grid
      const sourceIndex = parseInt(sourceIndexStr, 10);
      const sourceSection = newSections.find(s => s.id === sourceSectionId)!;
      
      // Swap
      const temp = targetSection.fields[targetIndex];
      targetSection.fields[targetIndex] = fieldId;
      sourceSection.fields[sourceIndex] = temp;
    } else {
      // Add from available fields
      if (targetSection.fields[targetIndex] === null) {
        targetSection.fields[targetIndex] = fieldId;
      } else {
        // Swap: the existing field goes back to available
        targetSection.fields[targetIndex] = fieldId;
      }
    }
    onChange(newSections);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSidebarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceSectionId = e.dataTransfer.getData('sourceSectionId');
    const sourceIndexStr = e.dataTransfer.getData('sourceIndex');

    if (sourceSectionId) {
      const sourceIndex = parseInt(sourceIndexStr, 10);
      handleRemoveFieldFromGrid(sourceSectionId, sourceIndex);
    }
  };

  return (
    <div className="flex gap-6 h-full min-h-[400px]">
      {/* Available Fields Sidebar */}
      <div 
        className="w-64 shrink-0 flex flex-col border border-border rounded-lg bg-surface overflow-hidden"
        onDragOver={handleDragOver}
        onDrop={handleSidebarDrop}
      >
        <div className="p-3 border-b border-border bg-surface-hover font-medium text-sm text-text">
          Available Fields
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {availableFields.map(field => (
            <div 
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, field.id)}
              className="flex items-center justify-between p-2 rounded-md border border-border bg-background hover:border-primary/50 cursor-grab active:cursor-grabbing group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <GripVertical className="h-4 w-4 text-text-muted shrink-0" />
                <span className="text-sm text-text truncate">{field.name}</span>
              </div>
              <button
                type="button"
                onClick={() => handleAddFieldToGrid(field.id)}
                disabled={!hasEmptySlot}
                className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
          {availableFields.length === 0 && (
            <div className="text-center p-4 text-sm text-text-muted">
              No more fields available
            </div>
          )}
        </div>
      </div>

      {/* Grid Editor */}
      <div className="flex-1 flex flex-col border border-border rounded-lg bg-surface overflow-hidden">
        <div className="p-3 border-b border-border bg-surface-hover flex items-center justify-between">
          <span className="font-medium text-sm text-text">Test Case Details Configuration</span>
          <div className="relative">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddSection(!showAddSection)}
              className="h-8 text-xs"
            >
              Add Section
            </Button>
            {showAddSection && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-md shadow-lg z-10 py-1">
                {[1, 2, 3, 4].map(cols => (
                  <button
                    key={cols}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface-hover"
                    onClick={() => handleAddSection(cols)}
                  >
                    {cols} Column{cols > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/30">
          {sections.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-border rounded-lg p-8">
              <LayoutTemplate className="h-8 w-8 mb-2 opacity-50" />
              <p>No sections added yet.</p>
              <p className="text-sm mt-1">Click "Add Section" to start building your layout.</p>
            </div>
          ) : (
            sections.map((section, sIndex) => {
              const hasBuiltIn = section.fields.some(f => f === 'title' || f === 'directory');
              return (
              <div key={section.id} className="relative group border border-border rounded-lg bg-surface p-2">
                {!hasBuiltIn && (
                  <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-1 rounded-full transition-colors"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      {editingSectionId === section.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-surface border border-border rounded-md shadow-lg z-20 py-1">
                          {[1, 2, 3, 4].map(cols => (
                            <button
                              key={cols}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-hover ${cols === section.columns ? 'text-primary font-medium' : 'text-text'}`}
                              onClick={() => handleEditSectionColumns(section.id, cols)}
                            >
                              {cols} Column{cols > 1 ? 's' : ''}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(section.id)}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded-full transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                <div 
                  className="grid gap-2" 
                  style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}
                >
                  {section.fields.map((fieldId, fIndex) => {
                    const field = getField(fieldId);
                    const isBuiltIn = fieldId === 'title' || fieldId === 'directory';
                    
                    return (
                      <div 
                        key={`${section.id}-${fIndex}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, section.id, fIndex)}
                        className={`min-h-[80px] border-2 border-dashed rounded-md p-2 flex flex-col transition-colors ${
                          field ? 'border-primary/30 bg-primary/5' : 'border-border bg-background/50 hover:border-primary/50'
                        }`}
                      >
                        {field ? (
                          <div 
                            draggable={!isBuiltIn}
                            onDragStart={(e) => !isBuiltIn && handleDragStart(e, field.id, section.id, fIndex)}
                            className={`flex-1 flex flex-col bg-surface border border-border rounded p-2 ${!isBuiltIn ? 'cursor-grab active:cursor-grabbing' : ''} group/field relative`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {!isBuiltIn && <GripVertical className="h-3 w-3 text-text-muted shrink-0" />}
                              <span className="text-xs font-medium text-text truncate flex-1">{field.name}</span>
                              {!isBuiltIn && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFieldFromGrid(section.id, fIndex)}
                                  className="text-text-muted hover:text-red-500 p-0.5"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            
                            {/* Arrows for moving */}
                            {!isBuiltIn && (
                              <div className="mt-auto flex justify-center gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                <button type="button" onClick={() => moveField(sIndex, fIndex, 'left')} disabled={fIndex === 0} className="p-1 text-text-muted hover:text-primary disabled:opacity-30"><ChevronLeft className="h-3 w-3" /></button>
                                <button type="button" onClick={() => moveField(sIndex, fIndex, 'up')} disabled={sIndex === 0} className="p-1 text-text-muted hover:text-primary disabled:opacity-30"><ChevronUp className="h-3 w-3" /></button>
                                <button type="button" onClick={() => moveField(sIndex, fIndex, 'down')} disabled={sIndex === sections.length - 1} className="p-1 text-text-muted hover:text-primary disabled:opacity-30"><ChevronDown className="h-3 w-3" /></button>
                                <button type="button" onClick={() => moveField(sIndex, fIndex, 'right')} disabled={fIndex === section.columns - 1} className="p-1 text-text-muted hover:text-primary disabled:opacity-30"><ChevronRight className="h-3 w-3" /></button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-text-muted text-xs">
                            Empty Slot
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
