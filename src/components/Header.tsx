import { motion } from 'framer-motion';
import { Github, ArrowRight } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo - Simple text mark */}
          <motion.a
            href="/"
            className="flex items-center gap-2"
            whileHover={{ opacity: 0.8 }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
              <span className="text-amber-500 font-semibold text-sm">A</span>
            </div>
            <span className="font-medium text-[#fafafa]">AssumptionLens</span>
          </motion.a>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Simple text links */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                Features
              </a>
              <a href="#analyzer" className="text-sm text-[#a1a1a1] hover:text-[#fafafa] transition-colors">
                Analyzer
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <motion.a
                href="https://github.com/SoudipBiswas/genai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 text-[#666666]" />
              </motion.a>
              
              <motion.button
                className="btn-primary text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
