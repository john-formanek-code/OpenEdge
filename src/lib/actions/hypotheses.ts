/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { db } from '@/db';
import { hypotheses, activityLogs, marketStates, tradePlans, executions, strategies, backtests, marketFeatures, auditTrail, marketEvents, equitySnapshots, ruleViolations } from '@/db/schema';
import { eq, desc, or, lt, gte, and, like } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hypothesisSchema, activityLogSchema, marketStateSchema } from '@/lib/validators';

export async function getStrategies() {
  return await db.select().from(strategies);
}

export async function createStrategy(data: any) {
  const result = await db.insert(strategies).values(data).returning();
  revalidatePath('/lab');
  return result[0];
}

export async function addMarketFeature(data: any) {
  const result = await db.insert(marketFeatures).values({ ...data, timestamp: new Date() }).returning();
  revalidatePath('/lab');
  return result[0];
}

export async function createBacktest(data: any) {
  const result = await db.insert(backtests).values({ ...data, status: 'pending', createdAt: new Date() }).returning();
  revalidatePath('/lab');
  return result[0];
}

export async function checkStrategyGating(strategyId: string) {
  const strategy = await db.select().from(strategies).where(eq(strategies.id, strategyId)).get();
  if (!strategy) return { allowed: true };
  const latestState = await db.select().from(marketStates).orderBy(desc(marketStates.createdAt)).limit(1);
  const currentRegime = latestState[0]?.regime || 'neutral';
  const allowed = (strategy.allowedRegimes as string[]).includes(currentRegime);
  return { allowed, currentRegime, allowedRegimes: strategy.allowedRegimes, strategyName: strategy.name };
}

export async function getTradePlan(hypothesisId: string) {
  const result = await db.select().from(tradePlans).where(eq(tradePlans.hypothesisId, hypothesisId));
  return result[0] || null;
}

export async function saveTradePlan(hypothesisId: string, planData: any) {
  const existing = await getTradePlan(hypothesisId);
  if (existing) {
    await db.update(tradePlans).set(planData).where(eq(tradePlans.id, existing.id));
  } else {
    await db.insert(tradePlans).values({ hypothesisId, ...planData });
  }
  revalidatePath(`/hypothesis/${hypothesisId}`);
}

export async function getAssetClassExposure(assetClass: string) {
  const activeHypotheses = await db.select().from(hypotheses).where(and(eq(hypotheses.status, 'active'), eq(hypotheses.assetClass, assetClass)));
  const ids = activeHypotheses.map(h => h.id);
  if (ids.length === 0) return 0;
  const plans = await db.select().from(tradePlans);
  return plans.filter(p => ids.includes(p.hypothesisId)).reduce((acc, p) => acc + (p.totalRiskAmount || 0), 0);
}

export async function getPortfolioRiskSummary() {
  const activeHypotheses = await db.select().from(hypotheses).where(eq(hypotheses.status, 'active'));
  const activeIds = activeHypotheses.map(h => h.id);
  if (activeIds.length === 0) return { clusters: [], stops: [] };
  
  const plans = await db.select().from(tradePlans);
  const activePlans = plans.filter(p => activeIds.includes(p.hypothesisId));
  
  const clusters = activeHypotheses.reduce((acc: any, h) => {
    const plan = activePlans.find(p => p.hypothesisId === h.id);
    const exposure = (plan?.totalPositionSize || 0) * (plan?.avgEntryPrice || 0);
    const existing = acc.find((c: any) => c.name === h.assetClass);
    if (existing) { 
      existing.exposure += exposure; 
      existing.rCount += 1; 
    } else { 
      acc.push({ name: h.assetClass, exposure, rCount: 1 }); 
    }
    return acc;
  }, []);

  const stops = activePlans.filter(p => p.stopLoss && (p.stopLoss as any).price).map(p => ({
    price: (p.stopLoss as any).price,
    risk: p.totalRiskAmount,
    hypothesisId: p.hypothesisId
  })).sort((a, b) => b.price - a.price);
  
  return { clusters, stops };
}

export async function addExecution(data: any) {
  const result = await db.insert(executions).values(data).returning();
  revalidatePath(`/hypothesis/${data.hypothesisId}`);
  return result[0];
}

export async function updateMarketState(data: any) {
  const validated = marketStateSchema.parse(data);
  const result = await db.insert(marketStates).values(validated).returning();
  revalidatePath('/');
  return result[0];
}

