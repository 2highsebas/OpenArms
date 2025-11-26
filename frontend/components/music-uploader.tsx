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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border-2 border-black rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-black mb-4">
          Upload Your Music
        </h2>
        <p className="text-gray-600 mb-8">
          Share your songs, loops, drum kits, sample packs, or MIDI files with the community
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="My Awesome Beat"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="song">Song</option>
              <option value="loop">Loop</option>
              <option value="drum-kit">Drum Kit</option>
              <option value="sample-pack">Sample Pack</option>
              <option value="one-shot">One Shot</option>
              <option value="midi">MIDI</option>
              <option value="preset">Preset</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Tell us about your creation..."
            />
          </div>

          {/* Genre & Subgenre Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Genre *
              </label>
              <select
                required
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Genre</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="trap">Trap</option>
                <option value="drill">Drill</option>
                <option value="rnb">R&B</option>
                <option value="pop">Pop</option>
                <option value="electronic">Electronic</option>
                <option value="house">House</option>
                <option value="techno">Techno</option>
                <option value="dubstep">Dubstep</option>
                <option value="rock">Rock</option>
                <option value="indie">Indie</option>
                <option value="jazz">Jazz</option>
                <option value="ambient">Ambient</option>
                <option value="lo-fi">Lo-Fi</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Subgenre
              </label>
              <input
                type="text"
                value={formData.subgenre}
                onChange={(e) => setFormData({ ...formData, subgenre: e.target.value })}
                className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Detroit Drill, Hyperpop"
              />
            </div>
          </div>

          {/* BPM & Key Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                BPM
              </label>
              <input
                type="number"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="140"
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Key
              </label>
              <select
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Key</option>
                <option value="C">C</option>
                <option value="C#">C#</option>
                <option value="D">D</option>
                <option value="D#">D#</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="F#">F#</option>
                <option value="G">G</option>
                <option value="G#">G#</option>
                <option value="A">A</option>
                <option value="A#">A#</option>
                <option value="B">B</option>
                <option value="Cm">C Minor</option>
                <option value="C#m">C# Minor</option>
                <option value="Dm">D Minor</option>
                <option value="D#m">D# Minor</option>
                <option value="Em">E Minor</option>
                <option value="Fm">F Minor</option>
                <option value="F#m">F# Minor</option>
                <option value="Gm">G Minor</option>
                <option value="G#m">G# Minor</option>
                <option value="Am">A Minor</option>
                <option value="A#m">A# Minor</option>
                <option value="Bm">B Minor</option>
              </select>
            </div>
          </div>

          {/* Mood & License Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Mood/Vibe
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Mood</option>
                <option value="dark">Dark</option>
                <option value="aggressive">Aggressive</option>
                <option value="chill">Chill</option>
                <option value="energetic">Energetic</option>
                <option value="sad">Sad</option>
                <option value="happy">Happy</option>
                <option value="mysterious">Mysterious</option>
                <option value="uplifting">Uplifting</option>
                <option value="mellow">Mellow</option>
                <option value="intense">Intense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                License *
              </label>
              <select
                required
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="free">Free (Personal Use)</option>
                <option value="free-commercial">Free (Commercial Use)</option>
                <option value="royalty-free">Royalty Free</option>
                <option value="exclusive">Exclusive Rights</option>
                <option value="lease">Lease</option>
                <option value="paid">Paid License</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="trap, 808, dark, hard"
            />
          </div>

          {/* Audio File */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Audio File *
            </label>
            <div className="border-2 border-dashed border-black rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="audio/*,.zip,.rar,.midi,.mid"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-file"
                required
              />
              <label htmlFor="audio-file" className="cursor-pointer">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-black"
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
                <p className="text-lg font-semibold text-black mb-2">
                  {file ? file.name : "Click to upload audio"}
                </p>
                <p className="text-sm text-gray-600">
                  MP3, WAV, FLAC, ZIP, MIDI, or any audio format
                </p>
              </label>
            </div>
          </div>

          {/* Cover Image (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Cover Image (Optional)
            </label>
            <div className="border-2 border-dashed border-black rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="hidden"
                id="cover-image"
              />
              <label htmlFor="cover-image" className="cursor-pointer">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-black"
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
                <p className="text-lg font-semibold text-black mb-2">
                  {coverImage ? coverImage.name : "Click to upload cover"}
                </p>
                <p className="text-sm text-gray-600">
                  JPG, PNG, or GIF
                </p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload to OpenArms"}
          </button>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">
                ✓ Successfully uploaded! Your content is now live.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
