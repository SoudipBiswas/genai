import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditorPanel from './CodeEditorPanel';
import { ArrowRight, Loader2 } from 'lucide-react';

interface CodeInputSectionProps {
  oldCode: string;
  setOldCode: (code: string) => void;
  newCode: string;
  setNewCode: (code: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

type InputMode = 'compare' | 'single';

const CodeInputSection = ({
  oldCode,
  setOldCode,
  newCode,
  setNewCode,
  onAnalyze,
  isAnalyzing
}: CodeInputSectionProps) => {
  const [inputMode, setInputMode] = useState<InputMode>('compare');

  const canAnalyze = inputMode === 'compare' 
    ? oldCode.trim().length > 0 && newCode.trim().length > 0
    : newCode.trim().length > 0;

  return (
    <section className="px-6 py-24" id="analyzer">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <span className="text-sm text-[#666666] uppercase tracking-wider mb-4 block">Analyzer</span>
          <h2 className="text-3xl md:text-4xl font-medium text-[#fafafa] mb-4">
            Paste your code
          </h2>
          <p className="text-[#a1a1a1] max-w-xl">
            Compare two versions of your code to detect assumption changes, or analyze a single file.
          </p>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <div className="mode-selector inline-flex">
            <button
              onClick={() => setInputMode('compare')}
              className={`mode-option ${inputMode === 'compare' ? 'active' : ''}`}
            >
              Compare versions
            </button>
            <button
              onClick={() => setInputMode('single')}
              className={`mode-option ${inputMode === 'single' ? 'active' : ''}`}
            >
              Single file
            </button>
          </div>
        </motion.div>

        {/* Code Editors */}
        <AnimatePresence mode="wait">
          {inputMode === 'compare' ? (
            <motion.div
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <CodeEditorPanel
                title="Original Code"
                subtitle="Paste your previous version"
                code={oldCode}
                onChange={setOldCode}
                variant="before"
              />

              <CodeEditorPanel
                title="Modified Code"
                subtitle="Paste your updated version"
                code={newCode}
                onChange={setNewCode}
                variant="after"
              />
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl"
            >
              <CodeEditorPanel
                title="Your Code"
                subtitle="Paste code to analyze assumptions"
                code={newCode}
                onChange={setNewCode}
              />
              <p className="text-[#666666] text-sm mt-4">
                AI will infer baseline assumptions and detect potential issues.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8"
        >
          <motion.button
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="btn-primary px-6 py-3"
            whileHover={canAnalyze && !isAnalyzing ? { scale: 1.02 } : {}}
            whileTap={canAnalyze && !isAnalyzing ? { scale: 0.98 } : {}}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Changes</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CodeInputSection;
