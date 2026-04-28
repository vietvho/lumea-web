"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Loader2, Link as LinkIcon, Sparkles } from "lucide-react";
import { ClerkProvider, UserButton, SignInButton, useAuth } from "@clerk/nextjs";

type HomeClientProps = {
  initialSignedIn?: boolean;
};

function HomeClientInner({ initialSignedIn }: HomeClientProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const effectiveSignedIn = isLoaded ? isSignedIn : initialSignedIn ?? false;
  const showLoader = !isLoaded && initialSignedIn === undefined;
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
    <>
      {effectiveSignedIn && isLoaded && (
        <div className="absolute top-6 right-6 z-50">
          <UserButton />
        </div>
      )}

      {showLoader ? (
        <div className="relative flex flex-col items-center bg-[#111116]/50 rounded-2xl p-12 ring-1 ring-white/5 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-[#ff3366] animate-spin" />
          <p className="mt-4 text-gray-500 text-sm animate-pulse">Initializing engine...</p>
        </div>
      ) : effectiveSignedIn ? (
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
    </>
  );
}

export default function HomeClient({ initialSignedIn }: HomeClientProps) {
  return (
    <ClerkProvider>
      <HomeClientInner initialSignedIn={initialSignedIn} />
    </ClerkProvider>
  );
}
