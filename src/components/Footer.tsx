import { motion } from 'framer-motion';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="px-6 py-16 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-amber-500">A</span>
            <div className="h-4 w-px bg-[rgba(255,255,255,0.1)]" />
            <span className="text-sm text-[#666666]">Assumption Detector</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-[#666666] hover:text-[#a1a1a1] transition-colors">
              Features
            </a>
            <a href="#analyzer" className="text-sm text-[#666666] hover:text-[#a1a1a1] transition-colors">
              Analyzer
            </a>
            <a href="https://github.com" className="text-sm text-[#666666] hover:text-[#a1a1a1] transition-colors">
              GitHub
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
              whileHover={{ y: -2 }}
            >
              <Github className="w-4 h-4 text-[#666666]" />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
              whileHover={{ y: -2 }}
            >
              <Twitter className="w-4 h-4 text-[#666666]" />
            </motion.a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-sm text-[#666666]">
            © {new Date().getFullYear()} Assumption Detector. Built for developers who care about code semantics.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
