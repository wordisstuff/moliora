import type { Metadata } from 'next';
import Link from 'next/link';
import LvpProjectEstimator from '../LvpProjectEstimator';
import { phoneDisplay, phoneHref } from '@/config/company';

export const metadata: Metadata = {
  title: 'LVP Flooring Cost Estimator | Moliora',
  description: 'Plan your LVP flooring project online. Estimate installation, removal, floor prep, trim and materials, then request a local Moliora quote.',
  alternates: { canonical: 'https://moliora.us/flooring/lvp/estimate' },
};

const services = [
  ['LVP Installation', 'Professional click-lock LVP installation for rooms, multi-room projects and larger floor areas.'],
  ['Old Flooring Removal', 'Carpet, laminate and existing floating flooring removal can be included in the project scope.'],
  ['Floor Prep', 'Subfloor preparation, leveling and localized repairs can be scoped when needed.'],
  ['Trim & Transitions', 'Baseboards, quarter-round and transition pieces can be included with the flooring work.'],
] as const;

const faqs = [
  ['Can I use flooring I already bought?', 'Yes. Moliora can install customer-supplied LVP, or help source and deliver material for the project.'],
  ['Is the online number a final quote?', 'No. The estimator gives a planning range. Final scope and pricing are confirmed after measurements, product selection and site conditions are reviewed.'],
  ['Do you handle small projects?', 'Yes. Moliora reviews smaller rooms as well as larger multi-room and whole-floor LVP projects in the service area.'],
] as const;

export default function LvpEstimatePage() {
  return (
    <main className="min-h-screen bg-[#0f1111] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 px-5 pb-10 pt-24 sm:px-6 sm:pt-28">
        <div className="absolute inset-0 -z-20 bg-[url('/lvp2.PNG')] bg-cover bg-[position:70%_center] sm:bg-[position:88%_center]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,9,9,.92)_0%,rgba(8,9,9,.84)_42%,rgba(8,9,9,.58)_70%,rgba(8,9,9,.45)_100%)]" />
        <div className="mx-auto max-w-5xl">
          <Link href="/flooring/lvp" className="text-sm text-white/50 transition hover:text-[#f0c978]">← Back to LVP Flooring</Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Moliora LVP Project Planner</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">Plan Your LVP Project Before You Call</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
                Enter your room size and project details to see a preliminary installation range. Then send the same project to Moliora for a reviewed quote.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a href="#estimator" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#d6ad63] px-6 font-bold text-black transition hover:bg-[#f0c978]">
                  Start My Estimate
                </a>
                <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-6 font-semibold text-white transition hover:border-[#d6ad63] hover:text-[#f0c978]">
                  Call {phoneDisplay}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {['About 2 minutes', 'No obligation', 'Ramsey & Anoka area', 'Customer-supplied LVP welcome'].map(item => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[.03] p-4 text-white/70">
                  <span className="mr-2 text-[#d6ad63]">✓</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="estimator" className="scroll-mt-24 px-5 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">Build Your Project</p>
            <h2 className="mt-2 text-3xl font-semibold">See Your Estimated Project Range</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Include removal, floor condition, trim, stairs and material choices so the range better reflects your actual project.
            </p>
          </div>

          <LvpProjectEstimator standalone />

          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-white/35">
            Planning estimates are based on the details you provide. Final pricing is confirmed after measurements, product selection and site conditions are reviewed.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[.02] px-5 py-14 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">What Moliora Can Include</p>
          <h2 className="mt-2 text-3xl font-semibold">More Than Just Laying Planks</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(([title, text]) => (
              <article key={title} className="border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">Local LVP Installation</p>
            <h2 className="mt-2 text-3xl font-semibold">Ready for Moliora to Review Your Project?</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/60">
              Moliora serves Ramsey, Anoka, Andover, Coon Rapids, Blaine, Champlin and nearby North Twin Cities communities. Use the planner first, or call if you already know what you need.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#estimator" className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">
                Build My Estimate
              </a>
              <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold hover:border-[#d6ad63] hover:text-[#f0c978]">
                Call {phoneDisplay}
              </a>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map(([q, a]) => (
              <details key={q} className="py-5">
                <summary className="cursor-pointer list-none pr-6 font-semibold">{q}</summary>
                <p className="mt-3 text-sm leading-6 text-white/55">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
