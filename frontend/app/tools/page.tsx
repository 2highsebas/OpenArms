import { StemUploader } from "@/components/stem-uploader";
import { TempoAnalyzer } from "@/components/tempo-analyzer";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavbarSolid />
      <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Music Creator Tools
          </h1>
          <p className="text-gray-600 text-lg">
            Professional AI-powered tools for producers, artists, and creators
          </p>
        </div>

        {/* AI Stem Splitter Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-black text-white w-12 h-12 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black">AI Stem Splitter</h2>
              <p className="text-gray-600">Separate vocals, drums, bass, and instrumentals</p>
            </div>
          </div>
          <StemUploader />
        </div>

        {/* Tempo Analyzer Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-black text-white w-12 h-12 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black">Tempo Analyzer</h2>
              <p className="text-gray-600">Detect BPM, key, scale, and beat grid</p>
            </div>
          </div>
          <TempoAnalyzer />
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
