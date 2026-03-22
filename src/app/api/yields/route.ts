import { NextResponse } from 'next/server';

export const revalidate = 0;

// Base realistic yields as of early 2024
const BASE_YIELDS = {
  US: [5.37, 5.41, 5.35, 5.02, 4.62, 4.25, 4.28, 4.42],
  UK: [5.20, 5.25, 5.15, 4.80, 4.30, 4.05, 4.10, 4.55],
  DE: [3.80, 3.85, 3.80, 3.50, 2.90, 2.45, 2.40, 2.55],
  JP: [-0.05, -0.01, 0.05, 0.12, 0.19, 0.38, 0.75, 1.80],
};

const TERMS = ['1M', '3M', '6M', '1Y', '2Y', '5Y', '10Y', '30Y'];

export async function GET() {
  // Add a small random jitter to simulate live market data
  // Using a deterministic-ish approach based on current minute so it's consistent within the minute
  const now = new Date();
  const seed = now.getMinutes() + now.getHours() * 60;
  
  // Pseudo-random generator based on seed
  const pseudoRandom = (min: number, max: number, index: number) => {
    const x = Math.sin(seed + index) * 10000;
    const rand = x - Math.floor(x);
    return min + rand * (max - min);
  };

  const YIELD_CURVE_DATA = TERMS.map((term, i) => {
    // Add ±0.05% jitter
    const jitter = () => pseudoRandom(-0.05, 0.05, i);
    
    return {
      term,
      us: BASE_YIELDS.US[i] + pseudoRandom(-0.03, 0.03, i * 1),
      uk: BASE_YIELDS.UK[i] + pseudoRandom(-0.04, 0.04, i * 2),
      de: BASE_YIELDS.DE[i] + pseudoRandom(-0.02, 0.02, i * 3),
      jp: BASE_YIELDS.JP[i] + pseudoRandom(-0.01, 0.01, i * 4),
    };
  });

  return NextResponse.json({ yields: YIELD_CURVE_DATA });
}
