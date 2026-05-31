'use client';

import { assets } from '@/assets/assets';
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

const clerkAppearance = {
  variables: {
    colorPrimary: '#ea580c',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#0f172a',
    borderRadius: '8px',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none',
    card: 'w-full shadow-none border-0 p-0',
    headerTitle: 'text-slate-950',
    headerSubtitle: 'text-slate-500',
    socialButtonsBlockButton: 'border-slate-200 hover:bg-orange-50',
    formFieldInput: 'border-slate-300 focus:border-orange-600 focus:ring-orange-600',
    formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 normal-case',
    footerActionLink: 'text-orange-600 hover:text-orange-700',
  },
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <Link href="/" aria-label="RajGharana home">
          <Image src={assets.logo} alt="RajGharana logo" className="h-auto w-40" priority />
        </Link>

        <section className="mt-8 w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Join RajGharana</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Save your delivery details, track purchases, and build your wishlist.
          </p>

          <div className="mt-6">
            <SignUp
              routing="hash"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/"
              appearance={clerkAppearance}
            />
          </div>
        </section>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-orange-600 hover:text-orange-700">
            Sign in
          </Link>
        </p>

        <div className="mt-8 flex gap-5 text-xs text-slate-500">
          <Link href="/privacy-policy" className="hover:text-orange-600">Privacy notice</Link>
          <span>Secure registration</span>
        </div>
      </div>
    </main>
  );
}
