"use client";

import { Waves } from "@/components/ui/wave-background";
import { Navbar } from "@/components/navbar";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full" style={{ backgroundColor: '#8BF500' }}>
      <Navbar />
      
      {/* Top border */}
      <div className="w-full h-[1px]" style={{ backgroundColor: 'white' }}></div>

      {/* Wave background with centered text */}
      <div className="w-full aspect-video relative flex items-center justify-center">
        <Waves className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-wider animate-pulse text-white"
          >
            U PROMISED ME
          </h1>
        </div>
      </div>

      {/* Bottom border */}
      <div className="w-full h-[1px]" style={{ backgroundColor: 'white' }}></div>

      {/* Title */}
      <div className="mt-6 text-center">
        <h1 className="text-5xl font-bold" style={{ color: '#8BF500' }}>
          Project OpenArms
        </h1>
        <p className="text-xl mt-2" style={{ color: '#8BF500', opacity: 0.8 }}>
          Empowering communities through support, compassion, and innovation.
        </p>
      </div>
    </div>
  );
}
