const services = [
    {
        title: 'Window Installation',
        text: 'Professional window installation focused on clean fit, energy efficiency and long-lasting exterior finish.',
    },
    {
        title: 'Door Installation',
        text: 'Entry doors, patio doors and replacement doors installed with attention to security, alignment and weather protection.',
    },
    {
        title: 'Deck Repair & Build',
        text: 'Deck repair, board replacement, railing work and outdoor structure improvements.',
    },
    {
        title: 'Remodeling',
        text: 'Interior and exterior remodeling services for homeowners who want clean, organized construction work.',
    },
    {
        title: 'Exterior Services',
        text: 'Siding, trim, fascia, soffit and exterior details that improve the look and protection of your home.',
    },
    {
        title: 'Handyman Services',
        text: 'Small repairs, finish work and home improvement tasks completed with professional care.',
    },
];

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/hero-construction.jpeg')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

                <div className="relative mx-auto max-w-7xl px-6 py-24">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                        Our Services
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl">
                        Construction Services Built Around Your Home.
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
                        Windows, doors, decks, remodeling and exterior services
                        for homeowners across Minnesota.
                    </p>
                </div>
            </section>

            <section className="bg-[#f4f1eb] px-6 py-20 text-[#151515]">
                <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map(service => (
                        <div
                            key={service.title}
                            className="border border-black/10 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="mb-6 h-12 w-12 border border-[#d6ad63]" />

                            <h2 className="text-2xl font-semibold">
                                {service.title}
                            </h2>

                            <p className="mt-5 leading-7 text-black/65">
                                {service.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[#101212] px-6 py-20">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                            Process
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold">
                            Simple, Clear and Professional.
                        </h2>
                    </div>

                    <div className="grid gap-6">
                        {[
                            'Tell us about your project',
                            'We review the scope and details',
                            'You receive a clear estimate',
                            'We complete the work with care',
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="border-l border-[#d6ad63] pl-6"
                            >
                                <h3 className="font-bold text-[#d6ad63]">
                                    0{index + 1}
                                </h3>
                                <p className="mt-2 text-white/70">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#0f1111] px-6 py-20 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                    Free estimate
                </p>

                <h2 className="mt-4 text-4xl font-semibold">
                    Have a project in mind?
                </h2>

                <a
                    href="/contact"
                    className="mt-8 inline-flex bg-[#d6ad63] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978]"
                >
                    Request Estimate
                </a>
            </section>
        </main>
    );
}
