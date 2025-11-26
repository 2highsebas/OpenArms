"use client";
import { useState } from "react";

type TempoResult = {
  success: boolean;
  bpm?: number;
  key?: string;
  scale?: string;
  duration?: number;
  beat_count?: number;
  beat_times?: number[];
  tempo_confidence?: number;
  error?: string;
};

export function TempoAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TempoResult | null>(null);
  const [fileName, setFileName] = useState<string>("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/tempo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to analyze audio"
      });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Upload Section */}
      <div className="bg-white border-2 border-black rounded-lg p-8 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold text-black mb-4 text-center">
          BPM & Tempo Analyzer
        </h2>
        <p className="text-black text-center mb-6">
          Upload your audio to detect BPM, key, scale, and beat grid
        </p>

        <div className="flex flex-col items-center gap-4">
          <label className="w-full max-w-md">
            <div className="border-2 border-dashed border-black rounded-lg p-8 hover:bg-gray-50 cursor-pointer transition-colors text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="text-black">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <p className="text-lg font-semibold mb-2">
                  {loading ? "Analyzing..." : "Click to upload audio"}
                </p>
                <p className="text-sm text-gray-600">
                  MP3, WAV, FLAC, or any audio format
                </p>
              </div>
            </div>
          </label>

          {loading && (
            <div className="w-full max-w-md">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-black h-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-black text-center mt-2 font-medium">
                Analyzing tempo and key...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && result.success && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-black mb-6">
            Analysis Results - {fileName}
          </h3>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-5xl font-bold text-black mb-2">
                {result.bpm}
              </div>
              <div className="text-sm font-semibold text-gray-600">BPM</div>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-5xl font-bold text-black mb-2">
                {result.key}
              </div>
              <div className="text-sm font-semibold text-gray-600">Key</div>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-5xl font-bold text-black mb-2">
                {result.scale}
              </div>
              <div className="text-sm font-semibold text-gray-600">Scale</div>
            </div>

            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <div className="text-5xl font-bold text-black mb-2">
                {result.duration?.toFixed(1)}s
              </div>
              <div className="text-sm font-semibold text-gray-600">Duration</div>
            </div>
          </div>

          {/* Beat Info */}
          <div className="bg-white border-2 border-black rounded-lg p-6">
            <h4 className="text-xl font-bold text-black mb-4">Beat Information</h4>
            <div className="space-y-2">
              <p className="text-black">
                <span className="font-semibold">Total Beats:</span> {result.beat_count}
              </p>
              <p className="text-black">
                <span className="font-semibold">Tempo Stability:</span>{" "}
                {result.tempo_confidence && result.tempo_confidence < 10
                  ? "Very Stable"
                  : result.tempo_confidence && result.tempo_confidence < 20
                  ? "Stable"
                  : "Variable"}
              </p>
            </div>
          </div>

          {/* Beat Grid Visualization */}
          {result.beat_times && result.beat_times.length > 0 && (
            <div className="bg-white border-2 border-black rounded-lg p-6">
              <h4 className="text-xl font-bold text-black mb-4">Beat Grid (First 20 beats)</h4>
              <div className="flex flex-wrap gap-2">
                {result.beat_times.map((time, idx) => (
                  <div
                    key={idx}
                    className="bg-black text-white px-3 py-2 rounded text-sm font-mono"
                  >
                    {time.toFixed(2)}s
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {result && !result.success && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-2">Analysis Failed</h3>
          <p className="text-red-700">{result.error}</p>
        </div>
      )}
    </div>
  );
}
