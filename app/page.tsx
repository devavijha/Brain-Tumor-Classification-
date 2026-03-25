'use client';

import { useState, useRef } from 'react';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface PredictionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
  gradcam?: string;
  modelVersion?: string;
}

import Link from 'next/link';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError('Image size must be less than 10MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process
    await processImage(file);
  };

  const processImage = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during prediction';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      {!image ? (
        <div className="hero-bg min-h-screen flex items-center justify-center overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-20 right-10 w-64 h-64 shape-blob float opacity-20 pointer-events-none" />
          <div className="absolute bottom-20 left-5 w-80 h-80 shape-blob-sm float opacity-15 pointer-events-none" style={{ animationDelay: '1s' }} />

          <div className="max-width-container relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="fade-in">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-4">
                    Clinical-Grade AI
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                  Neuro-Oncology <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Decision Support</span>
                </h1>

                <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                  Advanced machine learning pipeline for rapid, highly accurate MRI tumor classification. Built for scale, validated for precision.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button className="px-8 py-4 rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800 transition-colors duration-300 shadow-lg shadow-gray-200" onClick={() => fileInputRef.current?.click()}>
                    Upload MRI Sequence
                  </button>
                  <button className="px-8 py-4 rounded-full font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-200" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                    System Capabilities
                  </button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-10 pt-8 border-t border-gray-100">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-gray-900">95.4%</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mt-1">Validation AUC</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-gray-900">~2s</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mt-1">Inference Time</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-gray-900">4</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mt-1">Tumor Classes</p>
                  </div>
                </div>
              </div>

              {/* Right - Visual Content */}
              <div className="relative hidden md:flex items-center justify-center">
                {/* Main placeholder with gradient */}
                <div className="relative w-full max-w-md aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-[2rem] transform rotate-3 scale-105 opacity-50" />
                  
                  {/* Main UI abstraction */}
                  <div className="relative bg-white rounded-[2rem] w-full h-full p-8 shadow-2xl shadow-indigo-100/50 border border-white flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                      </div>
                      <div className="w-24 h-6 rounded-full bg-indigo-50 border border-indigo-100" />
                    </div>
                    
                    <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 mb-6 flex items-center justify-center relative overflow-hidden">
                      {/* Grid pattern overlay */}
                      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <div className="w-32 h-32 rounded-full border-4 border-indigo-100 absolute" />
                      <div className="w-48 h-48 rounded-full border border-gray-200 absolute" />
                    </div>

                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 w-48 float">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full w-full mb-2" />
                        <div className="h-2 bg-gray-100 rounded-full w-2/3" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 w-40 float" style={{ animationDelay: '1.5s' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                      <div className="h-3 bg-gray-200 rounded-full w-16" />
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Upload & Results Section */}
      {image || result || error ? (
        <div className="min-h-screen bg-white py-12 md:py-20">
          <div className="max-width-container">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left - Image */}
              <div className="fade-in">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-6">Uploaded Sequence</h2>

                <div className="bg-gray-50 rounded-2xl p-2 border border-gray-100 overflow-hidden">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100/50">
                    <img
                      src={image || ''}
                      alt="Uploaded MRI"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    Upload New
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Clear Canvas
                  </button>
                </div>
              </div>

              {/* Right - Results */}
              <div className="fade-in">
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-6">Analysis Results</h2>

                {loading && <LoadingSpinner />}

                {error && (
                  <div className="card bg-red-50 border border-red-100 p-6 rounded-2xl">
                    <h3 className="text-sm font-semibold text-red-800 mb-1 tracking-tight">System Error</h3>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {result && !loading && <ResultsDisplay result={result} />}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* CTA Section */}
      {!image && (
        <div className="bg-[#0A0A0A] py-24 md:py-32 text-white relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="max-width-container relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Begin Analysis Workflow</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              Integrate advanced visual computing into your diagnostic process instantly. Upload an MRI sequence to validate the pipeline.
            </p>
            <button className="px-8 py-4 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300 shadow-lg shadow-white/10" onClick={() => fileInputRef.current?.click()}>
              Initialize Scan Upload
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/10 text-gray-400 py-16">
        <div className="max-width-container">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <h3 className="text-lg font-semibold tracking-tight text-white">NeuroCore</h3>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Advanced machine learning pipeline for MRI analysis. Developed for research and enterprise healthcare solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Platform</h4>
              <ul className="text-sm space-y-3">
                <li><Link href="/" className="hover:text-white transition-colors">Capabilities</Link></li>
                <li><Link href="/api-reference" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/clinical-validation" className="hover:text-white transition-colors">Clinical Validation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide uppercase mb-4">Legal & Support</h4>
              <ul className="text-sm space-y-3">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Architecture</Link></li>
                <li><Link href="/request-access" className="hover:text-white transition-colors">Contact Ethics Board</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} NeuroCore Systems. For research and educational purposes only.</p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              System Status: All APIs Operational
            </p>
          </div>
        </div>
      </footer>

      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageSelect(file);
          }
        }}
        className="hidden"
      />
    </main>
  );
}
