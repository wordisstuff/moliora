import type { Metadata } from 'next';
import LvpLeadForm from './LvpLeadForm';
import FlooringPlankFan from '@/components/FlooringPlankFan';
import { phoneDisplay, phoneHref } from '@/config/company';

export const metadata: Metadata = {
    title: 'LVP Flooring Installation in Anoka & Ramsey, MN',
    description:
        'Luxury vinyl plank flooring installation, removal, floor preparation, baseboards and transitions in Anoka, Ramsey and the North Twin Cities. Request a free estimate from Moliora.',
    alternates: { canonical: 'https://moliora.us/flooring/lvp' },
    openGraph: {
        title: 'LVP Flooring Installation | Moliora Construction',
        description: 'Professional LVP flooring installation, removal and floor preparation in Anoka, Ramsey and the North Twin Cities.',
        url: 'https://moliora.us/flooring/lvp',
        type: 'website',
    },
};

const capabilities = [
    { title: 'LVP Installation', text: 'Click-lock luxury vinyl plank installation for residential spaces, finished cleanly around walls, doors and transitions.' },
    { title: 'Old Flooring Removal', text: 'Removal of carpet, laminate or existing floating flooring can be included as a separate line item in your estimate.' },
    { title: 'Floor Prep & Leveling', text: 'We inspect the exposed subfloor and quote needed preparation, leveling or localized repairs before installation continues.' },
    { title: 'Baseboards & Transitions', text: 'Baseboards, quarter-round and transition pieces can be handled as part of the same flooring project.' },
    { title: 'Material Pickup & Delivery', text: 'If you want help sourcing or moving flooring and accessories, we can include procurement and delivery in the project scope.' },
];

const steps = [
    ['1', 'Choose the direction', 'Start with the style, tone and general look you want for the room.'],
    ['2', 'Request an estimate', 'Send the basic project details and approximate floor area.'],
    ['3', 'Measure & inspect', 'We confirm measurements, access and the condition of the existing floor.'],
    ['4', 'Install & walkthrough', 'We complete the agreed work and review the finished floor with you.'],
] as const;

const faqs = [
    { q: 'Do you install LVP that I already purchased?', a: 'Yes. You can provide the flooring, or ask Moliora to help source and deliver material for the project.' },
    { q: 'Can you remove my existing flooring?', a: 'Yes. Demolition and disposal can be included separately so you can see exactly what is part of the estimate.' },
    { q: 'What happens if the subfloor is damaged?', a: 'Hidden conditions cannot be fully evaluated before demolition. If we uncover leveling, moisture or subfloor repair needs, we document the condition and quote the additional work before proceeding in that area.' },
    { q: 'Do you give estimates for small rooms and larger projects?', a: 'Yes. We review both smaller room projects and larger multi-room or whole-floor LVP installations in our service area.' },
];

const floorTones = [
    { name: 'Light Oak', note: 'Bright & modern', background: 'radial-gradient(ellipse at 30% 50%, transparent 0 18%, rgba(111,78,48,.28) 19% 21%, transparent 22% 38%), repeating-linear-gradient(96deg,#e3d2b9 0 13px,#c9ae8a 14px,#e5d6bf 17px)' },
    { name: 'Natural Oak', note: 'Timeless & versatile', background: 'radial-gradient(ellipse at 65% 45%, transparent 0 16%, rgba(93,58,31,.30) 17% 19%, transparent 20% 34%), repeating-linear-gradient(94deg,#c9a177 0 12px,#a97a4e 13px,#d0aa80 16px)' },
    { name: 'Warm Oak', note: 'Cozy & inviting', background: 'radial-gradient(ellipse at 35% 54%, transparent 0 18%, rgba(82,47,24,.34) 19% 21%, transparent 22% 36%), repeating-linear-gradient(93deg,#b47743 0 12px,#8e582f 13px,#c4874f 16px)' },
    { name: 'Dark Oak', note: 'Bold & elegant', background: 'radial-gradient(ellipse at 68% 48%, transparent 0 17%, rgba(223,190,145,.16) 18% 20%, transparent 21% 35%), repeating-linear-gradient(95deg,#4e382d 0 12px,#2f241f 13px,#604638 16px)' },
] as const;

