import { TempoAnalyzer } from "@/components/tempo-analyzer";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

export default function TempoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <NavbarSolid />
      <div className="pt-20">
        <TempoAnalyzer />
      </div>
      <Footer />
    </div>
  );
}
