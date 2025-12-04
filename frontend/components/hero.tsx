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
      <div className="w-full flex-1 relative flex items-center justify-center px-4 py-8">
        <Waves className="h-full w-full absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider animate-pulse text-white text-center leading-tight"
          >
            U PROMISED ME
          </h1>
        </div>
      </div>
    </div>
  );
}
