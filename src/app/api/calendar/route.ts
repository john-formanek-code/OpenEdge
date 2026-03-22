import { NextResponse } from 'next/server';
import { fetchWithTimeout } from '@/lib/utils';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const res = await fetchWithTimeout('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
      next: { revalidate: 3600 },
      timeout: 5000
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
    }

    const data = await res.json();
    
    // Process and map data to match our UI
    const events = data.map((e: any) => {
      // Parse the ISO date
      const date = new Date(e.date);
      const timeStr = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      // Map impact
      let impact: 'HIGH' | 'MED' | 'LOW' = 'LOW';
      if (e.impact === 'High') impact = 'HIGH';
      if (e.impact === 'Medium') impact = 'MED';

      // Map currency to country roughly
      let country = e.country;
      if (country === 'USD') country = 'US';
      if (country === 'EUR') country = 'EU';
      if (country === 'GBP') country = 'UK';
      if (country === 'JPY') country = 'JP';
      if (country === 'AUD') country = 'AU';
      if (country === 'CAD') country = 'CA';
      if (country === 'CHF') country = 'CH';
      if (country === 'CNY') country = 'CN';
      if (country === 'NZD') country = 'NZ';

      return {
        time: timeStr,
        country: country,
        indicator: e.title,
        impact: impact,
        actual: '', // Future events don't have actuals usually from this basic endpoint unless we hit it right after, but previous/forecast is good
        forecast: e.forecast || '',
        previous: e.previous || '',
      };
    });

    return NextResponse.json({ events });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process calendar' }, { status: 500 });
  }
}
