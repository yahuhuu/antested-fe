import { useMemo, useState, useEffect } from "react";
import { TestCase } from "../store/useTestCaseStore";
import { SidePanel } from "@/components/ui/SidePanel";
import { FileText, Activity, Folder, AlertCircle, User, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { useProjectStore } from "../store/useProjectStore";
import { useDirectoryStore } from "../store/useDirectoryStore";
import { useCustomizationStore } from "@/features/settings/customizations/store/useCustomizationStore";
import { useUserStore } from "@/features/settings/users/store/useUserStore";
import { useGroupStore } from "@/features/settings/users/store/useGroupStore";
import { reconstructSections } from "@/features/settings/customizations/utils/sectionUtils";
import { Button } from "@/components/ui/Button";
import { ChangeStatusForm } from "./ChangeStatusForm";
import { useTestCaseStore } from "../store/useTestCaseStore";
import { motion, AnimatePresence } from "motion/react";

interface TestCaseSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  testCase: TestCase | null;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const MOCK_ACTIVITIES = [
  { id: 3, action: "Priority updated to High", time: "5 hours ago", user: "Admin User" },
  { id: 2, action: "Status changed to In Review", time: "1 day ago", user: "Jane Smith" },
  { id: 1, action: "Test case created", time: "2 days ago", user: "John Doe" },
];

export function TestCaseSidePanel({ isOpen, onClose, testCase, onNext, onPrevious, hasNext, hasPrevious }: TestCaseSidePanelProps) {
  const { projects } = useProjectStore();
  const { directories } = useDirectoryStore();
  const { caseFields, testCaseTemplates, testStepTemplates } = useCustomizationStore();
  const { users } = useUserStore();
  const { groups } = useGroupStore();
  const { updateTestCase } = useTestCaseStore();

  const [isLoading, setIsLoading] = useState(false);
  const [displayedTestCase, setDisplayedTestCase] = useState<TestCase | null>(testCase);

  useEffect(() => {
    if (testCase?.id !== displayedTestCase?.id) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDisplayedTestCase(testCase);
        setIsLoading(false);
      }, 300); // 300ms loading animation
      return () => clearTimeout(timer);
    } else if (!testCase) {
      setDisplayedTestCase(null);
    }
  }, [testCase, displayedTestCase]);

  const project = useMemo(() => {
    if (!displayedTestCase) return null;
    return projects.find(p => p.id === displayedTestCase.projectId);
  }, [displayedTestCase, projects]);

  const template = useMemo(() => {
    if (!project?.test_case_templates?.id) return null;
    return testCaseTemplates.find(t => t.id === project.test_case_templates.id);
  }, [project, testCaseTemplates]);

  const sections = useMemo(() => {
    return template ? reconstructSections(template.fields) : [];
  }, [template]);

  const directoryName = useMemo(() => {
    if (!displayedTestCase?.directory) return 'Unassigned';
    const dir = directories.find(d => d.id === displayedTestCase.directory);
    return dir ? dir.name : displayedTestCase.directory;
  }, [displayedTestCase, directories]);

  const testStepTemplate = useMemo(() => {
    if (!displayedTestCase?.testStepTemplateId) return null;
    return testStepTemplates.find(t => t.id === displayedTestCase.testStepTemplateId);
  }, [displayedTestCase, testStepTemplates]);

  return (
    <SidePanel
      isOpen={isOpen && !!testCase}
      onClose={onClose}
      title="Test Case Details"
      defaultWidth={600}
      footer={
        testCase && (
          <div className="flex items-center justify-between w-full text-text">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Test Case
            </Button>
            <Button
              variant="outline"
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-2 text-text"
            >
              Next Test Case
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading test case details...</p>
        </div>
      ) : displayedTestCase ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={displayedTestCase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto pb-5">
              {/* Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-surface shadow-sm shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text leading-tight">
                    {displayedTestCase.title}
                  </h2>
                  <p className="text-sm text-text-muted mt-1 font-mono">{displayedTestCase.id}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {project?.enable_test_case_approval && (
                      <Badge 
                        variant="outline"
                        className={cn(
                          "font-medium border-none px-2.5 py-1 rounded-full text-xs",
                          displayedTestCase.reviewStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                          displayedTestCase.reviewStatus === 'Draft' ? 'bg-slate-500/10 text-slate-500' : 
                          displayedTestCase.reviewStatus === 'In Review' ? 'bg-teal-500/10 text-teal-500' : 
                          displayedTestCase.reviewStatus === 'Ready for Review' ? 'bg-blue-500/10 text-blue-500' :
                          displayedTestCase.reviewStatus === 'Needs Update' ? 'bg-orange-500/10 text-orange-500' :
                          displayedTestCase.reviewStatus === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                          'bg-slate-500/10 text-slate-500'
                        )}
                      >
                        {displayedTestCase.reviewStatus || 'Draft'}
                      </Badge>
                    )}
                    <Badge 
                      variant="outline"
                      className={cn(
                        "font-medium border-none px-2.5 py-1 rounded-full text-xs",
                        displayedTestCase.priority === 'Critical' ? 'bg-purple-500/10 text-purple-500' : 
                        displayedTestCase.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                        displayedTestCase.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-blue-500/10 text-blue-500'
                      )}
                    >
                      {displayedTestCase.priority} Priority
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mb-8 space-y-6">
                {sections.length > 0 ? sections.map(section => (
                  <div key={section.id} className="grid gap-6 bg-background rounded-xl border border-border p-5" style={{ gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))` }}>
                    {section.fields.map((fieldId, index) => {
                      if (!fieldId) {
                        return <div key={index} className="min-h-[60px]" />;
                      }

                      if (fieldId === 'title') {
                        return (
                          <div key={`${section.id}-${index}`}>
                            <label className="block text-sm font-medium text-text-muted mb-1">Title</label>
                            <div className="font-medium text-text">{displayedTestCase.title}</div>
                          </div>
                        );
                      }

                      if (fieldId === 'directory') {
                        return (
                          <div key={`${section.id}-${index}`}>
                            <label className="block text-sm font-medium text-text-muted mb-1">Directory</label>
                            <div className="font-medium text-text flex items-center gap-2">
                              <Folder className="w-4 h-4 text-text-muted" />
                              {directoryName}
                            </div>
                          </div>
                        );
                      }

                      const fieldConfig = caseFields.find(cf => cf.id === fieldId);
                      if (!fieldConfig) return <div key={index} className="min-h-[60px]" />;

                      let displayValue: React.ReactNode = '-';
                      const rawValue = displayedTestCase.customFields?.[fieldId];

                      if (fieldConfig.type === 'User') {
                        const user = users.find(u => u.id === rawValue);
                        displayValue = user ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-text-muted" />
                            {user.name}
                          </div>
                        ) : (rawValue || '-');
                      } else if (fieldConfig.type === 'Group') {
                        const group = groups.find(g => g.id === rawValue);
                        displayValue = group ? group.name : (rawValue || '-');
                      } else if (fieldConfig.type === 'Checkbox') {
                        displayValue = rawValue ? 'Yes' : 'No';
                      } else if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
                        displayValue = String(rawValue);
                      }

                      return (
                        <div key={`${section.id}-${index}`}>
                          <label className="block text-sm font-medium text-text-muted mb-1">
                            {fieldConfig.name}
                          </label>
                          <div className="font-medium text-text whitespace-pre-wrap">
                            {displayValue}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )) : (
                  // Fallback if no template
                  <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted flex items-center gap-2"><Folder className="w-4 h-4" /> Directory</span>
                      <span className="font-medium text-text">{directoryName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Type</span>
                      <span className="font-medium text-text">{displayedTestCase.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted flex items-center gap-2"><User className="w-4 h-4" /> Assignee</span>
                      <span className="font-medium text-text">{displayedTestCase.assignee || 'Unassigned'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Steps */}
              {testStepTemplate && displayedTestCase.testStepsData && Object.keys(displayedTestCase.testStepsData).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-text mb-4">
                    Test Steps
                  </h3>
                  <div className="space-y-4">
                    {testStepTemplate.fields.map(field => {
                      const data = displayedTestCase.testStepsData?.[field.id];
                      if (!data) return null;

                      if (field.type === 'Repeater' && Array.isArray(data)) {
                        return (
                          <div key={field.id} className="space-y-3">
                            <label className="block text-sm font-medium text-text-muted">
                              {field.name}
                            </label>
                            <div className="border border-border rounded-xl overflow-hidden">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-surface border-b border-border">
                                  <tr>
                                    <th className="px-4 py-2 font-medium text-text-muted w-12">#</th>
                                    {field.subFields?.map(sf => (
                                      <th key={sf.id} className="px-4 py-2 font-medium text-text-muted">{sf.name}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {data.map((row: any, rowIndex: number) => (
                                    <tr key={row.id || rowIndex} className="bg-background">
                                      <td className="px-4 py-3 text-text-muted">{rowIndex + 1}</td>
                                      {field.subFields?.map(sf => (
                                        <td key={sf.id} className="px-4 py-3 text-text whitespace-pre-wrap">
                                          {row[sf.id] || '-'}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={field.id} className="bg-background rounded-xl border border-border p-4">
                          <label className="block text-sm font-medium text-text-muted mb-2">
                            {field.name}
                          </label>
                          <div className="font-medium text-text whitespace-pre-wrap">
                            {String(data)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div>
                <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-text-muted" />
                  Recent Activity
                </h3>
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                  <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {MOCK_ACTIVITIES.map((activity, index) => (
                      <div key={activity.id} className="relative pl-4">
                        {index !== MOCK_ACTIVITIES.length - 1 && (
                          <div className="absolute left-[7px] top-5 bottom-[-16px] w-px bg-border" />
                        )}
                        <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-primary" />
                        <div className="text-sm font-medium text-text">
                          {activity.action}
                        </div>
                        <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {activity.time} by {activity.user}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Result Section for Drafts */}
              {project?.enable_test_case_approval && displayedTestCase.reviewStatus === 'Draft' && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">
                    Result
                  </h3>
                  <ChangeStatusForm
                    initialStatus="Needs Update"
                    projectUsers={project?.access_management?.users?.data || []}
                    onSubmit={async (status, assignee, comment) => {
                      await updateTestCase(displayedTestCase.id, {
                        reviewStatus: status as any,
                        assignee: assignee || undefined,
                      });
                      if (!onNext) {
                        onClose();
                      }
                    }}
                    onNext={onNext}
                    hasNext={hasNext}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : null}
    </SidePanel>
  );
}
