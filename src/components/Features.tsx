import { motion } from 'framer-motion';
import { Brain, Zap, Shield, TrendingUp, Code2, GitCompare } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Understands the semantic meaning behind your code changes, not just line differences.',
  },
  {
    icon: TrendingUp,
    title: 'Cost Impact Estimation',
    description: 'Detect changes that could affect API costs, compute resources, or infrastructure spending.',
  },
  {
    icon: Zap,
    title: 'Performance Insights',
    description: 'Identify performance implications from algorithmic changes and data structure modifications.',
  },
  {
    icon: Shield,
    title: 'Security Assumptions',
    description: 'Detect changes in authentication flows, authorization logic, and data handling patterns.',
  },
  {
    icon: Code2,
    title: 'Architecture Changes',
    description: 'Understand when code changes affect the overall architecture or system design.',
  },
  {
    icon: GitCompare,
    title: 'Language Agnostic',
    description: 'Works with any programming language. Just paste your code and let AI do the work.',
  },
];

const Features = () => {
  return (
    <section className="px-6 py-24" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <span className="text-sm text-[#666666] uppercase tracking-wider mb-4 block">Features</span>
          <h2 className="text-3xl md:text-4xl font-medium text-[#fafafa] mb-4">
            More than a diff tool
          </h2>
          <p className="text-[#a1a1a1] max-w-xl">
            Traditional diff tools show you what changed. We show you what that change means for your system.
          </p>
        </motion.div>

        {/* Features Grid - Clean bento-style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card p-6 group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center mb-4 group-hover:bg-[#222222] transition-colors">
                <feature.icon className="w-5 h-5 text-[#666666] group-hover:text-amber-500 transition-colors" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="text-[#fafafa] font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
