import { z } from 'zod';

export const hypothesisSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').transform(val => val.toUpperCase()),
  assetClass: z.enum(['crypto', 'forex', 'equities']),
  exchange: z.string().optional(),
  setupType: z.string().min(1, 'Setup type is required'),
  bias: z.enum(['long', 'short', 'neutral']),
  timeframe: z.string().min(1, 'Timeframe is required'),
  priority: z.coerce.number().min(1).max(5),
  confidence: z.coerce.number().min(1).max(5).default(3),
  triggerCondition: z.string().optional(),
  entryPlan: z.string().optional(),
  invalidationLevel: z.coerce.number().nullable().optional(),
  stopLoss: z.coerce.number().nullable().optional(),
  targets: z.string().optional(),
  tags: z.string().optional(),
  nextReviewAt: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  status: z.enum(['active', 'paused', 'archived', 'parking']).default('active'),
});

export const activityLogSchema = z.object({
  type: z.enum(['observation', 'decision', 'result', 'lesson']),
  content: z.string().min(1, 'Content is required'),
});

export const marketStateSchema = z.object({
  regime: z.string(), // Allowing flexible strings now to support classifier output
  vixProxy: z.coerce.number().optional().nullable(),
  biasSummary: z.string().optional(),
});
