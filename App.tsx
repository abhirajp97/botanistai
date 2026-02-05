import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import { analyzePlant } from './services/geminiService';
import { PlantAnalysis, HistoryItem } from './types';
import { History, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('plant_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const handleImageSelected = async (base64Image: string) => {
    setCurrentImage(base64Image);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePlant(base64Image);
      setAnalysis(result);
      
      // Save to history
      const newHistoryItem: HistoryItem = {
        ...result,
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: base64Image
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('plant_history', JSON.stringify(updatedHistory));

    } catch (err: any) {
      setError(err.message || "Failed to analyze image. Please try again.");
      setCurrentImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setAnalysis(null);
    setError(null);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setCurrentImage(item.imageUrl);
    setAnalysis(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-gray-800 pb-20">
      <Header />

      <main className="container mx-auto px-4 mt-8 flex flex-col items-center">
        
        {/* Error Notification */}
        {error && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between animate-pulse">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        )}

        {/* Main Content Area */}
        {!analysis ? (
          <div className="w-full flex flex-col items-center gap-12">
            <div className="text-center max-w-2xl space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
                Your Personal <span className="text-green-600">AI Plant Doctor</span>
              </h1>
              <p className="text-lg text-gray-600">
                Identify plants, diagnose diseases, and get expert care tips instantly with advanced AI analysis.
              </p>
            </div>

            <ImageUploader 
              onImageSelected={handleImageSelected} 
              isLoading={isLoading} 
            />

            {/* Recent History Section */}
            {history.length > 0 && !isLoading && (
              <div className="w-full max-w-4xl mt-12">
                <div className="flex items-center gap-2 mb-4 text-gray-500 font-semibold uppercase tracking-wider text-sm">
                  <History className="w-4 h-4" />
                  Recent Scans
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {history.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition text-left flex items-center gap-3 border border-transparent hover:border-green-200 group"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.plantName} 
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{item.plantName}</h4>
                        <p className={`text-xs truncate font-medium ${
                          item.healthStatus === 'Healthy' ? 'text-green-600' : 'text-orange-500'
                        }`}>
                          {item.healthStatus}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnalysisResult 
            analysis={analysis} 
            onReset={handleReset} 
            imageUrl={currentImage || ''}
          />
        )}
      </main>

      <footer className="mt-20 py-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} BotanistAI. Powered by Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;