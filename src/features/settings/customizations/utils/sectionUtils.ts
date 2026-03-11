import { TestCaseFieldConfig } from '../store/useCustomizationStore';

export type Section = {
  id: string;
  columns: number;
  fields: (string | null)[];
};

export const reconstructSections = (fields: TestCaseFieldConfig[]): Section[] => {
  const sectionsMap = new Map<number, Section>();

  fields.forEach(field => {
    const sectionIndex = field.section || 1;
    const columnIndex = field.column || 1;
    const columns = Math.round(12 / (field.width || 12));

    if (!sectionsMap.has(sectionIndex)) {
      sectionsMap.set(sectionIndex, {
        id: `section-${sectionIndex}-${Math.random().toString(36).substr(2, 9)}`,
        columns: columns,
        fields: []
      });
    }

    const section = sectionsMap.get(sectionIndex)!;
    // Ensure the fields array is large enough
    while (section.fields.length < columnIndex) {
      section.fields.push(null);
    }
    section.fields[columnIndex - 1] = field.id.startsWith('empty-') ? null : field.id;
    
    // Update columns if we find a smaller width (more columns)
    if (columns > section.columns) {
      section.columns = columns;
    }
  });

  // Convert map to array sorted by section index
  const sections = Array.from(sectionsMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([_, section]) => {
      // Ensure fields array length is exactly columns
      if (section.fields.length < section.columns) {
        const padding = section.columns - section.fields.length;
        for (let i = 0; i < padding; i++) {
          section.fields.push(null);
        }
      } else if (section.fields.length > section.columns) {
        section.fields = section.fields.slice(0, section.columns);
      }
      return section;
    });

  return sections;
};

export const flattenSections = (sections: Section[]): TestCaseFieldConfig[] => {
  return sections.flatMap((section, sIndex) => {
    const sectionNumber = sIndex + 1;
    return section.fields.map((fieldId, fIndex) => ({
      id: fieldId || `empty-${section.id}-${fIndex}`,
      width: 12 / section.columns,
      section: sectionNumber,
      column: fIndex + 1
    }));
  });
};
