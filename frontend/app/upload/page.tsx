import { MusicUploader } from "@/components/music-uploader";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f0c] via-[#0f160e] to-[#0b0f0c]">
      <NavbarSolid />
      <div className="pt-20">
        <MusicUploader />
      </div>
      <Footer />
    </div>
  );
}
