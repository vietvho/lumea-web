import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> | { jobId: string } }
) {
  // Await the params to resolve jobId Next15+ dynamic api requirement
  // For Next14 we can just use it, but safe to await if it's a promise
  const resolvedParams = await Promise.resolve(params);
  const jobId = resolvedParams.jobId;

  if (!jobId) {
    return new Response('Missing jobId', { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Since we need to push updates, we can either poll Redis
      // or use Redis pub/sub. Polling is simpler for now, matching the original requirement.
      const pubsub = redis.duplicate();
      const progressKey = `job:${jobId}:progress`;

      // Quick poll approach (every 1s)
      const intervalId = setInterval(async () => {
        try {
          const data = await redis.get(progressKey);
          if (data) {
            const parsed = JSON.parse(data);
            sendEvent(parsed);

            if (parsed.status === 'done' || parsed.status === 'failed') {
              clearInterval(intervalId);
              pubsub.disconnect();
              controller.close();
            }
          }
        } catch (err) {
          console.error('[SSE] Error polling:', err);
        }
      }, 1000);

      req.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        pubsub.disconnect();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
