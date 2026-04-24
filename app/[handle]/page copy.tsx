import { notFound } from 'next/navigation';
import { db, sites } from '@lumea/db';
import { eq } from 'drizzle-orm';
import { Camera, Link as LinkIcon, Sparkles } from 'lucide-react';
import { getCache } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export default async function CreatorPage({ params }: { params: Promise<{ handle: string }> | { handle: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams.handle.replace('@', '').toLowerCase();

  // 1. Attempt incredibly fast direct Redis object retrieval (TTFB Optimization)
  let siteData = await getCache(`site:${handle}`);

  // 2. Fallback to Supabase Database
  if (!siteData) {
    const dbResult = await db.select().from(sites).where(eq(sites.slug, handle));
    siteData = dbResult[0];
  }

  if (!siteData) {
    return notFound();
  }

  const identity = siteData.brandIdentity;
  const brandPalette = siteData.palette;

  // Render a beautifully styled dynamic page using the LLM's suggested styles
  return (
    <div 
      className={`min-h-screen font-${identity.fontStyle} selection:text-white`}
      style={{ 
        backgroundColor: brandPalette.background,
        color: brandPalette.text,
        ['--color-primary' as any]: brandPalette.primary,
        ['--color-accent' as any]: brandPalette.accent,
        ['--color-secondary' as any]: brandPalette.secondary,
      }}
    >
      {/* Decorative Blur Orbs */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${brandPalette.primary} 0%, transparent 40%),
                       radial-gradient(circle at 90% 80%, ${brandPalette.secondary} 0%, transparent 40%)`
        }}
      />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
        
        {/* Header / Hero */}
        <div className="flex flex-col items-center text-center space-y-6 mb-20">
          <div className="relative group perspective-1000">
            <div 
              className="absolute -inset-2 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700 ease-out"
              style={{ backgroundColor: brandPalette.primary }}
            />
            {siteData.brandIdentity.avatarUrl ? (
              <img 
                src={siteData.brandIdentity.avatarUrl} 
                alt={handle} 
                className="relative w-32 h-32 rounded-full ring-4 shadow-2xl transition-transform duration-700 group-hover:scale-105"
                style={{ borderColor: brandPalette.accent }}
              />
            ) : (
              <div 
                className="relative w-32 h-32 rounded-full ring-4 shadow-2xl flex items-center justify-center font-bold text-4xl"
                style={{ borderColor: brandPalette.accent, backgroundColor: brandPalette.secondary, color: brandPalette.background }}
              >
                {handle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg backdrop-blur-md"
                 style={{ backgroundColor: brandPalette.secondary + '40', color: brandPalette.primary }}>
              <Sparkles className="w-4 h-4" />
              {identity.niche}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-md">
              {handle}
            </h1>
            
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto opacity-90 drop-shadow-sm" style={{ color: brandPalette.textMuted }}>
              "{identity.tagline}"
            </p>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-24 relative p-1 rounded-3xl group overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000"
            style={{ background: `linear-gradient(45deg, ${brandPalette.primary}, ${brandPalette.accent})` }}
          />
          <div 
            className="relative p-10 md:p-14 rounded-3xl backdrop-blur-3xl shadow-2xl transition-all duration-300"
            style={{ backgroundColor: brandPalette.background + '80', border: `1px solid ${brandPalette.primary}30` }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              About
              <div className="flex-1 h-px opacity-30" style={{ backgroundColor: brandPalette.text }} />
            </h2>
            <p className="text-lg md:text-xl leading-relaxed opacity-95">
              {identity.about}
            </p>
          </div>
        </section>

        {/* Links Grid */}
        {siteData.links && siteData.links.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-8">Connect</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {siteData.links.map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{ backgroundColor: brandPalette.background, border: `1px solid ${brandPalette.textMuted}30` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:bg-opacity-100"
                      style={{ backgroundColor: brandPalette.primary + '20', color: brandPalette.primary }}
                    >
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: brandPalette.accent }}>
                      Visit →
                    </span>
                  </div>
                  <span className="text-lg font-semibold truncate">{link.url.replace(/^https?:\/\//, '')}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Instagram Content Grid */}
        {siteData.posts && siteData.posts.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Camera className="w-8 h-8" style={{ color: brandPalette.primary }} />
              Latest Posts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {siteData.posts.map((post: any, i: number) => (
                <div 
                  key={i} 
                  className="aspect-square relative rounded-2xl overflow-hidden group shadow-md"
                  style={{ backgroundColor: brandPalette.secondary + '20' }}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption || `Post ${i + 1}`}
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-4">
                    <p className="text-white text-sm line-clamp-3 leading-snug">
                      {post.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-12 opacity-60">
          <p className="text-sm font-medium">Generated by Lumea Engine AI</p>
        </footer>
      </main>
    </div>
  );
}
