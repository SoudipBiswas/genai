import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Cpu, 
  Shield, 
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
  Download,
  ChevronDown
} from 'lucide-react';

export interface AssumptionChange {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  description: string;
  oldAssumption: string;
  newAssumption: string;
  impact: string;
  recommendation?: string;
  reasoning?: string;
}

export interface AnalysisStats {
  totalChanges: number;
  criticalCount: number;
  warningCount: number;
  estimatedCostImpact: string;
  performanceImpact: string;
}

interface OutputSectionProps {
  results: AssumptionChange[] | null;
  stats: AnalysisStats | null;
  isVisible: boolean;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, typeof AlertTriangle> = {
    'API Cost': DollarSign,
    'Performance': TrendingUp,
    'Security': Shield,
    'Architecture': Cpu,
    'Timing': Clock,
    'Efficiency': Zap,
  };
  return icons[category] || Info;
};

const getTypeConfig = (type: string) => {
  const configs = {
    critical: {
      icon: XCircle,
      color: '#ef4444',
      label: 'Critical',
    },
    warning: {
      icon: AlertTriangle,
      color: '#f59e0b',
      label: 'Warning',
    },
    info: {
      icon: Info,
      color: '#3b82f6',
      label: 'Info',
    },
    success: {
      icon: CheckCircle2,
      color: '#22c55e',
      label: 'Improved',
    },
  };
  return configs[type as keyof typeof configs] || configs.info;
};

const OutputSection = ({ results, stats, isVisible }: OutputSectionProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!isVisible || !results) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="output-section py-20"
      id="results"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-[#666666] uppercase tracking-wider">Analysis Complete</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-medium text-[#fafafa] mb-4">
            Results
          </h2>
          <p className="text-[#a1a1a1]">
            Found {results.length} assumption change{results.length !== 1 ? 's' : ''} in your code.
          </p>
        </motion.div>

        {/* Stats Row */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 results-stats-grid mb-14"
          >
            {[
              { label: 'Changes', value: stats.totalChanges },
              { label: 'Critical', value: stats.criticalCount, color: '#ef4444' },
              { label: 'Warnings', value: stats.warningCount, color: '#f59e0b' },
              { label: 'Cost Impact', value: stats.estimatedCostImpact || '—' },
            ].map((stat, index) => (
              <div
                key={index}
                className="card p-5"
              >
                <div 
                  className="stat-number"
                  style={stat.color ? { color: stat.color } : {}}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-[#666666] mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Results List */}
        <div className="results-list">
          <AnimatePresence>
            {results.map((change, index) => {
              const config = getTypeConfig(change.type);
              const CategoryIcon = getCategoryIcon(change.category);
              const TypeIcon = config.icon;

              return (
                <motion.div
                  key={change.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`output-card ${change.type}`}
                >
                  <div className="flex items-start gap-6">
                    {/* Type Indicator */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      <TypeIcon className="w-5 h-5" style={{ color: config.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${config.color}15`,
                            color: config.color,
                          }}
                        >
                          {config.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#666666]">
                          <CategoryIcon className="w-3 h-3" />
                          {change.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[#fafafa] font-medium mb-2">
                        {change.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[#a1a1a1] text-sm mb-4">
                        {change.description}
                      </p>

                      {/* Assumption Comparison */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] text-red-400 font-medium mb-1.5 uppercase tracking-wider">
                            Before
                          </div>
                          <p className="text-sm text-[#a1a1a1]">{change.oldAssumption}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] text-green-400 font-medium mb-1.5 uppercase tracking-wider">
                            After
                          </div>
                          <p className="text-sm text-[#a1a1a1]">{change.newAssumption}</p>
                        </div>
                      </div>

                      {/* Impact */}
                      <div className="flex items-start gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-[#a1a1a1]">
                          <span className="text-amber-500 font-medium">Impact:</span> {change.impact}
                        </span>
                      </div>

                      {/* Recommendation */}
                      {change.recommendation && (
                        <div className="mt-4 p-4 rounded-lg bg-[#0f0f0f] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-xs text-[#666666] font-medium mb-1 uppercase tracking-wider">
                            Recommendation
                          </div>
                          <p className="text-sm text-[#a1a1a1]">{change.recommendation}</p>
                        </div>
                      )}

                      {/* Why This Was Flagged Toggle */}
                      {change.reasoning && (
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExpanded(change.id)}
                            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all font-medium"
                          >
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform ${
                                expandedItems.has(change.id) ? 'rotate-180' : ''
                              }`}
                            />
                            <span>Why this was flagged</span>
                          </button>
                          
                          <AnimatePresence>
                            {expandedItems.has(change.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 p-4 rounded-lg bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)]">
                                  <p className="text-sm text-[#a1a1a1] leading-relaxed">
                                    {change.reasoning}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#fafafa] mb-2">
              No significant changes detected
            </h3>
            <p className="text-[#666666]">
              The code modifications don't appear to change any core assumptions.
            </p>
          </motion.div>
        )}

        {/* Action Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mt-10"
        >
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn-primary">
            Analyze Another
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OutputSection;
