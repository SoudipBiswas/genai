import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Upload, Copy, Check, X } from 'lucide-react';

interface CodeEditorPanelProps {
  title: string;
  subtitle: string;
  code: string;
  onChange: (value: string) => void;
  variant?: 'before' | 'after';
}

const CodeEditorPanel = ({ title, subtitle, code, onChange, variant = 'before' }: CodeEditorPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      className="code-editor-wrapper relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-[#111111] rounded-xl flex items-center justify-center border-2 border-dashed border-[rgba(255,255,255,0.2)]"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-[#666666] mx-auto mb-2" />
              <p className="text-[#a1a1a1] text-sm">Drop your file here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="code-editor-header">
        <div className="flex items-center gap-3">
          <div className="editor-dots">
            <span className="editor-dot dot-red" />
            <span className="editor-dot dot-yellow" />
            <span className="editor-dot dot-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[#fafafa] font-medium text-sm">{title}</h3>
              {variant === 'before' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 uppercase tracking-wider">Old</span>
              )}
              {variant === 'after' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 uppercase tracking-wider">New</span>
              )}
            </div>
            <p className="text-[#666666] text-xs">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePaste}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[#666666] hover:text-[#a1a1a1]"
            title="Paste from clipboard"
          >
            <span className="text-xs">Paste</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-[#666666]" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.go,.rs,.rb,.php,.html,.css,.json,.xml,.yaml,.yml,.md,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            title="Upload file"
          >
            <Upload className="w-4 h-4 text-[#666666]" />
          </button>

          {code && (
            <button
              onClick={() => onChange('')}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              title="Clear"
            >
              <X className="w-4 h-4 text-[#666666]" />
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="h-[350px]">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'none',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            wordWrap: 'on',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
            },
          }}
        />
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs text-[#666666]">
        <span>{code.split('\n').length} lines</span>
        <span>{code.length.toLocaleString()} chars</span>
      </div>
    </motion.div>
  );
};

export default CodeEditorPanel;
