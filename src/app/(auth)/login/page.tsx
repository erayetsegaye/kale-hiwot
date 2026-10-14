import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-canvas" />}>
      <LoginForm />
    </Suspense>
  );
}
