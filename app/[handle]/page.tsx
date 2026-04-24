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

  // 2. Fallback to Supabase Database (if cache miss or incomplete data)
  if (!siteData || !siteData.palette) {
    const dbResult = await db.select().from(sites).where(eq(sites.slug, handle));
    siteData = dbResult[0];
  }

  if (!siteData) {
    return notFound();
  }

  const identity = siteData.brandIdentity;
  const brandPalette = siteData.palette;

  if (!identity || !brandPalette) {
    return notFound();
  }

  // Render a high-end editorial layout using the brand's unique identity
  const colors = brandPalette;
  const posts = siteData.posts || [];
  
  return (
    <div 
      className={`min-h-screen transition-all duration-1000 font-${identity.fontStyle} selection:bg-current selection:text-white`}
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {/* FIXED HEADER - MINIMAL & BLENDED */}
      <header className="fixed top-0 left-0 w-full p-8 flex justify-between items-center mix-blend-difference z-50 text-white">
        <span className="font-bold tracking-[0.5em] text-xs uppercase cursor-pointer hover:opacity-70 transition">
          {handle}
        </span>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-white opacity-30"></div>
          {identity.avatarUrl && (
            <img src={identity.avatarUrl} className="w-8 h-8 rounded-full border border-white/20" alt="logo" />
          )}
        </div>
      </header>

      {/* HERO SECTION - ASYMMETRIC STORYTELLING */}
      <section className="px-6 md:px-12 pt-32 pb-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 overflow-hidden aspect-[4/5] md:aspect-[16/10] relative group">
          {posts[0] ? (
            <img 
              src={posts[0].imageUrl} 
              alt="Hero"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center opacity-20">
              <Sparkles className="w-12 h-12" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-1000"></div>
        </div>
        
        <div className="md:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div 
            className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest border border-current opacity-50"
          >
            {identity.niche}
          </div>
          <h1 
            style={{ color: colors.accent }}
            className="text-6xl md:text-8xl leading-[0.9] tracking-tighter font-bold"
          >
            {identity.tagline?.split(' ').slice(0, 2).join(' ') || handle}
            <br />
            <span className="opacity-40 italic font-light">{identity.tagline?.split(' ').slice(2).join(' ')}</span>
          </h1>
          <p className="text-xl opacity-70 max-w-sm font-light leading-relaxed">
            "{identity.about?.split('.')[0]}."
          </p>
        </div>
      </section>

      {/* BENTO EDITORIAL GRID */}
      <section className="px-4 md:px-12 py-24 border-t border-current/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[350px]">
          
          {/* Main Visual - Post 1 */}
          <div className="col-span-2 md:row-span-2 relative group overflow-hidden bg-zinc-900 border border-current/10">
            {posts[1] && (
              <>
                <img src={posts[1].imageUrl} className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="Spotlight" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
                <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                  <p className="text-white text-sm max-w-xs">{posts[1].caption?.slice(0, 80)}...</p>
                </div>
              </>
            )}
          </div>

          {/* Identity Card */}
          <div 
            className="p-8 flex flex-col justify-between border border-current/10"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-40">Identity</span>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold italic">{handle}</h3>
              <p className="text-xs leading-relaxed opacity-60 line-clamp-4">{identity.about}</p>
            </div>
          </div>

          {/* Visual - Post 2 */}
          <div className="relative overflow-hidden group border border-current/10">
            {posts[2] && (
              <img src={posts[2].imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700 group-hover:scale-110" alt="Moment" />
            )}
          </div>

          {/* Call to Action / Socials */}
          <div className="md:col-span-2 flex items-center justify-center border border-current/10 group hover:bg-current transition-colors duration-500">
            <div className="text-center space-y-4 group-hover:text-[var(--bg-color)] transition-colors">
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Get in touch</span>
              <div className="flex gap-6">
                {siteData.links?.map((link: any, i: number) => (
                  <a key={i} href={link.url} target="_blank" className="text-lg font-medium hover:italic transition-all">
                    {link.url.includes('instagram') ? 'Instagram' : 'Connect'}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Visual - Post 3 */}
          <div className="md:col-span-2 relative overflow-hidden group border border-current/10">
            {posts[3] && (
              <img src={posts[3].imageUrl} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700" alt="Texture" />
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 px-8 border-t border-current/5 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter opacity-10 hover:opacity-100 transition-opacity duration-1000">
            {handle}
          </h2>
          <p className="italic opacity-40 text-lg">
            {identity.niche} &mdash; Curated by Lumea
          </p>
        </div>
        <div className="flex justify-center gap-12 text-[10px] tracking-[0.4em] uppercase opacity-30 pt-12">
          {siteData.links?.slice(0, 3).map((link: any, i: number) => (
            <a key={i} href={link.url} className="hover:opacity-100 transition-opacity">
              Platform {i + 1}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
