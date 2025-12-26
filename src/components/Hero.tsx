import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="min-h-screen flex flex-col justify-center hero-section">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <span className="badge badge-accent">
            Beyond Simple Diffs
          </span>
        </motion.div>

        {/* Main Heading - Clean typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-[#fafafa] mb-6 hero-heading"
        >
          Detect assumption
          <br />
          <span className="text-[#666666]">changes in your code</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl hero-subtitle leading-relaxed"
        >
          Don't just see what changed—understand why it matters.
          Analyze semantic shifts, API cost implications, and performance impacts.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            onClick={onGetStarted}
            className="btn-primary text-base px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Start Analyzing</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            className="btn-secondary text-base px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            See how it works
          </motion.button>
        </motion.div>

        {/* Simple stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-x-10 gap-y-4 mt-16 pt-10 border-t border-[rgba(255,255,255,0.06)]"
        >
          {[
            { value: '10x', label: 'Faster code reviews' },
            { value: '500+', label: 'Developers using it' },
            { value: '24/7', label: 'AI-powered analysis' },
          ].map((stat, index) => (
            <div key={index} className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-[#fafafa]">{stat.value}</span>
              <span className="text-sm text-[#666666]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-2 rounded-full border border-[rgba(255,255,255,0.1)]"
        >
          <ArrowDown className="w-4 h-4 text-[#666666]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
