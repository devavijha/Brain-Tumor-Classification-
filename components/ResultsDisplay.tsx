'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PredictionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
  gradcam?: string;
  modelVersion?: string;
}

interface ResultsDisplayProps {
  result: PredictionResult;
}

const TUMOR_TYPES = {
  glioma: {
    name: 'Glioma',
    description: 'A tumor arising from glial cells in the brain',
    severity: 'high',
    color: 'from-purple-600 to-purple-700',
  },
  meningioma: {
    name: 'Meningioma',
    description: 'A tumor in the membranes surrounding the brain',
    severity: 'medium',
    color: 'from-purple-500 to-purple-600',
  },
  pituitary: {
    name: 'Pituitary Tumor',
    description: 'A tumor in the pituitary gland',
    severity: 'medium',
    color: 'from-purple-500 to-purple-600',
  },
  notumor: {
    name: 'No Tumor Detected',
    description: 'No abnormalities detected in the scan',
    severity: 'low',
    color: 'from-emerald-500 to-emerald-600',
  },
};

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [showGradcam, setShowGradcam] = useState(false);

  const tumorInfo =
    TUMOR_TYPES[result.prediction.toLowerCase() as keyof typeof TUMOR_TYPES] ||
    TUMOR_TYPES.notumor;

  const confidencePercent = (result.confidence * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="card rounded-2xl p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${tumorInfo.color}`} />
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">{tumorInfo.name}</h2>
            <p className="text-gray-500 text-sm">{tumorInfo.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide border bg-gradient-to-r ${tumorInfo.color} text-transparent bg-clip-text ${tumorInfo.severity === 'low' ? 'border-emerald-200' : 'border-purple-200'}`}>
            {tumorInfo.severity === 'low' ? 'CLEAR' : 'ATTENTION'}
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Confidence Score</span>
            <span className={`text-2xl font-bold bg-gradient-to-r ${tumorInfo.color} bg-clip-text text-transparent`}>
              {confidencePercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${tumorInfo.color} rounded-full transition-all duration-500`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Prediction Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Prediction</p>
            <p className="font-semibold capitalize">{result.prediction}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Timestamp</p>
            <p className="font-semibold text-sm">{new Date(result.timestamp).toLocaleTimeString()}</p>
          </div>
          {result.modelVersion && (
            <div className="col-span-2">
              <p className="text-xs text-gray-600 mb-1">Model Version</p>
              <p className="font-semibold text-sm">{result.modelVersion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Grad-CAM Visualization */}
      {result.gradcam && (
        <div className="card rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowGradcam(!showGradcam)}
            className="w-full flex items-center justify-between hover:bg-gray-50 p-5 smooth-transition bg-white"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" />
              </svg>
              <span className="font-medium text-gray-900">AI Attention Map</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform duration-300 ${showGradcam ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showGradcam && (
            <div className="p-5 pt-0 bg-white">
              <p className="text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                Visualization of regions driving the model&apos;s classification decision.
              </p>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={result.gradcam}
                  alt="Grad-CAM Visualization"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl p-4 bg-gray-50 border border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wide font-medium">
          Note: This tool is for educational and research purposes only. Always consult qualified medical professionals for actual diagnosis and treatment.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link href="/report" className="flex-1 px-4 py-3 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white smooth-transition text-center">
          Download Report
        </Link>
        <Link href="/details" className="flex-1 px-4 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 text-gray-900 smooth-transition text-center">
          View Details
        </Link>
      </div>
    </div>
  );
}
