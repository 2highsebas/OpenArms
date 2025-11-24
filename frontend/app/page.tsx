import { Hero } from "@/components/hero";
import { StemUploader } from "@/components/stem-uploader";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="min-h-screen w-full bg-white">
        <StemUploader />
      </div>
    </div>
  );
}
