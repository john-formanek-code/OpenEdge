import { NextResponse } from 'next/server';

export const revalidate = 0; // Dynamic route

const SYMBOLS = ['NVDA', 'AAPL', 'TSLA', 'AMD', 'SPY', 'QQQ', 'META', 'AMZN', 'MSFT', 'IWM', 'PLTR', 'SMCI'];
const EXPIRATIONS = ['0DTE', '1W', '2W', '1M', '3M', '6M', 'LEAP'];
const TYPES = ['SWEEP', 'BLOCK', 'SPLIT'];
const SENTIMENTS = ['BULLISH', 'BEARISH', 'NEUTRAL'];

// Simulates a live tape of institutional options flow and dark pool prints
export async function GET() {
  const now = new Date();
  
  // Generate 15-20 random recent flow prints
  const flowCount = Math.floor(Math.random() * 5) + 15;
  const flows = [];

  for (let i = 0; i < flowCount; i++) {
    // Randomize timestamp within the last 5 minutes
    const timeOffset = Math.floor(Math.random() * 300000); 
    const printTime = new Date(now.getTime() - timeOffset);
    
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const expiration = EXPIRATIONS[Math.floor(Math.random() * EXPIRATIONS.length)];
    const isCall = Math.random() > 0.5;
    const strikeOffset = Math.floor(Math.random() * 20) - 5; // -5 to +15%
    
    let sentiment = 'NEUTRAL';
    if (isCall && type === 'SWEEP') sentiment = 'BULLISH';
    if (!isCall && type === 'SWEEP') sentiment = 'BEARISH';
    if (isCall && strikeOffset < 0) sentiment = 'BULLISH'; // Deep ITM call
    if (!isCall && strikeOffset < 0) sentiment = 'BEARISH'; // Deep ITM put
    
    const premium = Math.floor(Math.random() * 5000) * 1000 + 100000; // 100k to 5.1M
    const premiumFormatted = premium > 1000000 ? `${(premium / 1000000).toFixed(1)}M` : `${(premium / 1000).toFixed(0)}K`;

    flows.push({
      id: `print-${now.getTime()}-${i}`,
      time: printTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: printTime.getTime(),
      symbol,
      type,
      contract: `${isCall ? 'C' : 'P'} | ${expiration}`,
      premium: `$${premiumFormatted}`,
      sentiment,
      details: `${type} ${isCall ? 'CALL' : 'PUT'} at ask. High urgency.`
    });
  }

  // Sort by most recent first
  flows.sort((a, b) => b.timestamp - a.timestamp);

  return NextResponse.json({ flows });
}
