import { NextResponse } from 'next/server';
import { jobQueue } from '@/lib/queue';
import { getCache } from '@/lib/redis';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle } = body;

    if (!handle) {
      return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
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
      { handle, jobId },
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
