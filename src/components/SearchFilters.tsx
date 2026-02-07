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
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search symbols, triggers, or notes..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white transition-colors"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select
          defaultValue={searchParams.get('assetClass') || 'all'}
          onChange={(e) => handleFilterChange('assetClass', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">All Assets</option>
          <option value="crypto">Crypto</option>
          <option value="forex">Forex</option>
          <option value="equities">Equities</option>
        </select>

         <select
          defaultValue={searchParams.get('timeframe') || 'all'}
          onChange={(e) => handleFilterChange('timeframe', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">All Timeframes</option>
          <option value="1H">1H</option>
          <option value="4H">4H</option>
          <option value="1D">1D</option>
          <option value="1W">1W</option>
        </select>

         <select
          defaultValue={searchParams.get('bias') || 'all'}
          onChange={(e) => handleFilterChange('bias', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
        >
          <option value="all">All Biases</option>
          <option value="long">Long</option>
          <option value="short">Short</option>
          <option value="neutral">Neutral</option>
        </select>

        <select
          defaultValue={searchParams.get('sort') || 'priority_desc'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors ml-auto"
        >
          <option value="priority_desc">Priority (High to Low)</option>
          <option value="updated_desc">Last Updated</option>
          <option value="review_asc">Next Review (Soonest)</option>
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
