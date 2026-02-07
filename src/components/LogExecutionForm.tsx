'use client';

import { useState } from 'react';
import { addExecution } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';

export function LogExecutionForm({ hypothesisId }: { hypothesisId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const data = {
        hypothesisId,
        side: formData.get('side') as string,
        price: parseFloat(formData.get('price') as string),
        size: parseFloat(formData.get('size') as string),
        fee: parseFloat(formData.get('fee') as string) || 0,
        executedAt: new Date(),
      };
      await addExecution(data);
      toast.success('Execution logged');
      (document.getElementById('exec-form') as HTMLFormElement).reset();
    } catch {
      toast.error('Failed to log execution');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bb-card">
      <h3 className="text-[10px] font-black text-[#888] uppercase mb-3 tracking-[0.08em]">Log Realized Execution</h3>
      <form id="exec-form" action={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <select name="side" className="bb-select w-20">
          <option value="buy">BUY</option>
          <option value="sell">SELL</option>
        </select>
        <input name="price" type="number" step="any" required placeholder="Fill Price" className="bb-input flex-1 min-w-[140px]" />
        <input name="size" type="number" step="any" required placeholder="Size" className="bb-input w-24" />
        <input name="fee" type="number" step="any" placeholder="Fee $" className="bb-input w-20" />
        <button 
          disabled={isPending}
          className="bb-button h-9 px-4 disabled:opacity-50"
        >
          {isPending ? '...' : 'Log Fill'}
        </button>
      </form>
    </div>
  );
}
