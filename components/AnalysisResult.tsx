import React from 'react';
import { PlantAnalysis, HealthStatus } from '../types';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle, AlertTriangle, XCircle, Sprout, ThermometerSun, ShieldCheck } from 'lucide-react';

interface AnalysisResultProps {
  analysis: PlantAnalysis;
  onReset: () => void;
  imageUrl: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset, imageUrl }) => {
  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return 'text-green-600';
      case HealthStatus.NEEDS_ATTENTION: return 'text-yellow-600';
      case HealthStatus.CRITICAL: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.HEALTHY: return <CheckCircle className="w-8 h-8 text-green-500" />;
      case HealthStatus.NEEDS_ATTENTION: return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case HealthStatus.CRITICAL: return <XCircle className="w-8 h-8 text-red-500" />;
      default: return <Sprout className="w-8 h-8 text-gray-500" />;
    }
  };

  const chartData = [{
    name: 'Health',
    value: analysis.healthScore,
    fill: analysis.healthScore > 80 ? '#16a34a' : analysis.healthScore > 50 ? '#ca8a04' : '#dc2626'
  }];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Image */}
      <div className="relative h-64 w-full bg-gray-100">
        <img 
          src={imageUrl} 
          alt="Analyzed Plant" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white w-full">
            <h2 className="text-3xl font-bold">{analysis.plantName}</h2>
            <p className="text-white/80 italic">{analysis.scientificName}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Health Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center justify-center bg-green-50 rounded-xl p-4">
            <div className="h-40 w-40 relative">
               <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  barSize={10} 
                  data={chartData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={30} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{analysis.healthScore}%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Health Score</span>
              </div>
            </div>
            <div className={`mt-2 flex items-center gap-2 font-semibold ${getStatusColor(analysis.healthStatus)}`}>
              {getStatusIcon(analysis.healthStatus)}
              {analysis.healthStatus}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <ThermometerSun className="w-5 h-5 text-green-600" />
              Diagnosis
            </h3>
            <p className="text-gray-700 font-medium text-lg border-l-4 border-green-400 pl-4 py-1">
              {analysis.diagnosis}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {analysis.detailedDescription}
            </p>
          </div>
        </div>

        {/* Action Plan */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-600" />
            Care Instructions
          </h3>
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-100">
            {analysis.careInstructions.map((step, idx) => (
              <div key={idx} className="p-4 flex gap-4 hover:bg-green-50/50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preventative Measures */}
        {analysis.preventativeMeasures && analysis.preventativeMeasures.length > 0 && (
          <div className="bg-indigo-50 rounded-xl p-6">
             <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Prevention Tips
             </h3>
             <ul className="list-disc list-inside space-y-2 text-indigo-800">
               {analysis.preventativeMeasures.map((tip, i) => (
                 <li key={i}>{tip}</li>
               ))}
             </ul>
          </div>
        )}

        <button 
          onClick={onReset}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Sprout className="w-5 h-5" />
          Diagnose Another Plant
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;