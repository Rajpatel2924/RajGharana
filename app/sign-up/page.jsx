'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-2xl font-semibold mb-4 text-center">Create your RajGharana account</h1>
        <SignUp path="/sign-up" routing="path" />
      </div>
    </div>
  );
}
