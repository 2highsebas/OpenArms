import { StemUploader } from "@/components/stem-uploader";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

export default function StemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f0c] via-[#0f160e] to-[#0b0f0c]">
      <NavbarSolid />
      <div className="pt-20">
        <StemUploader />
      </div>
      <Footer />
    </div>
  );
}
