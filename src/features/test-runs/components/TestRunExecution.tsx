import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle, RotateCcw, Play, Pause, FastForward } from 'lucide-react';
import { cn } from '@/utils/cn';

const mockRun = {
  id: 'TR-104',
  name: 'Release 2.1 Regression',
  status: 'In Progress',
  environment: 'Staging',
  cases: [
    { id: 'TC-1', title: 'User can login with valid credentials', status: 'Untested' },
    { id: 'TC-2', title: 'User cannot login with invalid password', status: 'Passed' },
    { id: 'TC-3', title: 'Password reset flow', status: 'Untested' },
    { id: 'TC-4', title: 'Guest checkout with credit card', status: 'Untested' },
    { id: 'TC-5', title: 'Logged in user checkout', status: 'Failed' },
  ]
};

export function TestRunExecution() {
  const { projectId, runId } = useParams();
  const [cases, setCases] = useState(mockRun.cases);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCase = cases[activeIndex];

  const updateStatus = (status: string) => {
    setCases(prev => {
      const newCases = [...prev];
      newCases[activeIndex] = { ...newCases[activeIndex], status };
      return newCases;
    });
    
    // Auto-advance to next untested or just next
    if (activeIndex < cases.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch(e.key.toLowerCase()) {
        case 'p':
          updateStatus('Passed');
          break;
        case 'f':
          updateStatus('Failed');
          break;
        case 'b':
          updateStatus('Blocked');
          break;
        case 'r':
          updateStatus('Retest');
          break;
        case 'arrowdown':
        case 'j':
          if (activeIndex < cases.length - 1) setActiveIndex(activeIndex + 1);
          break;
        case 'arrowup':
        case 'k':
          if (activeIndex > 0) setActiveIndex(activeIndex - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, cases.length]);

  const stats = {
    passed: cases.filter(c => c.status === 'Passed').length,
    failed: cases.filter(c => c.status === 'Failed').length,
    blocked: cases.filter(c => c.status === 'Blocked').length,
    retest: cases.filter(c => c.status === 'Retest').length,
    untested: cases.filter(c => c.status === 'Untested').length,
    total: cases.length
  };

  const progress = ((stats.total - stats.untested) / stats.total) * 100;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="-ml-2 text-slate-500 dark:text-slate-400 hover:dark:bg-neon-card">
            <Link to={`/projects/${projectId}/test-runs`} className="flex h-full w-full items-center justify-center">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{mockRun.name}</h1>
              <Badge variant="secondary">{mockRun.environment}</Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{runId} • {stats.total} Test Cases</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium"><CheckCircle2 className="mr-1 h-4 w-4" /> {stats.passed}</span>
            <span className="flex items-center text-red-600 dark:text-red-400 font-medium"><XCircle className="mr-1 h-4 w-4" /> {stats.failed}</span>
            <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium"><AlertCircle className="mr-1 h-4 w-4" /> {stats.blocked}</span>
            <span className="flex items-center text-slate-400 dark:text-slate-500 font-medium"><RotateCcw className="mr-1 h-4 w-4" /> {stats.retest}</span>
          </div>
          <div className="w-32 h-2 bg-slate-100 dark:bg-neon-card rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 dark:bg-neon-cyan transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar - Test Cases List */}
        <div className="flex w-80 flex-col rounded-xl border border-slate-200 dark:border-neon-border bg-white dark:bg-neon-card transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-neon-border p-3 bg-slate-50/50 dark:bg-neon-dark/50 transition-colors">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Test Cases</span>
            <Badge variant="outline" className="text-xs">{stats.untested} remaining</Badge>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {cases.map((tc, idx) => (
              <button
                key={tc.id}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors",
                  activeIndex === idx ? "bg-indigo-50 dark:bg-neon-cyan/10 ring-1 ring-indigo-200 dark:ring-neon-cyan/30" : "hover:bg-slate-50 dark:hover:bg-neon-border/50"
                )}
              >
                <div className="mt-0.5">
                  {tc.status === 'Passed' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {tc.status === 'Failed' && <XCircle className="h-4 w-4 text-red-500" />}
                  {tc.status === 'Blocked' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                  {tc.status === 'Retest' && <RotateCcw className="h-4 w-4 text-slate-400 dark:text-slate-500" />}
                  {tc.status === 'Untested' && <div className="h-4 w-4 rounded-full border-2 border-slate-200 dark:border-neon-border" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{tc.id}</span>
                  </div>
                  <p className={cn(
                    "text-sm truncate",
                    activeIndex === idx ? "text-indigo-900 dark:text-neon-cyan font-medium" : "text-slate-700 dark:text-slate-300"
                  )}>{tc.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Execution Area */}
        <div className="flex flex-1 flex-col rounded-xl border border-slate-200 dark:border-neon-border bg-white dark:bg-neon-card overflow-hidden shadow-sm transition-colors">
          {activeCase ? (
            <>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono">{activeCase.id}</Badge>
                      <Badge variant="secondary">High Priority</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeCase.title}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Preconditions</h3>
                      <div className="rounded-lg bg-slate-50 dark:bg-neon-dark/50 p-4 text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-neon-border transition-colors">
                        User must be registered and have an active account.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Steps</h3>
                      <div className="space-y-3">
                        {[
                          'Navigate to the login page',
                          'Enter valid email address',
                          'Enter valid password',
                          'Click the Login button'
                        ].map((step, i) => (
                          <div key={i} className="flex gap-4 p-3 rounded-lg border border-slate-100 dark:border-neon-border hover:border-slate-200 dark:hover:border-neon-cyan/50 transition-colors">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-neon-dark text-xs font-medium text-slate-600 dark:text-slate-400">
                              {i + 1}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Expected Result</h3>
                      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 transition-colors">
                        User is successfully authenticated and redirected to the dashboard.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Execution Bar */}
              <div className="border-t border-slate-200 dark:border-neon-border bg-slate-50 dark:bg-neon-dark/50 p-4 transition-colors">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="hidden sm:inline">Keyboard shortcuts:</span>
                    <kbd className="rounded border border-slate-200 dark:border-neon-border bg-white dark:bg-neon-card px-2 py-1 font-mono text-xs shadow-sm">P</kbd> Pass
                    <kbd className="rounded border border-slate-200 dark:border-neon-border bg-white dark:bg-neon-card px-2 py-1 font-mono text-xs shadow-sm ml-2">F</kbd> Fail
                    <kbd className="rounded border border-slate-200 dark:border-neon-border bg-white dark:bg-neon-card px-2 py-1 font-mono text-xs shadow-sm ml-2">B</kbd> Block
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-white dark:bg-neon-card hover:bg-slate-100 dark:hover:bg-neon-border" onClick={() => updateStatus('Blocked')}>
                      <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                      Block
                    </Button>
                    <Button variant="outline" className="bg-white dark:bg-neon-card hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400" onClick={() => updateStatus('Failed')}>
                      <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      Fail
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={() => updateStatus('Passed')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Pass
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-slate-500 dark:text-slate-400">
              Select a test case to begin execution
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
