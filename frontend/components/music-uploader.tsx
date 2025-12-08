"use client";
import { useState } from "react";

type UploadFormData = {
  title: string;
  description: string;
  tags: string;
  category: string;
  genre: string;
  subgenre: string;
  bpm: string;
  key: string;
  mood: string;
  license: string;
};

export function MusicUploader() {
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    tags: "",
    category: "song",
    genre: "",
    subgenre: "",
    bpm: "",
    key: "",
    mood: "",
    license: "free",
  });
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert("Please select an audio file");
      return;
    }

    setUploading(true);
    setSuccess(false);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("tags", formData.tags);
    uploadData.append("category", formData.category);
    uploadData.append("genre", formData.genre);
    uploadData.append("subgenre", formData.subgenre);
    uploadData.append("bpm", formData.bpm);
    uploadData.append("key", formData.key);
    uploadData.append("mood", formData.mood);
    uploadData.append("license", formData.license);
    
    if (coverImage) {
      uploadData.append("coverImage", coverImage);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          title: "",
          description: "",
          tags: "",
          category: "song",
          genre: "",
          subgenre: "",
          bpm: "",
          key: "",
          mood: "",
          license: "free",
        });
        setFile(null);
        setCoverImage(null);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      alert("Error uploading file");
    }

    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f0c] via-[#0f160e] to-[#0b0f0c] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-[#1d2a1c] bg-gradient-to-br from-[#0f1a10] to-[#101610] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-block rounded-2xl bg-[#8BF500]/10 p-4">
              <svg className="h-12 w-12 text-[#8BF500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-3">
              Upload Your Music
            </h2>
            <p className="text-gray-300 text-lg">
              Share your songs, loops, drum kits, sample packs, or MIDI files with the community
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
              placeholder="My Awesome Beat"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
            >
              <option value="song" className="bg-[#111a11] text-white">Song</option>
              <option value="loop" className="bg-[#111a11] text-white">Loop</option>
              <option value="drum-kit" className="bg-[#111a11] text-white">Drum Kit</option>
              <option value="sample-pack" className="bg-[#111a11] text-white">Sample Pack</option>
              <option value="one-shot" className="bg-[#111a11] text-white">One Shot</option>
              <option value="midi" className="bg-[#111a11] text-white">MIDI</option>
              <option value="preset" className="bg-[#111a11] text-white">Preset</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20 resize-none"
              placeholder="Tell us about your creation..."
            />
          </div>

          {/* Genre & Subgenre Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                Genre *
              </label>
              <select
                required
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
              >
                <option value="" className="bg-[#111a11] text-white">Select Genre</option>
                <option value="hip-hop" className="bg-[#111a11] text-white">Hip Hop</option>
                <option value="trap" className="bg-[#111a11] text-white">Trap</option>
                <option value="drill" className="bg-[#111a11] text-white">Drill</option>
                <option value="rnb" className="bg-[#111a11] text-white">R&B</option>
                <option value="pop" className="bg-[#111a11] text-white">Pop</option>
                <option value="electronic" className="bg-[#111a11] text-white">Electronic</option>
                <option value="house" className="bg-[#111a11] text-white">House</option>
                <option value="techno" className="bg-[#111a11] text-white">Techno</option>
                <option value="dubstep" className="bg-[#111a11] text-white">Dubstep</option>
                <option value="rock" className="bg-[#111a11] text-white">Rock</option>
                <option value="indie" className="bg-[#111a11] text-white">Indie</option>
                <option value="jazz" className="bg-[#111a11] text-white">Jazz</option>
                <option value="ambient" className="bg-[#111a11] text-white">Ambient</option>
                <option value="lo-fi" className="bg-[#111a11] text-white">Lo-Fi</option>
                <option value="other" className="bg-[#111a11] text-white">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                Subgenre
              </label>
              <input
                type="text"
                value={formData.subgenre}
                onChange={(e) => setFormData({ ...formData, subgenre: e.target.value })}
                className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
                placeholder="e.g., Detroit Drill, Hyperpop"
              />
            </div>
          </div>

          {/* BPM & Key Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                BPM
              </label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
                placeholder="140"
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                Key
              </label>
              <select
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
              >
                <option value="" className="bg-[#111a11] text-white">Select Key</option>
                <option value="C" className="bg-[#111a11] text-white">C</option>
                <option value="C#" className="bg-[#111a11] text-white">C#</option>
                <option value="D" className="bg-[#111a11] text-white">D</option>
                <option value="D#" className="bg-[#111a11] text-white">D#</option>
                <option value="E" className="bg-[#111a11] text-white">E</option>
                <option value="F" className="bg-[#111a11] text-white">F</option>
                <option value="F#" className="bg-[#111a11] text-white">F#</option>
                <option value="G" className="bg-[#111a11] text-white">G</option>
                <option value="G#" className="bg-[#111a11] text-white">G#</option>
                <option value="A" className="bg-[#111a11] text-white">A</option>
                <option value="A#" className="bg-[#111a11] text-white">A#</option>
                <option value="B" className="bg-[#111a11] text-white">B</option>
                <option value="Cm" className="bg-[#111a11] text-white">C Minor</option>
                <option value="C#m" className="bg-[#111a11] text-white">C# Minor</option>
                <option value="Dm" className="bg-[#111a11] text-white">D Minor</option>
                <option value="D#m" className="bg-[#111a11] text-white">D# Minor</option>
                <option value="Em" className="bg-[#111a11] text-white">E Minor</option>
                <option value="Fm" className="bg-[#111a11] text-white">F Minor</option>
                <option value="F#m" className="bg-[#111a11] text-white">F# Minor</option>
                <option value="Gm" className="bg-[#111a11] text-white">G Minor</option>
                <option value="G#m" className="bg-[#111a11] text-white">G# Minor</option>
                <option value="Am" className="bg-[#111a11] text-white">A Minor</option>
                <option value="A#m" className="bg-[#111a11] text-white">A# Minor</option>
                <option value="Bm" className="bg-[#111a11] text-white">B Minor</option>
              </select>
            </div>
          </div>

          {/* Mood & License Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                Mood/Vibe
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
              >
                <option value="" className="bg-[#111a11] text-white">Select Mood</option>
                <option value="dark" className="bg-[#111a11] text-white">Dark</option>
                <option value="aggressive" className="bg-[#111a11] text-white">Aggressive</option>
                <option value="chill" className="bg-[#111a11] text-white">Chill</option>
                <option value="energetic" className="bg-[#111a11] text-white">Energetic</option>
                <option value="sad" className="bg-[#111a11] text-white">Sad</option>
                <option value="happy" className="bg-[#111a11] text-white">Happy</option>
                <option value="mysterious" className="bg-[#111a11] text-white">Mysterious</option>
                <option value="uplifting" className="bg-[#111a11] text-white">Uplifting</option>
                <option value="mellow" className="bg-[#111a11] text-white">Mellow</option>
                <option value="intense" className="bg-[#111a11] text-white">Intense</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                License *
              </label>
              <select
                required
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
              >
                <option value="free" className="bg-[#111a11] text-white">Free (Personal Use)</option>
                <option value="free-commercial" className="bg-[#111a11] text-white">Free (Commercial Use)</option>
                <option value="royalty-free" className="bg-[#111a11] text-white">Royalty Free</option>
                <option value="exclusive" className="bg-[#111a11] text-white">Exclusive Rights</option>
                <option value="lease" className="bg-[#111a11] text-white">Lease</option>
                <option value="paid" className="bg-[#111a11] text-white">Paid License</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border border-[#273527] bg-[#111a11] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20"
              placeholder="trap, 808, dark, hard"
            />
          </div>

          {/* Audio File */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Audio File *
            </label>
            <div className="border-2 border-dashed border-[#273527] rounded-2xl p-8 text-center hover:border-[#8BF500] hover:bg-[#111a11]/50 transition-all group">
              <input
                type="file"
                accept="audio/*,.zip,.rar,.midi,.mid"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-file"
                required
              />
              <label htmlFor="audio-file" className="cursor-pointer">
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
                  {file ? file.name : "Click to upload audio"}
                </p>
                <p className="text-sm text-gray-400">
                  MP3, WAV, FLAC, ZIP, MIDI, or any audio format
                </p>
              </label>
            </div>
          </div>

          {/* Cover Image (Optional) */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
              Cover Image (Optional)
            </label>
            <div className="border-2 border-dashed border-[#273527] rounded-2xl p-8 text-center hover:border-[#8BF500] hover:bg-[#111a11]/50 transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="hidden"
                id="cover-image"
              />
              <label htmlFor="cover-image" className="cursor-pointer">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-white mb-2">
                  {coverImage ? coverImage.name : "Click to upload cover"}
                </p>
                <p className="text-sm text-gray-400">
                  JPG, PNG, or GIF
                </p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-[#8BF500] to-[#7cde00] text-black py-4 rounded-xl font-bold text-lg hover:from-[#7cde00] hover:to-[#6ad100] transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 shadow-lg shadow-[#8BF500]/20 hover:shadow-[#8BF500]/40 hover:-translate-y-1"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload to OpenArms"
            )}
          </button>

          {/* Success Message */}
          {success && (
            <div className="rounded-xl border border-[#8BF500] bg-[#132312] p-4 text-center">
              <p className="text-[#8BF500] font-semibold flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Successfully uploaded! Your content is now live.
              </p>
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
}
