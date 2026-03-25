'use client';

export function LoadingSpinner() {
  return (
    <div className="card rounded-2xl p-12 flex flex-col items-center justify-center bg-white">
      <div className="mb-6">
        <div className="spinner w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full"></div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Analyzing MRI Image</h3>
      <p className="text-gray-600 text-center">
        Our AI model is processing your image. This typically takes 2-5 seconds.
      </p>
      
      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        <div className="w-2 h-2 rounded-full bg-purple-500 pulse-glow"></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 pulse-glow" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 pulse-glow" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
