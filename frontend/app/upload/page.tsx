"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { MusicUploader } from "@/components/music-uploader";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b0f0c] via-[#0f160e] to-[#0b0f0c] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8BF500] border-t-transparent"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
