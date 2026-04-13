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
      className="flex gap-1 items-center bg-black border-l border-zinc-800 px-2 h-full"
    >
      <input
        id="symbol"
        name="symbol"
        placeholder="SYM"
        required
        className="bg-black border border-zinc-800 text-[10px] w-12 h-6 px-1 outline-none focus:border-amber-500 uppercase font-mono"
      />
      <input
        id="name"
        name="name"
        placeholder="FEATURE_NAME"
        required
        className="bg-black border border-zinc-800 text-[10px] w-24 h-6 px-1 outline-none focus:border-amber-500 uppercase font-mono"
      />
      <input
        id="value"
        name="value"
        type="number"
        step="any"
        required
        placeholder="VAL"
        className="bg-black border border-zinc-800 text-[10px] w-16 h-6 px-1 outline-none focus:border-amber-500 font-mono"
      />
      <button className="bg-amber-500/10 border border-amber-500/50 text-amber-500 h-6 px-2 text-[9px] font-black hover:bg-amber-500/20 transition-colors uppercase">
        STORE
      </button>
    </form>
  );
}
