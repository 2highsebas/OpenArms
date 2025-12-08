"use client";
import { useState, useEffect, useMemo } from "react";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

type MusicItem = {
  id: string;
  title: string;
  category: string;
  genre: string;
  subgenre: string;
  bpm: number | null;
  key: string;
  mood: string;
  license: string;
  tags: string[];
  filename: string;
  coverImage: string | null;
  uploadDate: string;
  fileSize: number;
};

export function MarketplaceListing() {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [bpmRange, setBpmRange] = useState<[number, number]>([60, 180]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    { value: "all", label: "All" },
    { value: "loop", label: "Loops" },
    { value: "drum-kit", label: "Drum Kits" },
    { value: "sample-pack", label: "Sample Packs" },
    { value: "one-shot", label: "One Shots" },
    { value: "midi", label: "MIDI" },
    { value: "preset", label: "Presets" },
    { value: "song", label: "Songs" },
  ];

  const genres = [
    "all",
    "hip-hop",
    "trap",
    "drill",
    "rnb",
    "pop",
    "electronic",
    "house",
    "techno",
    "dubstep",
    "rock",
    "indie",
    "jazz",
    "ambient",
    "lo-fi",
  ];

  const moods = [
    "all",
    "dark",
    "aggressive",
    "chill",
    "energetic",
    "sad",
    "happy",
    "mysterious",
    "uplifting",
    "mellow",
    "intense",
  ];

  const popularTags = useMemo(
    () => ["trap", "melody", "808", "analog", "pad", "vocals", "fx", "piano", "guitar", "texture"],
    []
  );

  const bpmPresets = [
    { label: "Slow", range: [60, 90] as [number, number] },
    { label: "Mid", range: [90, 130] as [number, number] },
    { label: "Fast", range: [130, 180] as [number, number] },
    { label: "All", range: [40, 200] as [number, number] },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, selectedCategory, selectedGenre, selectedMood, bpmRange, searchQuery, selectedTags]);

  async function fetchItems() {
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      setItems(data.uploads || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...items];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((item) => item.genre === selectedGenre);
    }

    if (selectedMood !== "all") {
      filtered = filtered.filter((item) => item.mood === selectedMood);
    }

    filtered = filtered.filter((item) => {
      if (!item.bpm) return true;
      return item.bpm >= bpmRange[0] && item.bpm <= bpmRange[1];
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) || item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        selectedTags.every((tag) => item.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }

  function resetFilters() {
    setSelectedCategory("all");
    setSelectedGenre("all");
    setSelectedMood("all");
    setBpmRange([60, 180]);
    setSearchQuery("");
    setSelectedTags([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f0c] via-[#0f160e] to-[#0b0f0c] text-white">
      <NavbarSolid />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#1d2a1c]/50 bg-gradient-to-br from-[#0f1a10] via-[#0d1a0e] to-[#0a1508] px-8 py-12 shadow-2xl">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, #8BF50033, transparent 50%), radial-gradient(circle at 70% 80%, #6ad10022, transparent 60%)",
            }}
          ></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8BF500] opacity-[0.03] blur-[120px] rounded-full" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8BF500]/30 bg-[#8BF500]/10 px-4 py-1.5">
                <div className="h-2 w-2 rounded-full bg-[#8BF500] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9adf36]">Loop & Kits Hub</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] text-white tracking-tight">
                Modern marketplace
                <br />
                for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BF500] to-[#6ad100]">
                  loops & samples
                </span>
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Filter fast, preview instantly, and download in one click. Professional-grade sounds with BPM & key
                awareness.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-[#2b3b2a] bg-[#0f1a10] px-4 py-1.5 text-sm font-medium text-[#9adf36]">
                  ✨ Curated daily
                </span>
                <span className="rounded-full border border-[#2b3b2a] bg-[#0f1a10] px-4 py-1.5 text-sm font-medium text-[#9adf36]">
                  🎹 BPM & Key aware
                </span>
                <span className="rounded-full border border-[#2b3b2a] bg-[#0f1a10] px-4 py-1.5 text-sm font-medium text-[#9adf36]">
                  💎 Free + Paid
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
              {[
                { label: "Loops", count: "5.2K+" },
                { label: "Kits", count: "1.8K+" },
                { label: "Samples", count: "12K+" },
                { label: "MIDI", count: "3.4K+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-[#2b3b2a] bg-gradient-to-br from-[#111a11] to-[#0d140d] p-4 hover:border-[#8BF500]/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8BF500]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="relative text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="relative text-3xl font-black text-white mt-1">{stat.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky top-16 z-40">
          <div className="rounded-2xl border border-[#1d2a1c]/60 bg-[#0f1a10]/95 backdrop-blur-xl px-6 py-5 shadow-2xl shadow-black/20">
            <div className="space-y-5">
              {/* Row 1: Search + Basic Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-[#273527] bg-[#0d140d] px-4 py-3 pl-10 text-sm text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all"
                      placeholder="Search by title, tags, or artist..."
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#273527] bg-[#0d140d] px-4 py-3 text-sm text-white focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value} className="bg-[#0d140d] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full rounded-xl border border-[#273527] bg-[#0d140d] px-4 py-3 text-sm text-white focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all cursor-pointer"
                  >
                    {genres.map((g) => (
                      <option key={g} value={g} className="bg-[#0d140d] text-white capitalize">
                        {g === "all" ? "All Genres" : g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
                    Mood
                  </label>
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="w-full rounded-xl border border-[#273527] bg-[#0d140d] px-4 py-3 text-sm text-white focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all cursor-pointer"
                  >
                    {moods.map((m) => (
                      <option key={m} value={m} className="bg-[#0d140d] text-white capitalize">
                        {m === "all" ? "All Moods" : m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">BPM Range</label>
                    <div className="flex gap-2">
                      {bpmPresets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setBpmRange(preset.range)}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                            bpmRange[0] === preset.range[0] && bpmRange[1] === preset.range[1]
                              ? "bg-[#8BF500] text-black"
                              : "bg-[#0d140d] text-gray-400 border border-[#273527] hover:border-[#8BF500]/50 hover:text-[#8BF500]"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Number inputs */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="number"
                            min={40}
                            max={200}
                            value={bpmRange[0]}
                            onChange={(e) => {
                              const val = Math.max(40, Math.min(Number(e.target.value), bpmRange[1] - 1));
                              setBpmRange([val, bpmRange[1]]);
                            }}
                            className="w-full rounded-xl border border-[#273527] bg-[#0d140d] px-4 py-3 pr-12 text-sm font-semibold text-white focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                            BPM
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d140d] border border-[#273527]">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="number"
                            min={40}
                            max={200}
                            value={bpmRange[1]}
                            onChange={(e) => {
                              const val = Math.min(200, Math.max(Number(e.target.value), bpmRange[0] + 1));
                              setBpmRange([bpmRange[0], val]);
                            }}
                            className="w-full rounded-xl border border-[#273527] bg-[#0d140d] px-4 py-3 pr-12 text-sm font-semibold text-white focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                            BPM
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced dual range slider */}
                    <div className="relative pt-2 pb-1">
                      <div className="relative h-2 rounded-full bg-[#1a241a]">
                        {/* Active range highlight */}
                        <div
                          className={`absolute h-2 rounded-full bg-gradient-to-r from-[#8BF500] to-[#6ad100] transition-all ${
                            isDragging ? "shadow-lg shadow-[#8BF500]/40" : ""
                          }`}
                          style={{
                            left: `${((bpmRange[0] - 40) / 160) * 100}%`,
                            right: `${100 - ((bpmRange[1] - 40) / 160) * 100}%`,
                          }}
                        />

                        {/* Min slider */}
                        <input
                          type="range"
                          min={40}
                          max={200}
                          value={bpmRange[0]}
                          onChange={(e) =>
                            setBpmRange([Math.min(Number(e.target.value), bpmRange[1] - 1), bpmRange[1]])
                          }
                          onMouseDown={() => setIsDragging(true)}
                          onMouseUp={() => setIsDragging(false)}
                          onTouchStart={() => setIsDragging(true)}
                          onTouchEnd={() => setIsDragging(false)}
                          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8BF500] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#0f1a10] [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                        />

                        {/* Max slider */}
                        <input
                          type="range"
                          min={40}
                          max={200}
                          value={bpmRange[1]}
                          onChange={(e) =>
                            setBpmRange([bpmRange[0], Math.max(Number(e.target.value), bpmRange[0] + 1)])
                          }
                          onMouseDown={() => setIsDragging(true)}
                          onMouseUp={() => setIsDragging(false)}
                          onTouchStart={() => setIsDragging(true)}
                          onTouchEnd={() => setIsDragging(false)}
                          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8BF500] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#0f1a10] [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                        />
                      </div>

                      {/* BPM scale markers */}
                      <div className="flex justify-between mt-2 px-1">
                        {[40, 80, 120, 160, 200].map((bpm) => (
                          <span key={bpm} className="text-[10px] font-medium text-gray-500">
                            {bpm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags section */}
                <div className="lg:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 block">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customTagInput.trim()) {
                            e.preventDefault();
                            const tag = customTagInput.trim().toLowerCase();
                            if (!selectedTags.includes(tag)) {
                              setSelectedTags([...selectedTags, tag]);
                            }
                            setCustomTagInput("");
                          }
                        }}
                        placeholder="Type tag + Enter"
                        className="flex-1 rounded-xl border border-[#273527] bg-[#0d140d] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:ring-2 focus:ring-[#8BF500]/20 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customTagInput.trim()) {
                            const tag = customTagInput.trim().toLowerCase();
                            if (!selectedTags.includes(tag)) {
                              setSelectedTags([...selectedTags, tag]);
                            }
                            setCustomTagInput("");
                          }
                        }}
                        className="rounded-xl bg-[#8BF500] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#7cde00] active:scale-95 transition-all"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              setSelectedTags((prev) =>
                                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                              active
                                ? "border-[#8BF500] bg-[#8BF500]/20 text-[#8BF500] shadow-lg shadow-[#8BF500]/10"
                                : "border-[#273527] bg-[#0d140d] text-gray-300 hover:border-[#8BF500]/50 hover:text-[#8BF500]"
                            }`}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                      {selectedTags
                        .filter((t) => !popularTags.includes(t))
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                            className="rounded-full border border-[#8BF500] bg-[#8BF500]/20 px-3 py-1.5 text-xs font-semibold text-[#8BF500] hover:bg-[#8BF500]/30 active:scale-95 transition-all"
                          >
                            #{tag} ×
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:items-end lg:justify-end">
                  <button
                    onClick={resetFilters}
                    className="rounded-xl border border-[#273527] bg-[#0d140d] px-5 py-2.5 text-sm font-semibold text-gray-300 hover:border-[#8BF500] hover:text-[#8BF500] active:scale-95 transition-all"
                  >
                    Reset All
                  </button>
                  <div className="rounded-xl border-2 border-[#8BF500] bg-[#8BF500]/10 px-5 py-2.5 text-center">
                    <span className="text-lg font-black text-[#8BF500]">{filteredItems.length}</span>
                    <span className="text-xs text-gray-300 ml-1.5">
                      {filteredItems.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 rounded-2xl border border-[#1d2a1c] bg-[#101610] animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-[#1d2a1c]/60 bg-gradient-to-br from-[#101610] to-[#0d140d] p-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#8BF500]/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#8BF500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">No items found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8BF500] px-6 py-3 text-sm font-bold text-black hover:bg-[#7cde00] active:scale-95 transition-all"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#1d2a1c]/60 bg-gradient-to-b from-[#121b12] to-[#0a120a] shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#8BF500] hover:shadow-2xl hover:shadow-[#8BF500]/10"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a120a] via-transparent to-transparent z-10" />
                    {item.coverImage ? (
                      <img
                        src={`/api/uploads/${item.coverImage}`}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a2a1a] to-[#0f1a0f] text-6xl">
                        🎛️
                      </div>
                    )}

                    {/* Category & Genre badges */}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[11px] font-bold z-20">
                      <span className="rounded-full bg-[#8BF500] px-3 py-1 text-black capitalize shadow-lg">
                        {item.category}
                      </span>
                      {item.genre && (
                        <span className="rounded-full bg-black/80 px-3 py-1 text-white border border-white/20 backdrop-blur capitalize">
                          {item.genre}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#8BF500] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(item.uploadDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                          item.license === "free" || item.license === "free-commercial"
                            ? "bg-[#8BF500]/20 text-[#8BF500] border border-[#8BF500]/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {item.license === "free" || item.license === "free-commercial" ? "Free" : "Premium"}
                      </span>
                    </div>

                    {/* Metadata grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {item.bpm && (
                        <div className="rounded-lg border border-[#273527] bg-[#0d140d] px-2 py-2">
                          <p className="text-xs text-gray-500 font-medium">BPM</p>
                          <p className="text-base font-bold text-[#8BF500]">{item.bpm}</p>
                        </div>
                      )}
                      {item.key && (
                        <div className="rounded-lg border border-[#273527] bg-[#0d140d] px-2 py-2">
                          <p className="text-xs text-gray-500 font-medium">Key</p>
                          <p className="text-base font-bold text-white">{item.key}</p>
                        </div>
                      )}
                      {item.mood && (
                        <div className="rounded-lg border border-[#273527] bg-[#0d140d] px-2 py-2">
                          <p className="text-xs text-gray-500 font-medium">Mood</p>
                          <p className="text-base font-bold text-white capitalize line-clamp-1">{item.mood}</p>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-md border border-[#273527] bg-[#0d140d] px-2 py-1 text-[10px] font-medium text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 4 && (
                          <span className="rounded-md border border-[#273527] bg-[#0d140d] px-2 py-1 text-[10px] font-medium text-gray-400">
                            +{item.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Download button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const isLoggedIn = false;
                        if (!isLoggedIn) {
                          window.location.href = "/login";
                        } else {
                          console.log("Download:", item.filename);
                        }
                      }}
                      className="w-full rounded-xl bg-gradient-to-r from-[#8BF500] to-[#6ad100] px-4 py-3 text-sm font-bold text-black hover:from-[#7cde00] hover:to-[#5bc000] active:scale-98 transition-all shadow-lg shadow-[#8BF500]/20 group-hover:shadow-[#8BF500]/40"
                    >
                      Download Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
