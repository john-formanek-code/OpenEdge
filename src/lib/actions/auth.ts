'use server';

import { login as loginLib } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const success = await loginLib(formData);
  if (success) {
    redirect('/');
  } else {
    // In a real app we'd return an error state, but for simple auth redirect loop is "secure enough" for now
    redirect('/login?error=1');
  }
}
