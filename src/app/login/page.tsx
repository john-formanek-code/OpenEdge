'use client';

import { login } from '@/lib/actions/auth';
import { Shield } from 'lucide-react';

// We'll create the action in the next step
// This is a client wrapper for the form
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-zinc-900 p-4 rounded-full mb-4 border border-zinc-800">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">OpenEdge Protected</h1>
          <p className="text-zinc-400 mt-2">Enter your password to access the terminal.</p>
        </div>

        <form action={login} className="space-y-4">
          <div>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="Password..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
