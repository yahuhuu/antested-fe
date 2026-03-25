import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Paperclip, X } from 'lucide-react';

interface ChangeStatusFormProps {
  initialStatus?: string;
  projectUsers?: { id: string; name: string }[];
  onSubmit: (status: string, assignee: string, comment: string, file?: File | null) => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export function ChangeStatusForm({ initialStatus = 'Needs Update', projectUsers = [], onSubmit, onNext, hasNext }: ChangeStatusFormProps) {
  const [status, setStatus] = useState(initialStatus);
  const [assignee, setAssignee] = useState('');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statuses = ['Ready for Review', 'In Review', 'Needs Update', 'Approved', 'Rejected', 'Draft'];

  const handleSubmit = (withNext: boolean) => {
    onSubmit(status, assignee, comment, file);
    if (withNext && onNext) {
      onNext();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError('');
    
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setFileError('File size exceeds 50MB limit');
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Assign To</option>
          {projectUsers.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment about the result..."
        className="w-full h-24 bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none custom-scrollbar"
      />

      <div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Paperclip className="w-4 h-4" />
          Attach file (Max 50MB)
        </button>
        {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
        {file && (
          <div className="flex items-center gap-2 mt-2 bg-background border border-border rounded-md px-3 py-1.5 w-fit">
            <span className="text-xs text-text truncate max-w-[200px]">{file.name}</span>
            <button onClick={removeFile} className="text-text-muted hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button 
          onClick={() => handleSubmit(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          Update Status
        </Button>
        <Button 
          onClick={() => handleSubmit(true)}
          disabled={!hasNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Status & Next
        </Button>
      </div>
    </div>
  );
}
