import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CodeInputSection from './components/CodeInputSection';
import OutputSection from './components/OutputSection';
import type { AssumptionChange, AnalysisStats } from './components/OutputSection';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssumptionChange[] | null>(null);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const analyzerRef = useRef<HTMLDivElement>(null);

  const scrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldCode: oldCode || undefined,
          newCode,
          mode: oldCode ? 'compare' : 'single',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze code');
      }

      const data = await response.json();
      setResults(data.results);
      setStats(data.stats);
      setIsAnalyzing(false);
      setShowResults(true);

      // Scroll to results after a short delay
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      setIsAnalyzing(false);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the code');
      console.error('Analysis error:', err);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Header />
        
        <main>
          <Hero onGetStarted={scrollToAnalyzer} />
          
          <Features />
          
          <div ref={analyzerRef}>
            <CodeInputSection
              oldCode={oldCode}
              setOldCode={setOldCode}
              newCode={newCode}
              setNewCode={setNewCode}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {error && (
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
              <div className="glass-card border border-red-500/20 bg-red-500/5 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-red-500 mb-2">Analysis Error</h3>
                <p className="text-[#a1a1a1]">{error}</p>
                <p className="text-sm text-[#666666] mt-2">Make sure the backend server is running on {API_URL}</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showResults && results && stats && (
              <OutputSection
                results={results}
                stats={stats}
                isVisible={showResults}
              />
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
