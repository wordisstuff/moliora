import type { Metadata } from 'next';
import LvpLeadForm from './LvpLeadForm';
import LvpProjectEstimator from './LvpProjectEstimator';
import FlooringPlankFan from '@/components/FlooringPlankFan';

const flooringPhoneDisplay = '(272) 277-0072';
const flooringPhoneHref = 'tel:+12722770072';

export const metadata: Metadata = {
    title: 'LVP Flooring Installation in Minneapolis–St. Paul, MN | Moliora',
    description:
        'Professional luxury vinyl plank (LVP) flooring installation in Ramsey, Anoka and the North Twin Cities. Removal, floor prep, trim and free estimates from Moliora.',
    alternates: { canonical: 'https://moliora.us/flooring/lvp' },
    openGraph: {
        title: 'Luxury Vinyl Plank Flooring Installation | Moliora',
        description:
            'Professional LVP flooring installation, removal, floor preparation and trim in Ramsey, Anoka and the North Twin Cities.',
        url: 'https://moliora.us/flooring/lvp',
        type: 'website',
    },
};

const capabilities = [
    { title: 'LVP Installation', text: 'Click-lock luxury vinyl plank installation for residential spaces, finished cleanly around walls, doors and transitions.' },
    { title: 'Old Flooring Removal', text: 'Removal of carpet, laminate or existing floating flooring can be included in the overall project scope.' },
    { title: 'Floor Prep & Leveling', text: 'We inspect the exposed subfloor and quote needed preparation, leveling or localized repairs before installation continues.' },
    { title: 'Baseboards & Transitions', text: 'Baseboards, quarter-round and transition pieces can be handled as part of the same flooring project.' },
    { title: 'Material Pickup & Delivery', text: 'If you want help sourcing or moving flooring and accessories, we can include procurement and delivery in the project scope.' },
];

const steps = [
    ['1', 'Plan your project', 'Use the project planner to enter room size, existing flooring and project details.'],
    ['2', 'See a planning range', 'Get one approximate project range based on the selections you make.'],
    ['3', 'Measure & inspect', 'We confirm measurements, access and the condition of the existing floor.'],
    ['4', 'Install & walkthrough', 'We complete the agreed scope and review the finished floor with you.'],
] as const;

const faqs = [
    { q: 'Do you install LVP that I already purchased?', a: 'Yes. You can provide the flooring, or ask Moliora to help source and deliver material for the project.' },
    { q: 'Can you remove my existing flooring?', a: 'Yes. Demolition and disposal can be included in the overall project scope and reflected in the project estimate.' },
    { q: 'What happens if the subfloor is damaged?', a: 'Hidden conditions cannot be fully evaluated before demolition. If we uncover leveling, moisture or subfloor repair needs, we document the condition and quote the additional work before proceeding in that area.' },
    { q: 'Do you install dark, black, gray and light LVP?', a: 'Yes. Available LVP lines include light, natural, gray, warm brown and very dark looks. We can help narrow the options based on your room and preferred style.' },
    { q: 'How many LVP styles are available?', a: 'Availability changes by supplier and collection. The preview colors on this page are only a small sample of what can be sourced.' },
    { q: 'Do you give estimates for small rooms and larger projects?', a: 'Yes. We review both smaller room projects and larger multi-room or whole-floor LVP installations in our service area.' },
];

const floorTones = [
    { name: 'Light Oak', note: 'Bright & modern', src: '/plank/1.png' },
    { name: 'Natural Oak', note: 'Timeless & versatile', src: '/plank/2.png' },
    { name: 'Warm Oak', note: 'Cozy & inviting', src: '/plank/3.png' },
    { name: 'Dark Oak', note: 'Bold & elegant', src: '/plank/4.png' },
] as const;

