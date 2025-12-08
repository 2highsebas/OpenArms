"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, loginWithGoogle, saveUsername } from "@/firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { NavbarSolid } from "@/components/navbar-solid";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password, rememberMe);
      router.push("/"); // Redirect to home or dashboard
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await loginWithGoogle(rememberMe);

      const uid = result.user.uid;
      setNewUserId(uid);

      // 🚀 Show username modal IMMEDIATELY
      setShowUsernameModal(true);
      setLoading(false);

      // 🚀 FIRE-AND-FORGET (do NOT await)
      const { checkUserHasUsername } = await import("@/firebase/auth");
      checkUserHasUsername(uid).then((hasUsername) => {
        if (hasUsername) {
          setShowUsernameModal(false);
          router.push("/");
        }
      });

    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Failed to login with Google");
      setLoading(false);
      setShowUsernameModal(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!usernameAvailable) {
      setError("Username is already taken");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      await saveUsername(newUserId, username, currentUser?.displayName || "", currentUser?.email || "");
      setShowUsernameModal(false);
      router.push("/"); // Redirect to home or dashboard
    } catch (err: any) {
      setError(err.message || "Failed to save username");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f0c] via-[#0f160e] to-[#0b0f0c]">
      <NavbarSolid />
      <div className="pt-20 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-[#1d2a1c] bg-gradient-to-br from-[#0f1a10] to-[#101610] p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-block rounded-2xl bg-[#8BF500]/10 p-4">
                <svg className="h-12 w-12 text-[#8BF500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">Welcome Back</h1>
              <p className="text-gray-300">Sign in to continue to Prodmised Me</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl border-2 border-red-500/50 bg-gradient-to-br from-red-950/50 to-red-900/30 p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full mb-6 flex items-center justify-center gap-3 rounded-xl border border-[#273527] bg-white px-6 py-3.5 text-black font-semibold hover:bg-gray-100 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#273527]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#101610] text-gray-400 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#273527] bg-[#0d140d] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2 font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#273527] bg-[#0d140d] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#273527] rounded-full peer-checked:bg-[#8BF500] transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#8BF500] hover:text-[#7cde00] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8BF500] to-[#6ad100] text-black py-3.5 rounded-xl font-bold text-base hover:from-[#7cde00] hover:to-[#5bc000] active:scale-98 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 shadow-lg shadow-[#8BF500]/20 hover:shadow-[#8BF500]/40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#8BF500] hover:text-[#7cde00] font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-[#1d2a1c] bg-gradient-to-br from-[#0f1a10] to-[#101610] p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-block rounded-2xl bg-[#8BF500]/10 p-4">
                <svg className="h-12 w-12 text-[#8BF500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Create Your Username</h2>
              <p className="text-gray-300">Choose a unique username for your profile</p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border-2 border-red-500/50 bg-gradient-to-br from-red-950/50 to-red-900/30 p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleUsernameSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2 font-semibold">
                  Username
                  {checkingUsername && <span className="ml-2 text-yellow-400">Checking…</span>}
                  {!checkingUsername && !usernameAvailable && username.length >= 3 && (
                    <span className="ml-2 text-red-400">✗ Taken</span>
                  )}
                  {!checkingUsername && username && usernameAvailable && username.length >= 3 && (
                    <span className="ml-2 text-green-400">✓ Available</span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full px-4 py-3 border border-[#273527] bg-[#0d140d] rounded-xl text-white placeholder:text-gray-500 focus:border-[#8BF500] focus:outline-none focus:ring-2 focus:ring-[#8BF500]/20 transition-all"
                  placeholder="your_username"
                  minLength={3}
                  maxLength={20}
                />
                <p className="mt-2 text-xs text-gray-400">
                  3-20 characters, lowercase letters, numbers, and underscores only
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8BF500] to-[#6ad100] text-black py-3.5 rounded-xl font-bold text-base hover:from-[#7cde00] hover:to-[#5bc000] active:scale-98 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 shadow-lg shadow-[#8BF500]/20 hover:shadow-[#8BF500]/40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