export async function getHypothesisById(id: string) {
  let result = await db.select().from(hypotheses).where(eq(hypotheses.id, id));
  // CLI Support: Fallback to symbol lookup
  if (result.length === 0) {
    result = await db.select().from(hypotheses).where(eq(hypotheses.symbol, id.toUpperCase()));
  }
  
  if (result.length === 0) return { hypothesis: null, logs: [] };

  const logs = await db.select()
    .from(activityLogs)
    .where(eq(activityLogs.hypothesisId, result[0].id))
    .orderBy(desc(activityLogs.createdAt));
  
  return { hypothesis: result[0], logs };
}

export async function getHypotheses(filter: any = 'active', search?: string, assetClass?: string, timeframe?: string, bias?: string, sort: string = 'priority_desc') {
  const conditions: any[] = [];
  const now = new Date();
  if (filter === 'today') { conditions.push(or(gte(hypotheses.priority, 4), lt(hypotheses.nextReviewAt, now))); }
  else { conditions.push(eq(hypotheses.status, filter)); }
  if (search) { conditions.push(or(like(hypotheses.symbol, `%${search}%`), like(hypotheses.triggerCondition, `%${search}%`))); }
  if (assetClass && assetClass !== 'all') { conditions.push(eq(hypotheses.assetClass, assetClass)); }
  if (timeframe && timeframe !== 'all') { conditions.push(eq(hypotheses.timeframe, timeframe)); }
  if (bias && bias !== 'all') { conditions.push(eq(hypotheses.bias, bias)); }
  const finalCondition = conditions.length > 0 ? (conditions.length > 1 ? and(...conditions) : conditions[0]) : undefined;
  let orderBy = [desc(hypotheses.priority), desc(hypotheses.createdAt)];
  if (sort === 'updated_desc') { orderBy = [desc(hypotheses.lastUpdatedAt)]; }
  return await db.select().from(hypotheses).where(finalCondition).orderBy(...orderBy);
}

export async function createHypothesis(data: any) {
  const validated = hypothesisSchema.parse(data);
  const result = await db.insert(hypotheses).values(validated).returning();
  revalidatePath('/');
  return result[0];
}

export async function updateHypothesis(id: string, data: any) {
  const validated = hypothesisSchema.partial().parse(data);
  const result = await db.update(hypotheses).set(validated).where(eq(hypotheses.id, id)).returning();
  revalidatePath('/');
  return result[0];
}

export async function addActivityLog(hypothesisId: string, type: string, content: string) {
  const validated = activityLogSchema.parse({ type, content });
  const result = await db.insert(activityLogs).values({ hypothesisId, ...validated }).returning();
  revalidatePath('/');
  return result[0];
}

export async function updateHypothesisState(id: string, newState: string, reason: string) {
  const h = await db.select().from(hypotheses).where(eq(hypotheses.id, id)).get();
  if (!h) return;
  await db.update(hypotheses).set({ state: newState }).where(eq(hypotheses.id, id));
  await db.insert(auditTrail).values({ hypothesisId: id, changeType: 'state_change', oldValue: h.state, newValue: newState, reason }).returning();
  revalidatePath(`/hypothesis/${id}`);
}

export async function getAuditTrail(hypothesisId: string) {
  return await db.select().from(auditTrail).where(eq(auditTrail.hypothesisId, hypothesisId)).orderBy(desc(auditTrail.createdAt));
}

export async function getMarketEvents() {
  return await db.select().from(marketEvents).where(gte(marketEvents.startTime, new Date())).orderBy(marketEvents.startTime);
}

export async function getEquitySummary() {
  const snapshots = await db.select().from(equitySnapshots).orderBy(desc(equitySnapshots.timestamp)).limit(1);
  return snapshots[0] || { balance: 10000, drawdown: 0 };
}

export async function getLatestMarketState() {
  const latest = await db.select().from(marketStates).orderBy(desc(marketStates.createdAt)).limit(1);
  return latest[0] || { regime: 'Unknown', vixProxy: 0, biasSummary: 'N/A' };
}

export async function getEquityReturns(limit: number = 60) {
  const snaps = await db.select().from(equitySnapshots).orderBy(desc(equitySnapshots.timestamp)).limit(limit);
  if (snaps.length < 2) return [];
  const sorted = [...snaps].sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  const returns: number[] = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = sorted[i - 1].balance || 1;
    const curr = sorted[i].balance || prev;
    returns.push(((curr - prev) / prev) * 100); // percent return
  }
  return returns;
}

