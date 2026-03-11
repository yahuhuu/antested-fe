import { TestCase } from "../store/useTestCaseStore";
import { SidePanel } from "@/components/ui/SidePanel";
import { FileText, Activity, Folder, AlertCircle, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface TestCaseSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  testCase: TestCase | null;
}

const MOCK_ACTIVITIES = [
  { id: 1, action: "Test case created", time: "2 days ago", user: "John Doe" },
  { id: 2, action: "Status changed to In Review", time: "1 day ago", user: "Jane Smith" },
  { id: 3, action: "Priority updated to High", time: "5 hours ago", user: "Admin User" },
];

export function TestCaseSidePanel({ isOpen, onClose, testCase }: TestCaseSidePanelProps) {
  return (
    <SidePanel
      isOpen={isOpen && !!testCase}
      onClose={onClose}
      title="Test Case Details"
      defaultWidth={420}
    >
      {testCase && (
        <>
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-surface shadow-sm shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text leading-tight">
                {testCase.title}
              </h2>
              <p className="text-sm text-text-muted mt-1 font-mono">{testCase.id}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge 
                  variant="outline"
                  className={cn(
                    "font-medium border-none px-2.5 py-1 rounded-full text-xs",
                    testCase.reviewStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                    testCase.reviewStatus === 'Draft' ? 'bg-slate-500/10 text-slate-500' : 
                    testCase.reviewStatus === 'In Review' ? 'bg-teal-500/10 text-teal-500' : 
                    testCase.reviewStatus === 'Need Update' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-slate-500/10 text-slate-500'
                  )}
                >
                  {testCase.reviewStatus || 'Draft'}
                </Badge>
                <Badge 
                  variant="outline"
                  className={cn(
                    "font-medium border-none px-2.5 py-1 rounded-full text-xs",
                    testCase.priority === 'Critical' ? 'bg-purple-500/10 text-purple-500' : 
                    testCase.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                    testCase.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-blue-500/10 text-blue-500'
                  )}
                >
                  {testCase.priority} Priority
                </Badge>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text mb-4">
              Information
            </h3>
            <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted flex items-center gap-2"><Folder className="w-4 h-4" /> Directory</span>
                <span className="font-medium text-text">{testCase.directory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Type</span>
                <span className="font-medium text-text">{testCase.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted flex items-center gap-2"><User className="w-4 h-4" /> Assignee</span>
                <span className="font-medium text-text">{testCase.assignee || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Custom Fields (if any) */}
          {testCase.customFields && Object.keys(testCase.customFields).length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text mb-4">
                Custom Fields
              </h3>
              <div className="space-y-3 text-sm bg-background rounded-xl border border-border p-4">
                {Object.entries(testCase.customFields).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-text-muted capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-text text-right max-w-[60%] whitespace-pre-wrap">
                      {String(value)}
                    </span>
                  </div>
                ))}
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
        </>
      )}
    </SidePanel>
  );
}
