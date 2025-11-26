"use client";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { SlimeBackground } from "@/components/slime-background";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    tools: false,
    marketplace: false,
  });
  const toolsRef = useRef<HTMLDivElement>(null);
  const marketplaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === toolsRef.current) {
              setIsVisible((prev) => ({ ...prev, tools: true }));
            }
            if (entry.target === marketplaceRef.current) {
              setIsVisible((prev) => ({ ...prev, marketplace: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (toolsRef.current) observer.observe(toolsRef.current);
    if (marketplaceRef.current) observer.observe(marketplaceRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Hero />
      
      {/* Combined Creator Tools & Marketplace Section with unified slime background */}
      <div className="w-full relative bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <SlimeBackground />
        
        {/* Creator Tools Section */}
        <div 
          ref={toolsRef}
          className={`min-h-screen w-full py-16 px-4 transition-all duration-1000 ${
            isVisible.tools ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-[#8BF500] to-white bg-clip-text text-transparent mb-4">
              Music Creator Tools
            </h2>
            <p className="text-gray-300 text-xl">
              Professional AI-powered tools for producers, artists, and creators
            </p>
          </div>

          {/* 3 Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* AI Stem Splitter Card */}
            <a href="/stems" className="group">
              <div className="relative border-2 border-[#8BF500]/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#8BF500]/20 transition-all duration-500 hover:-translate-y-3 bg-white/10 backdrop-blur-md h-full flex flex-col overflow-hidden hover:border-[#8BF500]">
                <div className="absolute inset-0 bg-[#8BF500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-[#8BF500] text-black w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                
                <h3 className="relative text-2xl font-bold text-white mb-3 group-hover:text-[#8BF500] transition-colors">
                  AI Stem Splitter
                </h3>
                
                <p className="relative text-gray-300 mb-6 flex-grow">
                  Separate any song into vocals, drums, bass, and instrumentals using advanced AI. Perfect for remixing, sampling, and production.
                </p>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>4-stem separation (Vocals, Drums, Bass, Other)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Powered by Demucs AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>High-quality audio output</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <span className="text-white font-semibold group-hover:text-[#8BF500] group-hover:underline transition-colors">
                    Try Stem Splitter →
                  </span>
                </div>
              </div>
            </a>

            {/* Tempo Analyzer Card */}
            <a href="/tempo" className="group">
              <div className="relative border-2 border-gray-600/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-500 hover:-translate-y-3 bg-white/10 backdrop-blur-md h-full flex flex-col overflow-hidden hover:border-gray-400">
                <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gray-700 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="relative text-2xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors">
                  Tempo Analyzer
                </h3>
                
                <p className="relative text-gray-300 mb-6 flex-grow">
                  Detect BPM, musical key, scale, and beat grid of any track. Essential for DJs, producers, and music organizers.
                </p>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>Accurate BPM detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>Key & scale identification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>Beat grid visualization</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <span className="text-white font-semibold group-hover:text-gray-300 group-hover:underline transition-colors">
                    Analyze Tempo →
                  </span>
                </div>
              </div>
            </a>

            {/* Upload Music Card */}
            <a href="/upload" className="group">
              <div className="relative border-2 border-[#8BF500]/30 rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#8BF500]/20 transition-all duration-500 hover:-translate-y-3 bg-white/10 backdrop-blur-md h-full flex flex-col overflow-hidden hover:border-[#8BF500]">
                <div className="absolute inset-0 bg-[#8BF500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-[#8BF500] text-black w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <h3 className="relative text-2xl font-bold text-white mb-3 group-hover:text-[#8BF500] transition-colors">
                  Upload Music
                </h3>
                
                <p className="relative text-gray-300 mb-6 flex-grow">
                  Share your loops, kits, samples, and tracks with the community. Set your price, add metadata, and start earning from your creations.
                </p>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Upload songs, loops, kits, samples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Add genre, BPM, tags & artwork</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Free & paid licensing options</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <span className="text-white font-semibold group-hover:text-[#8BF500] group-hover:underline transition-colors">
                    Start Uploading →
                  </span>
                </div>
              </div>
            </a>

          </div>
          </div>
        </div>

        {/* Music Marketplace Section */}
        <div 
          ref={marketplaceRef}
          className={`w-full min-h-screen py-32 px-4 transition-all duration-1000 ${
            isVisible.marketplace ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-[#8BF500] to-white bg-clip-text text-transparent mb-4">
              Music Marketplace
            </h2>
            <p className="text-gray-300 text-xl mb-8">
              Explore thousands of loops, kits, samples, and sounds from creators worldwide
            </p>
            <a 
              href="/loops"
              className="inline-block px-8 py-3 bg-[#8BF500] text-black font-bold rounded-lg hover:bg-[#7CE400] transition-all hover:scale-105 shadow-lg shadow-[#8BF500]/50"
            >
              Browse Marketplace →
            </a>
          </div>

          {/* Category Preview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <a href="/loops" className={`group transition-all duration-700 delay-100 ${
              isVisible.marketplace ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <div className="bg-white/10 backdrop-blur-md border-2 border-[#8BF500]/30 rounded-lg p-6 hover:bg-white/20 hover:border-[#8BF500] hover:shadow-xl hover:shadow-[#8BF500]/20 transition-all hover:-translate-y-2 hover:scale-105">
                <div className="text-4xl mb-3">🔁</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8BF500] transition-colors">Loops</h3>
                <p className="text-sm text-gray-300">Drum loops, melodies & more</p>
              </div>
            </a>

            <a href="/kits" className={`group transition-all duration-700 delay-200 ${
              isVisible.marketplace ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <div className="bg-white/10 backdrop-blur-md border-2 border-[#8BF500]/30 rounded-lg p-6 hover:bg-white/20 hover:border-[#8BF500] hover:shadow-xl hover:shadow-[#8BF500]/20 transition-all hover:-translate-y-2 hover:scale-105">
                <div className="text-4xl mb-3">🥁</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8BF500] transition-colors">Kits</h3>
                <p className="text-sm text-gray-300">Drum kits & sample packs</p>
              </div>
            </a>

            <a href="/songs" className={`group transition-all duration-700 delay-300 ${
              isVisible.marketplace ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <div className="bg-white/10 backdrop-blur-md border-2 border-[#8BF500]/30 rounded-lg p-6 hover:bg-white/20 hover:border-[#8BF500] hover:shadow-xl hover:shadow-[#8BF500]/20 transition-all hover:-translate-y-2 hover:scale-105">
                <div className="text-4xl mb-3">🎵</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8BF500] transition-colors">Songs</h3>
                <p className="text-sm text-gray-300">Full tracks & remixes</p>
              </div>
            </a>

            <a href="/samples" className={`group transition-all duration-700 delay-[400ms] ${
              isVisible.marketplace ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <div className="bg-white/10 backdrop-blur-md border-2 border-[#8BF500]/30 rounded-lg p-6 hover:bg-white/20 hover:border-[#8BF500] hover:shadow-xl hover:shadow-[#8BF500]/20 transition-all hover:-translate-y-2 hover:scale-105">
                <div className="text-4xl mb-3">🎹</div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8BF500] transition-colors">Samples</h3>
                <p className="text-sm text-gray-300">One-shots & instruments</p>
              </div>
            </a>
          </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
