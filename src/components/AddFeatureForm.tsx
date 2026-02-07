'use client';

import { addMarketFeature } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export function AddFeatureForm() {
  async function handleSubmit(formData: FormData) {
    try {
      await addMarketFeature({
        symbol: formData.get('symbol'),
        name: formData.get('name'),
        value: parseFloat(formData.get('value') as string),
      });
      toast.success('Feature stored');
      (document.getElementById('feature-form') as HTMLFormElement).reset();
    } catch {
      toast.error('Failed to store feature');
    }
  }

  return (
    <form
      id="feature-form"
      action={handleSubmit}
      className="flex gap-2 items-center bg-[#0a0a0a] border border-[color:var(--bb-border)] px-2 py-1"
    >
      <div className="flex items-center space-x-2">
        <label className="sr-only" htmlFor="symbol">Symbol</label>
        <input
          id="symbol"
          name="symbol"
          placeholder="AAPL"
          required
          className="bb-input w-16 h-8 text-[10px]"
        />
        <label className="sr-only" htmlFor="name">Feature Name</label>
        <input
          id="name"
          name="name"
          placeholder="ADX_14"
          required
          className="bb-input w-32 h-8 text-[10px]"
        />
        <label className="sr-only" htmlFor="value">Value</label>
        <input
          id="value"
          name="value"
          type="number"
          step="any"
          required
          className="bb-input w-20 h-8 text-[10px]"
        />
      </div>
      <button className="bb-button h-8 px-3">
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Store</span>
      </button>
    </form>
  );
}
