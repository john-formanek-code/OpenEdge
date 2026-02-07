export type RegimeParams = {
  adx: number;
  vix: number;
  ma200Slope: 'up' | 'down' | 'flat';
};

export function classifyRegime(params: RegimeParams): string {
  const { adx, vix, ma200Slope } = params;

  // 1. Volatility Filter
  if (vix > 30) return 'high-vol / crash risk';
  if (vix > 20) return 'volatile';

  // 2. Trend Strength (ADX)
  if (adx > 25) {
    if (ma200Slope === 'up') return 'strong-trend-up';
    if (ma200Slope === 'down') return 'strong-trend-down';
    return 'trend-conflicted';
  }

  // 3. Low Trend
  if (adx < 20) {
    return 'range / mean-reversion';
  }

  return 'neutral / chop';
}
