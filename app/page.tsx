import HomeClient from "../components/HomeClient";
import { LogoIcon } from "../app/logo";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-6 selection:bg-[#ff3366] selection:text-white font-sans relative overflow-hidden">
      <div className="absolute top-[20%] left-[10%] w-full max-w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-full max-w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[10%] right-[30%] w-full max-w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

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

        <HomeClient initialSignedIn={isSignedIn} />

        <section className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>

          <div className="space-y-4 text-gray-300">
            <details className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <summary className="cursor-pointer px-5 py-5 text-lg font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]/60">
                Getting Started
              </summary>
              <div className="px-5 pb-5 text-sm leading-6 text-gray-300">
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Register</strong> for an account.</li>
                  <li><strong>Enter</strong> your Instagram handle (the text after @).</li>
                  <li><strong>Generate</strong> and relax. Your demo will be ready in minutes.</li>
                  <li><strong>Enjoy</strong> your personal profile.(Limit 2 pages per account)</li>
                </ol>
              </div>
            </details>

            <details className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <summary className="cursor-pointer px-5 py-5 text-lg font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]/60">
                Is my page published?
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-gray-300">
                Your page is currently private and hidden from search engines while I fine-tune the engine. I’ve built the core logic to auto-generate high-performance blogs, landing pages, and social profiles. Now, this project is my current technical focus. I’m focused on expanding the template library to ensure a "better experience for every user." During this phase, I’m gathering feedback and making improvements. If you have any suggestions or encounter issues, please reach out to me directly at <a href="mailto:contact@lumeaengine.com" className="text-purple-400 hover:underline">contact@lumeaengine.com</a>.
              </div>
            </details>

            <details className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <summary className="cursor-pointer px-5 py-5 text-lg font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]/60">
                Let’s Build & Grow Together
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-gray-300">
                I’m building this engine in public as a showcase of what’s possible with high-performance AI automation. However, my true passion is transforming high-potential ideas into scalable products. Whether you have a vision that complements this engine, or an entirely different problem that needs a founding-level technical partner, I want to hear it. I’m looking for strategic collaborators to co-define new ventures and share in the success. If you have the "What" and the "Why," I have the "How."
              </div>
            </details>
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
