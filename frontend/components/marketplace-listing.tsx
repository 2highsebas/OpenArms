"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
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
  const [bpmRange, setBpmRange] = useState<[number, number]>([0, 300]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, selectedCategory, selectedGenre, selectedMood, bpmRange, searchQuery]);

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

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Genre filter
    if (selectedGenre !== "all") {
      filtered = filtered.filter((item) => item.genre === selectedGenre);
    }

    // Mood filter
    if (selectedMood !== "all") {
      filtered = filtered.filter((item) => item.mood === selectedMood);
    }

    // BPM filter
    filtered = filtered.filter((item) => {
      if (!item.bpm) return true;
      return item.bpm >= bpmRange[0] && item.bpm <= bpmRange[1];
    });

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  }

  function resetFilters() {
    setSelectedCategory("all");
    setSelectedGenre("all");
    setSelectedMood("all");
    setBpmRange([0, 300]);
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      <NavbarSolid />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-black via-[#8BF500] to-black bg-clip-text text-transparent mb-4">
            Music Marketplace
          </h1>
          <p className="text-gray-700 text-xl">
            Browse loops, kits, songs, samples, and more from creators worldwide
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-md border-2 border-gray-300 rounded-2xl p-6 sticky top-24 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BF500] focus:border-transparent text-sm transition-all"
                  placeholder="Search titles, tags..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BF500] focus:border-transparent text-sm transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="song">Songs</option>
                  <option value="loop">Loops</option>
                  <option value="drum-kit">Drum Kits</option>
                  <option value="sample-pack">Sample Packs</option>
                  <option value="one-shot">One Shots</option>
                  <option value="midi">MIDI</option>
                  <option value="preset">Presets</option>
                </select>
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BF500] focus:border-transparent text-sm transition-all"
                >
                  <option value="all">All Genres</option>
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
                </select>
              </div>

              {/* Mood Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">
                  Mood/Vibe
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BF500] focus:border-transparent text-sm transition-all"
                >
                  <option value="all">All Moods</option>
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

              {/* BPM Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">
                  BPM Range
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    value={bpmRange[0]}
                    onChange={(e) => setBpmRange([parseInt(e.target.value) || 0, bpmRange[1]])}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BF500] text-sm transition-all"
                    min="0"
                    max="300"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    value={bpmRange[1]}
                    onChange={(e) => setBpmRange([bpmRange[0], parseInt(e.target.value) || 300])}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BF500] text-sm transition-all"
                    min="0"
                    max="300"
                  />
                </div>
                <p className="text-xs text-gray-500">Min: {bpmRange[0]} | Max: {bpmRange[1]}</p>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No items found matching your filters</p>
                <button
                  onClick={resetFilters}
                  className="text-black font-semibold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white/80 backdrop-blur-sm border-2 border-gray-300 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-br from-black via-gray-800 to-[#8BF500] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                      {item.coverImage ? (
                        <img
                          src={`/api/uploads/${item.coverImage}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-black mb-2 truncate">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#8BF500] text-black text-xs font-semibold rounded-full">
                          {item.category}
                        </span>
                        {item.genre && (
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-semibold rounded-full">
                            {item.genre}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        {item.bpm && (
                          <div>
                            <span className="font-semibold">BPM:</span> {item.bpm}
                          </div>
                        )}
                        {item.key && (
                          <div>
                            <span className="font-semibold">Key:</span> {item.key}
                          </div>
                        )}
                        {item.mood && (
                          <div className="col-span-2">
                            <span className="font-semibold">Mood:</span> {item.mood}
                          </div>
                        )}
                      </div>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm font-semibold text-green-600">
                          {item.license === "free" || item.license === "free-commercial" ? "FREE" : "PAID"}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            // Check if user is logged in (placeholder - implement actual auth)
                            const isLoggedIn = false; // TODO: Replace with actual auth check
                            if (!isLoggedIn) {
                              window.location.href = "/login";
                            } else {
                              // Handle download
                              console.log("Download:", item.filename);
                            }
                          }}
                          className="px-5 py-2 bg-[#8BF500] text-black rounded-xl text-sm font-bold hover:bg-[#7DE000] transition-all transform hover:scale-105 shadow-lg"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
