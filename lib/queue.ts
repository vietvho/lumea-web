import { Queue } from 'bullmq';
import { redis } from './redis';

const globalForQueue = global as unknown as { jobQueue: Queue };

export const jobQueue = globalForQueue.jobQueue || new Queue('site-generation', { connection: redis as any });

if (process.env.NODE_ENV !== 'production') globalForQueue.jobQueue = jobQueue;
