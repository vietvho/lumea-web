import { NextResponse } from 'next/server';
import { jobQueue } from '@/lib/queue';
import { getCache } from '@/lib/redis';
import crypto from 'crypto';
import { auth } from '@clerk/nextjs/server';
import { eq, count } from 'drizzle-orm';
import { db, sites } from '@vietvho/lumea-db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { handle } = body;

    if (!handle) {
      return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
    }

    // 0. Check Generation Limit (Max 2)
    const existingSite = await db.query.sites.findFirst({
      where: (sites, { eq }) => eq(sites.slug, handle.toLowerCase()),
    });

    // If site exists and belongs to someone else, or doesn't exist: check limit
    if (!existingSite || existingSite.userId !== userId) {
      const [{ count: currentCount }] = await db
        .select({ count: count() })
        .from(sites)
        .where(eq(sites.userId, userId));

      if (currentCount >= 2) {
        return NextResponse.json({ 
          error: 'Generation limit reached', 
          message: 'You can only generate up to 2 landing pages in the preview.' 
        }, { status: 403 });
      }
    }

    // 1. Check cache first (Cache HIT)
    const cachedSite = await getCache(`site:${handle}`);
    if (cachedSite) {
      return NextResponse.json({ cached: true, siteData: cachedSite }, { status: 200 });
    }

    // 2. Cache MISS -> Create job
    const jobId = crypto.randomUUID();
    
    await jobQueue.add(
      'generate-site',
      { handle, jobId, userId },
      { jobId } // Use same jobId for BullMQ tracking
    );

    return NextResponse.json(
      { cached: false, jobId },
      { status: 202 } // 202 Accepted
    );
  } catch (err: any) {
    console.error('[API] Generate Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
