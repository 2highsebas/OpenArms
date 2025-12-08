"use client";
import { useState } from "react";

type Stems = {
  vocals: string;
  drums: string;
  bass: string;
  other: string;
};

export function StemUploader() {
  const [loading, setLoading] = useState(false);
  const [stems, setStems] = useState<Stems | null>(null);
  const [fileName, setFileName] = useState<string>("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setLoading(true);
    setStems(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/stems", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to process audio");
      }

      const data = await res.json();
      
      // Check if all stems exist
      if (!data.vocals || !data.drums || !data.bass || !data.other) {
        throw new Error("Incomplete stem separation - missing audio data");
      }

      setStems({
        vocals: `data:audio/wav;base64,${data.vocals}`,
        drums: `data:audio/wav;base64,${data.drums}`,
        bass: `data:audio/wav;base64,${data.bass}`,
        other: `data:audio/wav;base64,${data.other}`,
      });
    } catch (error) {
      console.error("Stem separation error:", error);
      alert(`Error processing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setLoading(false);
  }

  function downloadStem(stemData: string, stemName: string) {
    const link = document.createElement("a");
    link.href = stemData;
    link.download = `${fileName}_${stemName}.wav`;
    link.click();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Upload Section */}
      <div className="rounded-3xl border border-[#1d2a1c] bg-gradient-to-br from-[#0f1a10] to-[#101610] p-8 mb-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="inline-block rounded-2xl bg-[#8BF500]/10 p-4 mb-4">
            <svg className="h-12 w-12 text-[#8BF500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white mb-3">
            AI Stem Separator
          </h2>
          <p className="text-gray-300 text-lg">
            Upload your audio file and we'll split it into separate stems
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-white mb-2">
                  {loading ? "Processing..." : "Click to upload audio"}
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
                Separating stems... This may take a minute
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {stems && (
        <div className="space-y-4">
          <h3 className="text-3xl font-black text-white mb-6">
            Separated Stems
          </h3>

          {[
            { name: "Vocals", key: "vocals" as keyof Stems },
            { name: "Drums", key: "drums" as keyof Stems },
            { name: "Bass", key: "bass" as keyof Stems },
            { name: "Other Instruments", key: "other" as keyof Stems },
          ].map(({ name, key }) => (
            <div
              key={key}
              className="rounded-2xl border border-[#1d2a1c] bg-gradient-to-br from-[#121b12] to-[#0a120a] p-6 shadow-xl hover:border-[#8BF500] hover:shadow-2xl hover:shadow-[#8BF500]/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-white">{name}</h4>
                <button
                  onClick={() => downloadStem(stems[key], key)}
                  className="bg-gradient-to-r from-[#8BF500] to-[#6ad100] text-black px-6 py-2.5 rounded-xl font-bold hover:from-[#7cde00] hover:to-[#5bc000] active:scale-95 transition-all shadow-lg shadow-[#8BF500]/20"
                >
                  Download
                </button>
              </div>
              <audio controls src={stems[key]} className="w-full [&::-webkit-media-controls-panel]:bg-[#0d140d] [&::-webkit-media-controls-panel]:border [&::-webkit-media-controls-panel]:border-[#273527] [&::-webkit-media-controls-panel]:rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
