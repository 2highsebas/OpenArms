"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AlienLogo } from "./alien-logo";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getUsername, logout } from "@/firebase/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const fetchedUsername = await getUsername(currentUser.uid);
          setUsername(fetchedUsername);
        } catch (error) {
          console.warn("Failed to fetch username (navbar):", error);
          // Use displayName as fallback if username fetch fails
          setUsername(currentUser.displayName || "User");
        }
      } else {
        setUsername(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setUsername(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { 
      name: "Music Creator Tools", 
      href: "/tools",
      dropdown: [
        { name: "All Tools", href: "/tools" },
        { name: "AI Stem Splitter", href: "/stems" },
        { name: "Tempo Analyzer", href: "/tempo" },
      ]
    },
    { 
      name: "Upload", 
      href: "/upload"
    },
    { 
      name: "Loops", 
      href: "/loops",
      dropdown: [
        { name: "Drum Loops", href: "/loops/drums" },
        { name: "Guitar Loops", href: "/loops/guitar" },
        { name: "Melodies", href: "/loops/melodies" },
        { name: "Ambient Loops", href: "/loops/ambient" },
        { name: "Percussion", href: "/loops/percussion" },
      ]
    },
    { 
      name: "Kits", 
      href: "/kits",
      dropdown: [
        { name: "Drum Kits", href: "/kits/drums" },
        { name: "Sample Packs", href: "/kits/sample-packs" },
        { name: "One-Shots", href: "/kits/one-shots" },
      ]
    },
    { 
      name: "Songs", 
      href: "/songs",
      dropdown: [
        { name: "User Songs", href: "/songs/user" },
        { name: "Remixes", href: "/songs/remixes" },
        { name: "Stems", href: "/songs/stems" },
      ]
    },
    { 
      name: "Samples", 
      href: "/samples",
      dropdown: [
        { name: "Vocals", href: "/samples/vocals" },
        { name: "FX", href: "/samples/fx" },
        { name: "Instruments", href: "/samples/instruments" },
      ]
    },
    { 
      name: "MIDI", 
      href: "/midi",
      dropdown: [
        { name: "MIDI Packs", href: "/midi/packs" },
        { name: "Chord Progressions", href: "/midi/chords" },
        { name: "Melodies", href: "/midi/melodies" },
      ]
    },
    { 
      name: "Presets", 
      href: "/presets",
      dropdown: [
        { name: "Serum", href: "/presets/serum" },
        { name: "Vital", href: "/presets/vital" },
        { name: "Omnisphere", href: "/presets/omnisphere" },
        { name: "Other", href: "/presets/other" },
      ]
    },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <AlienLogo className="w-8 h-8" />
            <Link href="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
              Prodmised Me
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-baseline space-x-2">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-white/80 px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1"
                  >
                    {item.name}
                    {item.dropdown && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && openDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-black/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 py-2 z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* User Menu or Login Button */}
            {user && username ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8BF500]/10 border border-[#8BF500]/30 hover:bg-[#8BF500]/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8BF500] to-[#6ad100] flex items-center justify-center text-black font-bold text-sm">
                    {username[0].toUpperCase()}
                  </div>
                  <span className="text-white font-semibold">@{username}</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative px-6 py-2 bg-white text-black font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                  Login
                </span>
                <div className="absolute inset-0 bg-[#8BF500] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
                {/* Mobile Dropdown */}
                {item.dropdown && (
                  <div className="pl-6 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="text-white/70 hover:bg-white/10 block px-3 py-2 rounded-md text-sm transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
