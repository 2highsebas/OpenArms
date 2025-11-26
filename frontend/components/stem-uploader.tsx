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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/stems", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setStems({
        vocals: `data:audio/wav;base64,${data.vocals}`,
        drums: `data:audio/wav;base64,${data.drums}`,
        bass: `data:audio/wav;base64,${data.bass}`,
        other: `data:audio/wav;base64,${data.other}`,
      });
    } catch (error) {
      alert("Error processing audio");
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
      <div className="bg-white border-2 border-black rounded-lg p-8 mb-8 shadow-lg">
        <h2 className="text-3xl font-bold text-black mb-4 text-center">
          AI Stem Separator
        </h2>
        <p className="text-black text-center mb-6">
          Upload your audio file and we'll split it into separate stems
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg font-semibold mb-2">
                  {loading ? "Processing..." : "Click to upload audio"}
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
                Separating stems... This may take a minute
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {stems && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-black mb-6">
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
              className="bg-white border-2 border-black rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-black">{name}</h4>
                <button
                  onClick={() => downloadStem(stems[key], key)}
                  className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Download
                </button>
              </div>
              <audio controls src={stems[key]} className="w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
