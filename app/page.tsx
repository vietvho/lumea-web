"use client";

import { useState, FormEvent, useEffect } from "react";
import { ArrowRight, Loader2, Link as LinkIcon, Sparkles } from "lucide-react";
import { LogoIcon } from "./logo";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "running" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState<{ step?: string; status?: string; message?: string; siteUrl?: string }>({});

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

      </main>
    </div>
  );
}
