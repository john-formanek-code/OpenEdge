import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const hypotheses = sqliteTable('hypotheses', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  symbol: text('symbol').notNull(),
  assetClass: text('asset_class').notNull(), 
  exchange: text('exchange'),
  setupType: text('setup_type').notNull(),  
  bias: text('bias').notNull(),        
  timeframe: text('timeframe').notNull(),   
  priority: integer('priority').default(3), 
  confidence: integer('confidence').default(3), 
  status: text('status').default('active'), 
  state: text('state').default('idea'), 
  
  // Behavioral tracking
  triggerTimestamp: integer('trigger_timestamp', { mode: 'timestamp' }), 
  
  // Liquidity snapshot
  avgDailyVolume: real('avg_daily_volume'),
  bidAskSpread: real('bid_ask_spread'),

  triggerCondition: text('trigger_condition'),
  invalidationLevel: real('invalidation_level'),
  entryPlan: text('entry_plan'),
  stopLoss: real('stop_loss'),
  targets: text('targets'), 
  
  nextReviewAt: integer('next_review_at', { mode: 'timestamp' }),
  lastUpdatedAt: integer('last_updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  
  tvUrl: text('tv_url'),
  notesUrl: text('notes_url'),
  tags: text('tags'), 
});

export const ruleViolations = sqliteTable('rule_violations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hypothesisId: text('hypothesis_id').references(() => hypotheses.id).notNull(),
  type: text('type').notNull(), // 'fomo', 'revenge', 'hesitation', 'drift'
  severity: text('severity').notNull(), // 'low', 'medium', 'high'
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ... (keep all other tables: activityLogs, marketStates, tradePlans, executions, portfolioClusters, performanceMetrics, strategies, marketFeatures, backtests, equitySnapshots, auditTrail, marketEvents)
export const activityLogs = sqliteTable('activity_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hypothesisId: text('hypothesis_id').references(() => hypotheses.id),
  type: text('type').notNull(), 
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const marketStates = sqliteTable('market_states', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  regime: text('regime').notNull(), 
  vixProxy: real('vix_proxy'),
  keyEvents: text('key_events'), 
  biasSummary: text('bias_summary'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const tradePlans = sqliteTable('trade_plans', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hypothesisId: text('hypothesis_id').references(() => hypotheses.id).notNull(),
  riskUnit: text('risk_unit').default('fixed_amount'),
  riskValue: real('risk_value').notNull(),
  accountSize: real('account_size').notNull(),
  entries: text('entries', { mode: 'json' }).notNull(),
  stopLoss: text('stop_loss', { mode: 'json' }).notNull(),
  targets: text('targets', { mode: 'json' }).notNull(),
  avgEntryPrice: real('avg_entry_price'),
  totalPositionSize: real('total_position_size'),
  totalRiskAmount: real('total_risk_amount'),
  maxR: real('max_r'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const executions = sqliteTable('executions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hypothesisId: text('hypothesis_id').references(() => hypotheses.id).notNull(),
  side: text('side').notNull(), 
  price: real('price').notNull(),
  size: real('size').notNull(),
  fee: real('fee').default(0),
  slippageBps: real('slippage_bps'),
  executedAt: integer('executed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const portfolioClusters = sqliteTable('portfolio_clusters', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(), 
  description: text('description'),
});

export const performanceMetrics = sqliteTable('performance_metrics', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hypothesisId: text('hypothesis_id').references(() => hypotheses.id).notNull(),
  pnlAlpha: real('pnl_alpha'), 
  pnlBeta: real('pnl_beta'), 
  pnlExecution: real('pnl_execution'), 
  timingScore: integer('timing_score'), 
  mae: real('mae'), 
  mfe: real('mfe'), 
});

export const strategies = sqliteTable('strategies', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(), 
  description: text('description'),
  allowedRegimes: text('allowed_regimes', { mode: 'json' }).notNull(), 
  status: text('status').default('active'), 
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const marketFeatures = sqliteTable('market_features', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  symbol: text('symbol').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  name: text('name').notNull(), 
  value: real('value').notNull(),
  meta: text('meta', { mode: 'json' }), 
});

export const backtests = sqliteTable('backtests', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  strategyId: text('strategy_id').references(() => strategies.id).notNull(),
  type: text('type').notNull(), 
  status: text('status').default('pending'), 
  config: text('config', { mode: 'json' }), 
  results: text('results', { mode: 'json' }), 
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const equitySnapshots = sqliteTable('equity_snapshots', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  balance: real('balance').notNull(),
  drawdown: real('drawdown').notNull(), 
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const auditTrail = sqliteTable('audit_trail', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  hypothesisId: text('hypothesis_id').references(() => hypotheses.id).notNull(),
  changeType: text('change_type').notNull(), 
  oldValue: text('old_value'),
  newValue: text('new_value'),
  reason: text('reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const marketEvents = sqliteTable('market_events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(), 
  impact: text('impact').notNull(), 
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  instrumentClass: text('instrument_class'), 
});
