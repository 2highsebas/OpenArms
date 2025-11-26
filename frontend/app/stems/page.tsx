import { StemUploader } from "@/components/stem-uploader";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

export default function StemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavbarSolid />
      <div className="pt-20">
        <StemUploader />
      </div>
      <Footer />
    </div>
  );
}
