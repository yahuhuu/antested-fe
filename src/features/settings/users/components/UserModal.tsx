import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUserStore, User } from '@/features/settings/users/store/useUserStore';
import { useGroupStore } from '@/features/settings/users/store/useGroupStore';
import { useProjectStore } from '@/features/projects/store/useProjectStore';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Mail, Shield, Users, FolderKanban, Lock, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { cn } from '@/utils/cn';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const { addUser, updateUser } = useUserStore();
  const { groups } = useGroupStore();
  const { projects } = useProjectStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Tester',
    selectedGroups: [] as string[],
    selectedProjects: [] as string[],
  });

  const [inviteMethod, setInviteMethod] = useState<'email' | 'manual'>('email');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        selectedGroups: [],
        selectedProjects: [],
      });
      setInviteMethod('email');
      setPassword('');
      setConfirmPassword('');
      setError('');
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Tester',
        selectedGroups: [],
        selectedProjects: [],
      });
      setInviteMethod('email');
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (inviteMethod === 'manual' && !user) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (user) {
      updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        groups: formData.selectedGroups.length || user.groups,
        projects: formData.selectedProjects.length || user.projects,
      });
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: `https://picsum.photos/seed/${formData.name.replace(/\s/g, '')}/100/100`,
        status: 'Active',
        groups: formData.selectedGroups.length,
        projects: formData.selectedProjects.length,
      });
    }
    onClose();
  };

  const handleGroupToggle = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(groupId)
        ? prev.selectedGroups.filter(id => id !== groupId)
        : [...prev.selectedGroups, groupId]
    }));
  };

  const handleProjectToggle = (projectId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId]
    }));
  };

  const showGroupsAndProjects = formData.role !== 'Admin';
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordValid = password.length >= 6;

  const footer = (
    <div className="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose} 
        className="px-5 font-medium text-text-muted hover:text-text hover:bg-surface-hover border-border"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="user-form"
        className="px-6 font-medium bg-primary hover:bg-primary-hover text-white shadow-sm transition-all hover:shadow"
      >
        {user ? 'Save Changes' : 'Create User'}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={user ? 'Edit User' : 'Add New User'}
      className="max-w-2xl"
      footer={footer}
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-text flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-text-muted" />
              Full Name
            </label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              placeholder="e.g., John Doe" 
              required 
              className="bg-background border-border transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-text flex items-center gap-2">
              <Mail className="w-4 h-4 text-text-muted" />
              Email Address
            </label>
            <Input 
              id="email" 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              placeholder="e.g., john.doe@example.com" 
              required 
              className="bg-background border-border transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-text flex items-center gap-2">
            <Shield className="w-4 h-4 text-text-muted" />
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              className="w-full appearance-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-text shadow-sm transition-all hover:bg-surface-hover focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Admin">Admin - Full access to all projects and settings</option>
              <option value="Lead">Lead - Can manage projects and users within their groups</option>
              <option value="Developer">Developer - Can execute tests and manage defects</option>
              <option value="Tester">Tester - Can execute tests and report defects</option>
              <option value="Guest">Guest - Read-only access to assigned projects</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Invite Method (Only for new users) */}
        {!user && (
          <div className="space-y-4 pt-4 border-t border-border">
            <label className="text-sm font-medium text-text flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-text-muted" />
              Authentication Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={cn(
                  "relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all",
                  inviteMethod === 'email' 
                    ? "bg-primary/10 border-primary/30" 
                    : "border-border bg-background hover:bg-surface-hover"
                )}
              >
                <input 
                  type="radio" 
                  name="inviteMethod" 
                  value="email" 
                  checked={inviteMethod === 'email'}
                  onChange={() => setInviteMethod('email')}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className={cn("font-medium", inviteMethod === 'email' ? "text-primary" : "text-text")}>
                        Email Invitation
                      </p>
                      <p className={cn("inline", inviteMethod === 'email' ? "text-primary" : "text-text-muted")}>
                        Send a secure setup link
                      </p>
                    </div>
                  </div>
                  {inviteMethod === 'email' && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </label>

              <label 
                className={cn(
                  "relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none transition-all",
                  inviteMethod === 'manual' 
                    ? "bg-primary/10 border-primary/30" 
                    : "border-border bg-background hover:bg-surface-hover"
                )}
              >
                <input 
                  type="radio" 
                  name="inviteMethod" 
                  value="manual"
                  checked={inviteMethod === 'manual'}
                  onChange={() => setInviteMethod('manual')}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className={cn("font-medium", inviteMethod === 'manual' ? "text-primary" : "text-text")}>
                        Manual Password
                      </p>
                      <p className={cn("inline", inviteMethod === 'manual' ? "text-primary" : "text-text-muted")}>
                        Set password directly
                      </p>
                    </div>
                  </div>
                  {inviteMethod === 'manual' && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Password Fields */}
        <AnimatePresence mode="popLayout">
          {!user && inviteMethod === 'manual' && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-background border border-border">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-text flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-text-muted" />
                      Password
                    </span>
                    {password && (
                      <span className={cn("text-xs", passwordValid ? "text-emerald-500" : "text-amber-500")}>
                        {passwordValid ? "Valid length" : "Too short"}
                      </span>
                    )}
                  </label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Min. 6 characters" 
                    required={inviteMethod === 'manual'}
                    className={cn(
                      "bg-background transition-all focus:ring-2",
                      password && !passwordValid ? "border-amber-300 focus:ring-amber-500" : "focus:ring-primary"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-text flex items-center justify-between">
                    <span>Confirm Password</span>
                    {confirmPassword && (
                      <span className={cn("text-xs", passwordsMatch ? "text-emerald-500" : "text-rose-500")}>
                        {passwordsMatch ? "Matches" : "Does not match"}
                      </span>
                    )}
                  </label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Re-enter password" 
                    required={inviteMethod === 'manual'}
                    className={cn(
                      "bg-background transition-all focus:ring-2",
                      confirmPassword && !passwordsMatch ? "border-rose-300 focus:ring-rose-500" : "focus:ring-primary"
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conditional Groups & Projects */}
        <AnimatePresence mode="popLayout">
          {showGroupsAndProjects && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-sm font-medium text-text flex items-center gap-2">
                  <Users className="w-4 h-4 text-text-muted" />
                  Assign Groups <span className="text-xs font-normal text-text-muted">(Optional)</span>
                </label>
                <MultiSelect
                  options={groups.map(g => ({ id: g.id, name: g.name }))}
                  selectedIds={formData.selectedGroups}
                  onChange={(ids) => setFormData(prev => ({ ...prev, selectedGroups: ids }))}
                  placeholder="Add group..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-text-muted" />
                  Assign Projects <span className="text-xs font-normal text-text-muted">(Optional)</span>
                </label>
                <MultiSelect
                  options={projects.map(p => ({ id: p.id, name: p.name }))}
                  selectedIds={formData.selectedProjects}
                  onChange={(ids) => setFormData(prev => ({ ...prev, selectedProjects: ids }))}
                  placeholder="Add project..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-3 rounded-md border border-rose-200 dark:border-rose-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Modal>
  );
}