export default function LvpFlooringPage() {
    const serviceJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Luxury Vinyl Plank Flooring Installation',
        provider: { '@type': 'HomeAndConstructionBusiness', name: 'Moliora LLC', url: 'https://moliora.us' },
        areaServed: ['Ramsey, Minnesota', 'Anoka, Minnesota', 'Andover, Minnesota', 'Coon Rapids, Minnesota', 'Blaine, Minnesota', 'Champlin, Minnesota', 'Minneapolis–St. Paul, Minnesota'],
        url: 'https://moliora.us/flooring/lvp',
        telephone: '+12722770072',
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };

    return (
        <main className="min-h-screen bg-[#0f1111] text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <section className="relative isolate overflow-hidden border-b border-white/10 pt-20">
                <div className="absolute inset-0 -z-30 bg-[url('/interior-construction.jpeg')] bg-cover bg-center" />
                <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(8,9,9,.98)_0%,rgba(8,9,9,.92)_35%,rgba(8,9,9,.66)_62%,rgba(8,9,9,.44)_100%)]" />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,11,11,.08),rgba(10,11,11,.3)_55%,#0f1111_100%)]" />

                <div className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:pb-14 lg:pt-24">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#e2bd72]">Moliora Flooring • Ramsey, Anoka & North Twin Cities</p>
                        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-[4rem]">
                            Luxury Vinyl Plank
                            <span className="block text-[#e9c985]">Flooring Installation</span>
                        </h1>
                        <p className="mt-4 text-xl font-medium text-white/88">Professional LVP installation for Minnesota homes.</p>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">Installation, old-floor removal, subfloor preparation, baseboards and transitions — with a clear estimate before work begins.</p>

                        <div className="mt-7 max-w-xl">
                            <LvpProjectEstimator />
                            <a href="#flooring-estimate" className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-white/20 bg-black/25 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#d6ad63] hover:text-[#f0c978]">Request Estimate</a>
                        </div>

                        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-x-5 gap-y-4 text-sm text-white/72 sm:grid-cols-4">
                            {['Project planner', 'Instant range', 'Floor prep available', 'Local Minnesota service'].map((item, index) => (
                                <div key={item} className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d6ad63]/35 bg-[#d6ad63]/10 text-xs font-bold text-[#e9c985]">0{index + 1}</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative lg:translate-y-4">
                        <FlooringPlankFan />
                        <div className="mx-auto -mt-3 max-w-md rounded-xl border border-[#d6ad63]/25 bg-black/55 px-4 py-3 text-center backdrop-blur-sm">
                            <p className="text-sm font-semibold text-[#f0c978]">Dozens of LVP looks are available — not just the six shown here.</p>
                            <p className="mt-1 text-xs leading-5 text-white/55">Explore light, natural, gray, warm brown and dark flooring looks, then we can help match the direction to available products.</p>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-6 lg:pb-14">
                    <div className="rounded-2xl border border-white/10 bg-black/65 p-5 shadow-2xl backdrop-blur-md sm:p-6 lg:grid lg:grid-cols-[.85fr_2.15fr] lg:gap-8 lg:p-7">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Popular Floor Tones</p>
                            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Find the look that fits your home</h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-white/55">The four tones below are style examples. Product selection is wider and changes by collection and supplier.</p>
                            <a href="/flooring/design" className="mt-5 inline-flex min-h-11 items-center justify-center border border-[#d6ad63]/50 px-5 text-xs font-bold uppercase tracking-wider text-[#f0c978] hover:bg-[#d6ad63] hover:text-black">Try the Flooring Designer</a>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
                            {floorTones.map(tone => (
                                <div key={tone.name}>
                                    <div className="h-24 rounded-lg border border-white/15 bg-cover bg-center shadow-inner" style={{ backgroundImage: `url('${tone.src}')` }} />
                                    <p className="mt-2 font-semibold">{tone.name}</p>
                                    <p className="mt-1 text-xs text-white/45">{tone.note}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-5 text-xs text-white/35 lg:col-start-2 lg:text-right">Style preview only — final product is selected from currently available flooring lines and samples.</p>
                    </div>
                </div>
            </section>

            <section className="border-b border-white/10 bg-white/[0.02]">
                <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:items-center lg:py-20">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Moliora Flooring Designer</p>
                        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Preview flooring after you plan the project</h2>
                        <p className="mt-4 max-w-2xl leading-7 text-white/65">Use the flooring designer to explore the plank tone and room feel you like. Then we can help match that direction to available LVP products.</p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <a href="/flooring/design" className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">Open Flooring Designer</a>
                            <a href="#flooring-estimate" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold hover:border-[#d6ad63] hover:text-[#f0c978]">Quick Estimate Request</a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {['Choose a room look', 'Compare floor tones', 'Pick a direction', 'Request an exact quote'].map((item, index) => (
                            <div key={item} className="border border-white/10 bg-black/20 p-5"><span className="text-[#d6ad63]">0{index + 1}</span><p className="mt-2 font-semibold">{item}</p></div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">LVP Flooring Services</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">One project, clearly scoped</h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {capabilities.map(item => (
                        <article key={item.title} className="border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d6ad63]/40 hover:bg-white/[0.045]"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{item.text}</p></article>
                    ))}
                </div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Simple Process</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">How your LVP project works</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map(([number, title, text]) => <div key={number} className="border-t border-[#d6ad63]/60 pt-5"><span className="text-sm font-bold text-[#d6ad63]">{number}</span><h3 className="mt-2 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{text}</p></div>)}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Local LVP Installer</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Serving Ramsey, Anoka and nearby Twin Cities communities</h2>
                    <div className="mt-6 space-y-4 text-white/65">
                        <p>Moliora provides residential luxury vinyl plank installation in Ramsey, Anoka, Andover, Coon Rapids, Blaine, Champlin and nearby North Twin Cities areas.</p>
                        <p>Your estimate reflects the overall project scope, including the options that apply to your installation.</p>
                        <p>If hidden subfloor conditions are uncovered after removal, the affected work is reviewed before additional repairs are performed.</p>
                    </div>
                </div>
                <div className="border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                    <h3 className="text-2xl font-semibold">Already know what you need?</h3>
                    <p className="mt-3 leading-7 text-white/65">Skip the planner and send a quick estimate request with the approximate square footage and current flooring type.</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <a href="#flooring-estimate" className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">Quick Estimate Request</a>
                        <a href={flooringPhoneHref} className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold hover:border-[#d6ad63] hover:text-[#f0c978]">Call {flooringPhoneDisplay}</a>
                    </div>
                </div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:py-24">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">FAQ</p>
                    <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Common luxury vinyl plank questions</h2>
                    <div className="mt-8 divide-y divide-white/10 border-y border-white/10">{faqs.map(item => <details key={item.q} className="group py-5"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold marker:hidden">{item.q}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">{item.a}</p></details>)}</div>
                </div>
            </section>

            <section id="flooring-estimate" className="scroll-mt-24">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Quick LVP Estimate Request</p>
                            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Prefer the simple form?</h2>
                            <p className="mt-4 max-w-lg leading-7 text-white/65">No problem. Send the basics here if you do not want to use the project planner. Approximate information is enough to start.</p>
                            <a href={flooringPhoneHref} className="mt-5 inline-flex text-sm font-semibold text-[#f0c978] hover:underline">Prefer to call? {flooringPhoneDisplay}</a>
                        </div>
                        <LvpLeadForm />
                    </div>
                </div>
            </section>
        </main>
    );
}