export default function LvpFlooringPage() {
    const serviceJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Luxury Vinyl Plank Flooring Installation',
        provider: { '@type': 'HomeAndConstructionBusiness', name: 'Moliora Construction', url: 'https://moliora.us' },
        areaServed: ['Anoka, Minnesota', 'Ramsey, Minnesota', 'Andover, Minnesota', 'Coon Rapids, Minnesota', 'Blaine, Minnesota', 'Champlin, Minnesota', 'North Twin Cities, Minnesota'],
        url: 'https://moliora.us/flooring/lvp',
    };

    return (
        <main className="min-h-screen bg-[#0f1111] text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

            <section className="relative isolate overflow-hidden border-b border-white/10 pt-20">
                <div className="absolute inset-0 -z-30 bg-[url('/interior-construction.jpeg')] bg-cover bg-center" />
                <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(8,9,9,.98)_0%,rgba(8,9,9,.92)_35%,rgba(8,9,9,.66)_62%,rgba(8,9,9,.44)_100%)]" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,11,11,.08),rgba(10,11,11,.3)_55%,#0f1111_100%)]" />
                <div className="pointer-events-none absolute -right-32 top-20 h-[520px] w-[520px] rounded-full bg-[#d6ad63]/10 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:pb-14 lg:pt-24">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#e2bd72]">Moliora Flooring • North Twin Cities</p>
                        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-[4rem]">
                            Luxury Vinyl Plank
                            <span className="block text-[#e9c985]">Flooring Installation</span>
                        </h1>
                        <p className="mt-4 text-xl font-medium text-white/88">Beautiful. Durable. Built for real life.</p>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">Professional LVP installation, old flooring removal, floor preparation, baseboards and transitions for homes in Anoka, Ramsey and the North Twin Cities.</p>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <a href="#flooring-estimate" className="inline-flex min-h-13 items-center justify-center gap-2 bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black shadow-[0_12px_30px_rgba(214,173,99,.18)] transition hover:bg-[#f0c978]">Get a Free Flooring Estimate <span aria-hidden="true">→</span></a>
                            <span className="inline-flex min-h-13 cursor-not-allowed items-center justify-center border border-white/25 bg-black/25 px-6 text-sm font-bold uppercase tracking-wider text-white/65 backdrop-blur-sm" aria-disabled="true">Design Center — Coming Soon</span>
                            <a href={phoneHref} className="inline-flex min-h-13 items-center justify-center border border-white/20 bg-black/25 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#d6ad63] hover:text-[#f0c978]">Call {phoneDisplay}</a>
                        </div>

                        <div className="mt-9 grid max-w-3xl grid-cols-2 gap-x-5 gap-y-4 text-sm text-white/72 sm:grid-cols-4">
                            {['Clean installation', 'Floor prep available', 'Local Minnesota service', 'Clear estimates'].map((item, index) => (
                                <div key={item} className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d6ad63]/35 bg-[#d6ad63]/10 text-xs font-bold text-[#e9c985]">0{index + 1}</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative lg:translate-y-4">
                        <FlooringPlankFan />
                        <p className="pointer-events-none absolute bottom-10 right-0 hidden rotate-[-4deg] text-right font-serif text-xl italic leading-6 text-white/70 xl:block">Your style<br />starts here</p>
                    </div>
                </div>

                <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-6 lg:pb-14">
                    <div className="rounded-2xl border border-white/10 bg-black/65 p-5 shadow-2xl backdrop-blur-md sm:p-6 lg:grid lg:grid-cols-[.85fr_2.15fr] lg:gap-8 lg:p-7">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Popular Floor Tones</p>
                            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Find the look that fits your home</h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">From light and airy to rich and modern, start with a tone you like and we can match it to available product samples.</p>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
                            {floorTones.map(tone => (
                                <div key={tone.name}>
                                    <div className="h-24 rounded-lg border border-white/15 shadow-inner" style={{ background: tone.background }} />
                                    <p className="mt-2 font-semibold">{tone.name}</p>
                                    <p className="mt-1 text-xs text-white/45">{tone.note}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-xs text-white/35 lg:col-start-2 lg:text-right">Style preview only — final product selected from available physical samples.</p>
                    </div>
                </div>
            </section>

            <section className="border-b border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:items-center lg:py-20">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Moliora Design Center</p>
                        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A better flooring preview is in development</h2>
                        <p className="mt-4 max-w-2xl leading-7 text-white/65">We are building a room-based flooring visualizer with approved product textures. Until the product imagery and supplier permissions are fully ready, we are keeping the preview private rather than showing unfinished placeholders.</p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <span className="inline-flex min-h-12 cursor-not-allowed items-center justify-center bg-white/[0.06] px-6 text-sm font-bold uppercase tracking-wider text-white/45" aria-disabled="true">Coming Soon</span>
                            <a href="#flooring-estimate" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold hover:border-[#d6ad63] hover:text-[#f0c978]">Request an Estimate Now</a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {['Upload your room', 'Outline the floor', 'Choose approved flooring', 'Request estimate'].map((item, index) => (
                            <div key={item} className="border border-white/10 bg-black/20 p-5"><span className="text-[#d6ad63]">0{index + 1}</span><p className="mt-2 font-semibold">{item}</p></div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Flooring Services</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">What we can handle</h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {capabilities.map(item => (
                        <article key={item.title} className="border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d6ad63]/40 hover:bg-white/[0.045]"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{item.text}</p></article>
                    ))}
                </div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Simple Process</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">How it works</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map(([number, title, text]) => <div key={number} className="border-t border-[#d6ad63]/60 pt-5"><span className="text-sm font-bold text-[#d6ad63]">{number}</span><h3 className="mt-2 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
                <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Local Flooring Help</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Built around a clear estimate</h2><div className="mt-6 space-y-4 text-white/65"><p>We separate installation, demolition, floor preparation and trim so the project scope is easier to understand.</p><p>If hidden subfloor conditions are uncovered after removal, the affected work is reviewed before additional repairs are performed.</p><p>Current target service area includes Anoka, Ramsey, Andover, Coon Rapids, Blaine, Champlin and nearby North Twin Cities communities.</p></div></div>
                <div className="border border-white/10 bg-white/[0.03] p-6 sm:p-8"><h3 className="text-2xl font-semibold">Good fit for your project?</h3><p className="mt-3 leading-7 text-white/65">Send the approximate size and current flooring type. We can use that information to decide the next step and schedule an on-site estimate when needed.</p><a href="#flooring-estimate" className="mt-6 inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">Request Estimate</a></div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">FAQ</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Common LVP questions</h2><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{faqs.map(item => <details key={item.q} className="group py-5"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">{item.q}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">{item.a}</p></details>)}</div></div>
            </section>

            <section id="flooring-estimate" className="scroll-mt-24">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Free Estimate Request</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Tell us about your floor</h2><p className="mt-4 max-w-lg leading-7 text-white/65">Approximate information is enough. We can confirm measurements and project details before final pricing.</p></div><LvpLeadForm /></div></div>
            </section>
        </main>
    );
}
