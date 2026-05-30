"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setMessage(error.message);
      else setMessage("Check your email inbox for a verification link!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/dashboard";
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFA] text-[#37352F] px-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-[#EDEDEB] shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Clarity AI</h1>
          <p className="text-sm text-neutral-500 mt-1">Your Notion-style AI study workspace</p>
        </div>

        {/* Google Authentication Trigger */}
        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#EDEDEB] bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.22 8.78 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.61-.21-2.38H12v4.5h6.48c-.28 1.48-1.11 2.73-2.37 3.58l3.68 2.85c2.14-1.98 3.39-4.89 3.39-8.55z"/>
            <path fill="#FBBC05" d="M5.1 14.7c-.24-.73-.38-1.51-.38-2.32s.14-1.59.38-2.32L1.5 7.26C.54 9.19 0 11.34 0 13.6s.54 4.41 1.5 6.34l3.6-2.84z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.68-2.85c-1.02.68-2.33 1.09-3.92 1.09-3.22 0-5.99-2.18-6.9-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#EDEDEB]" /></div>
          <span className="relative bg-white px-3 text-xs text-neutral-400 uppercase tracking-wider">or</span>
        </div>

        {/* Standard Email Authentication Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#EDEDEB] px-3 py-2 text-sm bg-[#FBFBFA] focus:border-neutral-400 focus:outline-none"
              placeholder="name@school.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#EDEDEB] px-3 py-2 text-sm bg-[#FBFBFA] focus:border-neutral-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#37352F] py-2.5 text-sm font-semibold text-white hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignUp ? "Create Student Account" : "Sign In"}
          </button>
        </form>

        {message && <p className="text-sm text-center mt-4 text-amber-600 font-medium">{message}</p>}

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-neutral-500 underline decoration-neutral-300 hover:text-black transition-colors"
          >
            {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}