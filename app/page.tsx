"use client";

import { useState, FormEvent, useEffect } from "react";
import { ArrowRight, Loader2, Link as LinkIcon, Sparkles } from "lucide-react";
import { LogoIcon } from "./logo";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "running" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState<{ step?: string; status?: string; message?: string; siteUrl?: string }>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const sanitizedHandle = handle.replace("@", "").trim();
      const res = await fetch("/api/sites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: sanitizedHandle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate site");
      }

      if (data.cached && data.siteData) {
        setStatus("success");
      } else if (data.jobId) {
        setStatus("running");
        listenToJob(data.jobId);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const listenToJob = (jobId: string) => {
    const sse = new EventSource(`/api/jobs/${jobId}/stream`);

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data);

      if (data.status === "done") {
        sse.close();
        setStatus("success");
      } else if (data.status === "failed") {
        sse.close();
        setStatus("error");
        setErrorMsg(data.reason || "Job failed");
      }
    };

    sse.onerror = (err) => {
      console.error("SSE Error:", err);
      sse.close();
      setStatus("error");
      setErrorMsg("Connection to job stream lost.");
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-6 selection:bg-[#ff3366] selection:text-white font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[10%] right-[30%] w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="absolute top-6 right-6 z-50">
        <UserButton />
      </div>

      <main className="relative z-10 w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 p-1 rounded-2xl ring-1 ring-white/20 backdrop-blur-md shadow-2xl">
            <LogoIcon className="w-17 h-17 text-[#ff3366]" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 text-center mb-4 tracking-tight">
          Lumea Engine
        </h1>
        <p className="text-gray-400 text-center text-lg mb-12 font-medium">
          Generate an AI-powered, meticulously designed landing page directly from an Instagram profile.
        </p>

        {!isLoaded ? (
          <div className="relative flex flex-col items-center bg-[#111116]/50 rounded-2xl p-12 ring-1 ring-white/5 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-[#ff3366] animate-spin" />
            <p className="mt-4 text-gray-500 text-sm animate-pulse">Initializing engine...</p>
          </div>
        ) : isSignedIn ? (
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-[#ff3366] to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[#111116] rounded-2xl p-2 ring-1 ring-white/10 shadow-2xl transition-all focus-within:ring-[#ff3366]/50">
              <div className="pl-4 pr-3 py-3 text-gray-500">
                <LinkIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Instagram Handle (e.g. @zuck)"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                disabled={status === "submitting" || status === "running"}
                className="flex-1 bg-transparent text-lg text-white placeholder-gray-500 focus:outline-none w-full disabled:opacity-50"
              />
              <button
                type="submit"
                suppressHydrationWarning
                disabled={!handle.trim() || status === "submitting" || status === "running"}
                className="ml-2 bg-gradient-to-r from-purple-500 to-[#ff3366] hover:from-purple-600 hover:to-[#ff1952] text-white p-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shrink-0 flex items-center justify-center w-12 h-12"
              >
                {(status === "submitting" || status === "running") ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-[#ff3366] to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex flex-col items-center bg-[#111116] rounded-2xl p-8 ring-1 ring-white/10 shadow-2xl text-center">
              <Sparkles className="w-10 h-10 text-[#ff3366] mb-4" />
              <h2 className="text-xl font-bold mb-2">Ready to transform your brand?</h2>
              <p className="text-gray-400 mb-6 font-medium text-sm">Sign in to generate your AI-powered landing page in seconds.</p>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-purple-500 to-[#ff3366] hover:from-purple-600 hover:to-[#ff1952] text-white px-8 py-3 rounded-xl font-extrabold transition-all shadow-lg active:scale-95">
                  Get Started Now
                </button>
              </SignInButton>
            </div>
          </div>
        )}

        {/* Progress Display */}
        {status === "running" && (
          <div className="mt-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold tracking-wider text-purple-400 uppercase">Generation in Progress</span>
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            </div>

            <div className="space-y-4">
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-[#ff3366] transition-all duration-500 ease-out"
                  style={{
                    width: progress.step === 'scraping' ? '33%' :
                      progress.step === 'analyzing' ? '66%' :
                        progress.step === 'saving' ? '90%' :
                          progress.status === 'done' ? '100%' : '5%'
                  }}
                />
              </div>

              <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff3366] animate-pulse" />
                {progress.step === 'scraping' ? 'Extracting profile data and posts from Instagram...' :
                  progress.step === 'analyzing' ? 'Gemini is evaluating brand identity and tones...' :
                    progress.step === 'saving' ? 'Publishing landing page to Edge network...' :
                      'Initializing job worker...'}
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generation Complete!</h3>
            <p className="text-emerald-200 mb-6 font-medium text-sm">
              The AI profile analysis and rendering is complete. Your site is ready.
            </p>

            <a
              href={progress.siteUrl || `/${handle.replace("@", "")}`}
              className="inline-block w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              View Landing Page
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-red-400 mb-1">Failed to Generate</h3>
            <p className="text-red-200/80 text-sm">{errorMsg}</p>
          </div>
        )}

        <section className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>

          <div className="space-y-4 text-gray-300">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]/60"
              >
                <span className="text-lg font-semibold text-white">Getting Started</span>
                <span className="text-2xl text-purple-300">{openFaqIndex === 0 ? "−" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === 0 ? "max-h-96" : "max-h-0"}`}>
                <div className="px-5 pb-5 text-sm leading-6 text-gray-300">
                  <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Register</strong> for an account.</li>
                    <li><strong>Enter</strong> your Instagram handle (the text after @).</li>
                    <li><strong>Generate</strong> and relax. Your demo will be ready in minutes.</li>
                    <li><strong>Enjoy</strong> your personal profile.(Limit 2 pages per account)</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]/60"
              >
                <span className="text-lg font-semibold text-white">Is my page published?</span>
                <span className="text-2xl text-purple-300">{openFaqIndex === 1 ? "−" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === 1 ? "max-h-96" : "max-h-0"}`}>
                <p className="px-5 pb-5 text-sm leading-7 text-gray-300">
                  Your page is currently private and hidden from search engines while I fine-tune the engine. I’ve built the core logic to auto-generate high-performance blogs, landing pages, and social profiles. Now, This project is my current technical focus. I’m focused on expanding the template library to ensure a "better experience for every user." During this phase, I’m gathering feedback and making improvements. If you have any suggestions or encounter issues, please reach out to me directly at <a href="mailto:contact@lumeaengine.com" className="text-purple-400 hover:underline">vnbillio@gmail.com</a>.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]/60"
              >
                <span className="text-lg font-semibold text-white">Let’s Build & Grow Together</span>
                <span className="text-2xl text-purple-300">{openFaqIndex === 2 ? "−" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === 2 ? "max-h-96" : "max-h-0"}`}>
                <p className="px-5 pb-5 text-sm leading-7 text-gray-300">
                  I’m building this engine in public as a showcase of what’s possible with high-performance AI automation.

                  Beyond the demo, my focus is turning high-potential ideas into scalable, production-ready products.

                  Whether you’re working on something that complements this engine—or tackling a completely different problem where execution is the bottleneck—I’m interested.

                  If you have a clear “What” and “Why,” I can help you deliver the “How.”
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="absolute z-20 bottom-6 left-6 right-6 flex flex-col-reverse items-center justify-between gap-4 text-xs text-gray-400 sm:flex-row sm:text-sm">
        <p className="text-left">© {new Date().getFullYear()} Lumea Engine. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          <span className="text-white/20">•</span>
          <a href="/privacy" className="hover:text-white transition-colors">Policy</a>
        </div>
      </footer>
    </div>
  );
}
