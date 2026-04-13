'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-2 mb-4 bg-[#0a0a0a] p-3 border border-zinc-800">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
        <input
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="SEARCH SYMBOLS / TRIGGERS..."
          className="w-full bg-black border border-zinc-800 rounded-none pl-8 pr-4 py-1.5 text-[11px] font-mono focus:outline-none focus:border-amber-500 transition-colors placeholder-zinc-700"
        />
      </div>
      
      <div className="flex flex-wrap gap-1">
        <select
          defaultValue={searchParams.get('assetClass') || 'all'}
          onChange={(e) => handleFilterChange('assetClass', e.target.value)}
          className="bg-black border border-zinc-800 rounded-none px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="all">ALL ASSETS</option>
          <option value="crypto">CRYPTO</option>
          <option value="forex">FOREX</option>
          <option value="equities">EQUITIES</option>
        </select>

         <select
          defaultValue={searchParams.get('timeframe') || 'all'}
          onChange={(e) => handleFilterChange('timeframe', e.target.value)}
          className="bg-black border border-zinc-800 rounded-none px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="all">ALL TFs</option>
          <option value="1H">1H</option>
          <option value="4H">4H</option>
          <option value="1D">1D</option>
          <option value="1W">1W</option>
        </select>

         <select
          defaultValue={searchParams.get('bias') || 'all'}
          onChange={(e) => handleFilterChange('bias', e.target.value)}
          className="bg-black border border-zinc-800 rounded-none px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="all">ALL BIAS</option>
          <option value="long">LONG</option>
          <option value="short">SHORT</option>
          <option value="neutral">NEUTRAL</option>
        </select>

        <select
          defaultValue={searchParams.get('sort') || 'priority_desc'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="bg-black border border-zinc-800 rounded-none px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-amber-500 transition-colors ml-auto"
        >
          <option value="priority_desc">PRIORITY ↑</option>
          <option value="updated_desc">UPDATED ↑</option>
          <option value="review_asc">REVIEW ↓</option>
        </select>
      </div>
      
      {isPending && (
        <div className="flex items-center text-xs text-zinc-500 animate-pulse">
          Updating view...
        </div>
      )}
    </div>
  );
}
