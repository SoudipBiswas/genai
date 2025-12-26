import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CodeInputSection from './components/CodeInputSection';
import OutputSection from './components/OutputSection';
import type { AssumptionChange } from './components/OutputSection';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

// Mock analysis results for demo purposes
const mockResults: AssumptionChange[] = [
  {
    id: '1',
    type: 'critical',
    category: 'API Cost',
    title: 'Increased API Call Frequency',
    description: 'The modified code introduces a new loop that makes API calls inside, potentially increasing your API costs significantly.',
    oldAssumption: 'API calls were made once per user action',
    newAssumption: 'API calls are now made for each item in the array (N calls per action)',
    impact: 'Could increase API costs by 10-100x depending on array size. Monthly costs may rise from $50 to $500-5000.',
    recommendation: 'Consider batching API calls or implementing caching to reduce the number of requests.',
  },
  {
    id: '2',
    type: 'warning',
    category: 'Performance',
    title: 'O(n) to O(n²) Complexity Change',
    description: 'The nested loop structure changes the time complexity from linear to quadratic.',
    oldAssumption: 'Processing time scaled linearly with input size',
    newAssumption: 'Processing time now scales quadratically with input size',
    impact: 'For 1000 items, processing time increases from ~1ms to ~1000ms. May cause UI freezing on larger datasets.',
    recommendation: 'Use a Map or Set for O(1) lookups instead of nested array searches.',
  },
  {
    id: '3',
    type: 'info',
    category: 'Architecture',
    title: 'State Management Pattern Changed',
    description: 'The code now maintains local state instead of relying on props, changing the data flow pattern.',
    oldAssumption: 'Component was stateless and received all data via props',
    newAssumption: 'Component now manages its own state with useState',
    impact: 'This is a shift from controlled to uncontrolled component pattern. Parent components can no longer directly control this state.',
  },
  {
    id: '4',
    type: 'success',
    category: 'Efficiency',
    title: 'Memoization Added',
    description: 'The expensive calculation is now memoized, preventing unnecessary recalculations.',
    oldAssumption: 'Calculation ran on every render regardless of input changes',
    newAssumption: 'Calculation only runs when dependencies change',
    impact: 'Reduces CPU usage by ~80% for components that re-render frequently. Improves overall app responsiveness.',
  },
];

const mockStats = {
  totalChanges: 4,
  criticalCount: 1,
  warningCount: 1,
  estimatedCostImpact: '+$450/mo',
  performanceImpact: '-15%',
};

function App() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssumptionChange[] | null>(null);
  const analyzerRef = useRef<HTMLDivElement>(null);

  const scrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate API call to Gemini
    await new Promise(resolve => setTimeout(resolve, 2500));

    // In production, this would be the actual Gemini API response
    setResults(mockResults);
    setIsAnalyzing(false);
    setShowResults(true);

    // Scroll to results after a short delay
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
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

          <AnimatePresence>
            {showResults && (
              <OutputSection
                results={results}
                stats={mockStats}
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
