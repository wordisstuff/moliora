import type { Metadata } from 'next';
import Link from 'next/link';
import LvpProjectEstimator from '../LvpProjectEstimator';

export const metadata: Metadata = {
  title: 'LVP Flooring Cost Estimator | Moliora',
  description: 'Estimate your LVP flooring project cost online. Add room size, existing flooring, trim, materials and project details to see a planning range.',
  alternates: { canonical: 'https://moliora.us/flooring/lvp/estimate' },
};

export default function LvpEstimatePage() {
  return (
    <main className="min-h-screen bg-[#0f1111] px-5 pb-16 pt-24 text-white sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-4xl">
        <Link href="/flooring/lvp" className="text-sm text-white/50 transition hover:text-[#f0c978]">← Back to LVP Flooring</Link>
        <div className="mb-7 mt-7 text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Moliora LVP Project Planner</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">LVP Flooring Cost Estimator</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/60">Build your flooring project step by step. See a preliminary price range, then send the same project details to Moliora for an exact quote.</p>
          <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/45">
            <span>✓ Takes about 2 minutes</span><span>✓ No obligation</span><span>✓ Local Minnesota service</span>
          </div>
        </div>
        <LvpProjectEstimator standalone />
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-white/35">Planning estimates are based on the project details you provide. Final pricing is confirmed after measurements, product selection and site conditions are reviewed.</p>
      </div>
    </main>
  );
}
