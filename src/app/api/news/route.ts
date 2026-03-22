import { NextResponse } from 'next/server';
import { fetchWithTimeout } from '@/lib/utils';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const res = await fetchWithTimeout('https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', {
      next: { revalidate: 60 },
      timeout: 5000
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    const xml = await res.text();
    
    // Simple regex parsing for RSS items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    let idCounter = 1;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || itemXml.match(/<description>(.*?)<\/description>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      
      if (titleMatch) {
        const title = titleMatch[1];
        const description = descMatch ? descMatch[1] : '';
        const pubDateStr = pubDateMatch ? pubDateMatch[1] : new Date().toUTCString();
        const date = new Date(pubDateStr);
        
        // Simple heuristic for sentiment (just for flavor)
        let sentiment = 'NEUTRAL';
        const lowerDesc = (title + ' ' + description).toLowerCase();
        if (lowerDesc.match(/surge|jump|rally|higher|up|beat|gain|bull|grow|approve/)) sentiment = 'POSITIVE';
        if (lowerDesc.match(/plunge|drop|fall|down|miss|loss|bear|shrink|halt|sell|worry|crash/)) sentiment = 'NEGATIVE';

        // Breaking News Heuristic
        const isBreaking = title.includes('URGENT') || title.includes('BREAKING') || lowerDesc.match(/fed|inflation|cpi|war|attack|sec sues|hacks/);

        // Extract some fake tags based on keywords
        const tags = [];
        if (lowerDesc.includes('crypto') || lowerDesc.includes('bitcoin') || lowerDesc.includes('etf')) tags.push('CRYPTO');
        if (lowerDesc.includes('fed') || lowerDesc.includes('rate') || lowerDesc.includes('powell')) tags.push('MACRO', 'FED');
        if (lowerDesc.includes('tech') || lowerDesc.includes('apple') || lowerDesc.includes('nvidia') || lowerDesc.includes('google')) tags.push('TECH');
        if (lowerDesc.includes('oil') || lowerDesc.includes('energy')) tags.push('ENERGY');
        if (tags.length === 0) tags.push('MARKETS');

        items.push({
          id: `cnbc-${idCounter++}`,
          time: date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          source: 'CNBC',
          headline: title,
          body: description,
          sentiment,
          tags,
          isBreaking: !!isBreaking
        });
      }
    }

    return NextResponse.json({ news: items.slice(0, 30) }); // Return top 30 news items for a denser tape

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process news' }, { status: 500 });
  }
}
