'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign in to RajGharana</h1>
        <SignIn path="/sign-in" routing="path" />
      </div>
    </div>
  );
}
