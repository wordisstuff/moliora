import type { Metadata } from 'next';
import LvpLeadForm from './LvpLeadForm';
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
    ['1', 'Explore your options', 'Browse flooring choices or preview a selected floor in your own room.'],
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

export default function LvpFlooringPage() {
    const serviceJsonLd = {
        '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Luxury Vinyl Plank Flooring Installation',
        provider: { '@type': 'HomeAndConstructionBusiness', name: 'Moliora Construction', url: 'https://moliora.us' },
        areaServed: ['Anoka, Minnesota','Ramsey, Minnesota','Andover, Minnesota','Coon Rapids, Minnesota','Blaine, Minnesota','Champlin, Minnesota','North Twin Cities, Minnesota'],
        url: 'https://moliora.us/flooring/lvp',
    };

    return <main className="min-h-screen bg-[#0f1111] text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
        <section className="border-b border-white/10 pt-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-28">
                <div><p className="text-xs font-bold uppercase tracking-[0.32em] text-[#d6ad63]">Moliora Flooring</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">Luxury Vinyl Plank Flooring Installation</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">LVP installation, old flooring removal, floor preparation, baseboards and transitions for homes in Anoka, Ramsey and the North Twin Cities.</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><a href="#flooring-estimate" className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978]">Get a Free Flooring Estimate</a><a href="/flooring/design" className="inline-flex min-h-12 items-center justify-center border border-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-[#f0c978] transition hover:bg-[#d6ad63] hover:text-black">Visualize Your Floor</a><a href={phoneHref} className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold text-white transition hover:border-[#d6ad63] hover:text-[#f0c978]">Call {phoneDisplay}</a></div>
                    <div className="mt-8 grid gap-3 text-sm text-white/65 sm:grid-cols-3"><div className="border-l-2 border-[#d6ad63] pl-3">Clear project scope</div><div className="border-l-2 border-[#d6ad63] pl-3">Local service area</div><div className="border-l-2 border-[#d6ad63] pl-3">Room visualizer</div></div>
                </div>
                <div className="border border-white/10 bg-white/[0.035] p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d6ad63]">One crew, one scope</p><h2 className="mt-3 text-2xl font-semibold">More than just laying planks</h2><p className="mt-4 leading-7 text-white/65">Flooring projects often include demolition, subfloor prep, trim and transitions. We can price these separately so you know what is included before work starts.</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{['Installation','Removal','Floor prep','Trim & transitions'].map(item=><div key={item} className="border border-white/10 bg-black/20 px-4 py-3 text-sm font-medium">{item}</div>)}</div></div>
            </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.02]"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:items-center lg:py-20"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Moliora Design Center</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">See the floor in your room before you request the estimate</h2><p className="mt-4 max-w-2xl leading-7 text-white/65">Upload a room photo, outline the visible floor, choose an LVP option and adjust plank direction. The preview uses perspective and staggered plank joints to give you a better sense of the finished space.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><a href="/flooring/design" className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">Open Design Center</a><a href="/flooring/catalog" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold hover:border-[#d6ad63] hover:text-[#f0c978]">Browse Flooring Catalog</a></div></div><div className="grid grid-cols-2 gap-3 text-sm"><div className="border border-white/10 bg-black/20 p-5"><span className="text-[#d6ad63]">01</span><p className="mt-2 font-semibold">Upload your room</p></div><div className="border border-white/10 bg-black/20 p-5"><span className="text-[#d6ad63]">02</span><p className="mt-2 font-semibold">Outline the floor</p></div><div className="border border-white/10 bg-black/20 p-5"><span className="text-[#d6ad63]">03</span><p className="mt-2 font-semibold">Choose flooring</p></div><div className="border border-white/10 bg-black/20 p-5"><span className="text-[#d6ad63]">04</span><p className="mt-2 font-semibold">Request estimate</p></div></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Flooring Services</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">What we can handle</h2><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{capabilities.map(item=><article key={item.title} className="border border-white/10 bg-white/[0.025] p-6"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{item.text}</p></article>)}</div></section>
        <section className="border-y border-white/10 bg-white/[0.02]"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Simple Process</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">How it works</h2><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{steps.map(([number,title,text])=><div key={number} className="border-t border-[#d6ad63]/60 pt-5"><span className="text-sm font-bold text-[#d6ad63]">{number}</span><h3 className="mt-2 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}</div></div></section>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:py-24"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Local Flooring Help</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Built around a clear estimate</h2><div className="mt-6 space-y-4 text-white/65"><p>We separate installation, demolition, floor preparation and trim so the project scope is easier to understand.</p><p>If hidden subfloor conditions are uncovered after removal, the affected work is reviewed before additional repairs are performed.</p><p>Current target service area includes Anoka, Ramsey, Andover, Coon Rapids, Blaine, Champlin and nearby North Twin Cities communities.</p></div></div><div className="border border-white/10 bg-white/[0.03] p-6 sm:p-8"><h3 className="text-2xl font-semibold">Good fit for your project?</h3><p className="mt-3 leading-7 text-white/65">Send the approximate size and current flooring type. We can use that information to decide the next step and schedule an on-site estimate when needed.</p><a href="#flooring-estimate" className="mt-6 inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">Request Estimate</a></div></section>
        <section className="border-y border-white/10 bg-white/[0.02]"><div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">FAQ</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Common LVP questions</h2><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{faqs.map(item=><details key={item.q} className="group py-5"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">{item.q}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">{item.a}</p></details>)}</div></div></section>
        <section id="flooring-estimate" className="scroll-mt-24"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Free Estimate Request</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Tell us about your floor</h2><p className="mt-4 max-w-lg leading-7 text-white/65">Approximate information is enough. We can confirm measurements and project details before final pricing.</p></div><LvpLeadForm /></div></div></section>
    </main>;
}