export async function getExpectancyStats() {
  const allExecutions = await db.select().from(executions);
  const allHypotheses = await db.select().from(hypotheses);
  const allPlans = await db.select().from(tradePlans);
  const stats = allHypotheses.reduce((acc: any, h) => {
    if (h.state !== 'exited' && h.state !== 'reviewed') return acc;
    const setup = h.setupType || 'unknown';
    const plan = allPlans.find(p => p.hypothesisId === h.id);
    const tradeExecs = allExecutions.filter(e => e.hypothesisId === h.id);
    const totalBuy = tradeExecs.filter(e => e.side === 'buy').reduce((s, e) => s + (e.price * e.size), 0);
    const totalSell = tradeExecs.filter(e => e.side === 'sell').reduce((s, e) => s + (e.price * e.size), 0);
    const totalBuySize = tradeExecs.filter(e => e.side === 'buy').reduce((s, e) => s + e.size, 0);
    const totalSellSize = tradeExecs.filter(e => e.side === 'sell').reduce((s, e) => s + e.size, 0);

    // Ensure position is closed (within 1% tolerance)
    if (totalBuySize === 0 || Math.abs(totalBuySize - totalSellSize) > (totalBuySize * 0.01)) return acc;

    const pnl = totalSell - totalBuy;
    const r = plan?.totalRiskAmount ? pnl / plan.totalRiskAmount : 0;
    if (!acc[setup]) acc[setup] = { name: setup, count: 0, sumR: 0, wins: 0 };
    acc[setup].count += 1; acc[setup].sumR += r; if (r > 0) acc[setup].wins += 1;
    return acc;
  }, {});
  return Object.values(stats).map((s: any) => ({ ...s, expectancy: s.sumR / s.count, winRate: (s.wins / s.count) * 100 }));
}

export async function getBlotter() {
  return await db.select({
    id: executions.id,
    hypothesisId: executions.hypothesisId,
    side: executions.side,
    price: executions.price,
    size: executions.size,
    fee: executions.fee,
    executedAt: executions.executedAt,
    symbol: hypotheses.symbol
  })
  .from(executions)
  .innerJoin(hypotheses, eq(executions.hypothesisId, hypotheses.id))
  .orderBy(desc(executions.executedAt));
}

export async function getBehavioralStats() {
  const violations = await db.select().from(ruleViolations);
  const audits = await db.select().from(auditTrail);
  const allHypotheses = await db.select().from(hypotheses);
  const allExecutions = await db.select().from(executions);

  // 1. Latency: Trigger -> First Fill
  const latencies = allHypotheses
    .filter(h => h.triggerTimestamp && allExecutions.some(e => e.hypothesisId === h.id))
    .map(h => {
      const firstFill = allExecutions
        .filter(e => e.hypothesisId === h.id)
        .sort((a, b) => (a.executedAt?.getTime() || 0) - (b.executedAt?.getTime() || 0))[0];
      return (firstFill.executedAt?.getTime() || 0) - (h.triggerTimestamp?.getTime() || 0);
    });
  
  const avgLatency = latencies.length > 0 ? (latencies.reduce((a, b) => a + b, 0) / latencies.length / 60000).toFixed(1) : '0';

  // 2. Drift: Count audits after 'entered' state (manual adjustment count)
  const drifts = audits.filter(a => a.oldValue === 'entered' || a.oldValue === 'managed').length;
  const avgDrift = allHypotheses.length > 0 ? (drifts / allHypotheses.length).toFixed(1) : '0';

  // 3. Rule Breaks
  const breakRate = allHypotheses.length > 0 ? ((violations.length / allHypotheses.length) * 100).toFixed(0) : '0';

  return {
    latency: `${avgLatency}m`,
    drift: `${avgDrift}/trade`,
    breakRate: `${breakRate}%`,
    violations: violations.slice(0, 5)
  };
}



export async function logViolation(data: any) {
  await db.insert(ruleViolations).values(data);
  revalidatePath('/');
}

export async function addEquitySnapshot(balance: number, drawdown: number) {
  await db.insert(equitySnapshots).values({
    balance,
    drawdown,
    timestamp: new Date()
  });
  revalidatePath('/terminal');
}
