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
      <div className="rounded-3xl border border-[#1d2a1c] bg-gradient-to-br from-[#0f1a10] to-[#101610] p-8 mb-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="inline-block rounded-2xl bg-[#8BF500]/10 p-4 mb-4">
            <svg className="h-12 w-12 text-[#8BF500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white mb-3">
            BPM & Tempo Analyzer
          </h2>
          <p className="text-gray-300 text-lg">
            Upload your audio to detect BPM, key, scale, and beat grid
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <label className="w-full max-w-md">
            <div className="border-2 border-dashed border-[#273527] rounded-2xl p-8 hover:border-[#8BF500] hover:bg-[#111a11]/50 cursor-pointer transition-all group text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="text-white">
                <div className="mb-4 inline-block rounded-xl bg-[#8BF500]/10 p-4 group-hover:bg-[#8BF500]/20 transition-colors">
                  <svg
                    className="w-12 h-12 text-[#8BF500]"
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
                </div>
                <p className="text-lg font-semibold text-white mb-2">
                  {loading ? "Analyzing..." : "Click to upload audio"}
                </p>
                <p className="text-sm text-gray-400">
                  MP3, WAV, FLAC, or any audio format
                </p>
              </div>
            </div>
          </label>

          {loading && (
            <div className="w-full max-w-md">
              <div className="bg-[#1a241a] rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#8BF500] to-[#6ad100] h-full animate-pulse w-3/4"></div>
              </div>
              <p className="text-white text-center mt-2 font-medium">
                Analyzing tempo and key...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && result.success && (
        <div className="space-y-6">
          <h3 className="text-3xl font-black text-white mb-6">
            Analysis Results - {fileName}
          </h3>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 text-center hover:border-[#8BF500] hover:shadow-lg hover:shadow-[#8BF500]/10 transition-all">
              <div className="text-5xl font-black text-[#8BF500] mb-2">
                {result.bpm}
              </div>
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">BPM</div>
            </div>

            <div className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 text-center hover:border-[#8BF500] hover:shadow-lg hover:shadow-[#8BF500]/10 transition-all">
              <div className="text-5xl font-black text-white mb-2">
                {result.key}
              </div>
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Key</div>
            </div>

            <div className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 text-center hover:border-[#8BF500] hover:shadow-lg hover:shadow-[#8BF500]/10 transition-all">
              <div className="text-5xl font-black text-white mb-2">
                {result.scale}
              </div>
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Scale</div>
            </div>

            <div className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 text-center hover:border-[#8BF500] hover:shadow-lg hover:shadow-[#8BF500]/10 transition-all">
              <div className="text-5xl font-black text-white mb-2">
                {result.duration?.toFixed(1)}s
              </div>
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Duration</div>
            </div>
          </div>

          {/* Beat Info */}
          <div className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 hover:border-[#8BF500] hover:shadow-lg hover:shadow-[#8BF500]/10 transition-all">
            <h4 className="text-xl font-bold text-white mb-4">Beat Information</h4>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="font-semibold text-[#8BF500]">Total Beats:</span> {result.beat_count}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-[#8BF500]">Tempo Stability:</span>{" "}
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
            <div className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 hover:border-[#8BF500] hover:shadow-lg hover:shadow-[#8BF500]/10 transition-all">
              <h4 className="text-xl font-bold text-white mb-4">Beat Grid (First 20 beats)</h4>
              <div className="flex flex-wrap gap-2">
                {result.beat_times.slice(0, 20).map((time, idx) => (
                  <div
                    key={idx}
                    className="bg-[#8BF500] text-black px-3 py-2 rounded-lg text-sm font-mono font-bold"
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
        <div className="rounded-2xl border-2 border-red-500/50 bg-gradient-to-br from-red-950/50 to-red-900/30 p-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
          <p className="text-red-300">{result.error}</p>
        </div>
      )}
    </div>
  );
}
