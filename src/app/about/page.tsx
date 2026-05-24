export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/about-hero.jpeg')] bg-cover bg-center opacity-35" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

                <div className="relative mx-auto max-w-7xl px-6 py-24">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                        About Moliora
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl">
                        Modern Construction.
                        <br />
                        Traditional Work Ethic.
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
                        Moliora Construction is focused on windows, doors,
                        remodeling, exterior services and reliable home
                        improvement work across Minnesota.
                    </p>
                </div>
            </section>

            <section className="bg-[#f4f1eb] px-6 py-20 text-[#151515]">
                <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a67c35]">
                            Our Story
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold leading-tight">
                            Built on Precision, Responsibility and Real
                            Experience.
                        </h2>

                        <p className="mt-8 text-lg leading-8 text-black/70">
                            Moliora Construction was created with a simple idea:
                            home improvement should be clean, organized and
                            trustworthy from the first conversation to the final
                            detail.
                        </p>

                        <p className="mt-6 text-lg leading-8 text-black/70">
                            Our work is shaped by hands-on construction
                            experience, technical thinking and respect for the
                            customer’s home. Whether it is a window, door, deck,
                            exterior repair or remodeling project, the goal is
                            the same — do the job correctly and communicate
                            clearly.
                        </p>
                    </div>

                    <div className="grid gap-5">
                        <div className="border border-black/10 bg-white p-7 shadow-sm">
                            <h3 className="text-xl font-bold">
                                Precision Craftsmanship
                            </h3>
                            <p className="mt-4 leading-7 text-black/65">
                                Careful measuring, clean installation and
                                attention to details that affect the final
                                result.
                            </p>
                        </div>

                        <div className="border border-black/10 bg-white p-7 shadow-sm">
                            <h3 className="text-xl font-bold">
                                Reliable Communication
                            </h3>
                            <p className="mt-4 leading-7 text-black/65">
                                Clear expectations, honest updates and a
                                professional approach to scheduling.
                            </p>
                        </div>

                        <div className="border border-black/10 bg-white p-7 shadow-sm">
                            <h3 className="text-xl font-bold">
                                Quality-Focused Work
                            </h3>
                            <p className="mt-4 leading-7 text-black/65">
                                We focus on work that looks good, functions
                                properly and holds up over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid bg-[#101212] lg:grid-cols-2">
                <div className="min-h-[420px] bg-[url('/interior-construction.jpeg')] bg-cover bg-center" />

                <div className="px-6 py-20 lg:px-16">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">
                        How We Work
                    </p>

                    <h2 className="mt-4 text-4xl font-semibold leading-tight">
                        Clean Process.
                        <br />
                        Better Results.
                    </h2>

                    <div className="mt-10 grid gap-6">
                        <div className="border-l border-[#d6ad63] pl-6">
                            <h3 className="font-bold text-[#d6ad63]">
                                01. Consultation
                            </h3>
                            <p className="mt-2 text-white/65">
                                We listen to your project needs, review the
                                details and discuss possible solutions.
                            </p>
                        </div>

                        <div className="border-l border-[#d6ad63] pl-6">
                            <h3 className="font-bold text-[#d6ad63]">
                                02. Estimate
                            </h3>
                            <p className="mt-2 text-white/65">
                                We provide a clear estimate based on the scope,
                                materials and expected work.
                            </p>
                        </div>

                        <div className="border-l border-[#d6ad63] pl-6">
                            <h3 className="font-bold text-[#d6ad63]">
                                03. Build & Deliver
                            </h3>
                            <p className="mt-2 text-white/65">
                                We complete the work with attention to quality,
                                cleanliness and communication.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f4f1eb] px-6 py-20 text-[#151515]">
                <div className="mx-auto max-w-7xl">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#a67c35]">
                        What We Focus On
                    </p>

                    <h2 className="mt-4 text-center text-4xl font-semibold">
                        Services Built Around Your Home
                    </h2>

                    <div className="mt-12 grid gap-5 md:grid-cols-4">
                        {[
                            'Windows',
                            'Doors',
                            'Decks',
                            'Exterior Repairs',
                            'Remodeling',
                            'Trim & Finish Work',
                            'Small Projects',
                            'Future General Contracting',
                        ].map(item => (
                            <div
                                key={item}
                                className="border border-black/10 bg-white p-6 text-center font-semibold shadow-sm"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#101212] px-6 py-20">
                <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
                    <div className="border border-white/10 p-8">
                        <div className="text-4xl font-semibold text-[#d6ad63]">
                            Local
                        </div>
                        <p className="mt-4 text-white/65">
                            Serving Minneapolis–St. Paul and surrounding areas.
                        </p>
                    </div>

                    <div className="border border-white/10 p-8">
                        <div className="text-4xl font-semibold text-[#d6ad63]">
                            Reliable
                        </div>
                        <p className="mt-4 text-white/65">
                            Clear communication and dependable scheduling.
                        </p>
                    </div>

                    <div className="border border-white/10 p-8">
                        <div className="text-4xl font-semibold text-[#d6ad63]">
                            Detail-Oriented
                        </div>
                        <p className="mt-4 text-white/65">
                            Built with attention to structure, finish and long
                            term quality.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#0f1111] px-6 py-20 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                    Ready to start?
                </p>

                <h2 className="mt-4 text-4xl font-semibold">
                    Let’s Talk About Your Project
                </h2>

                <a
                    href="/contact"
                    className="mt-8 inline-flex bg-[#d6ad63] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978]"
                >
                    Get Free Estimate
                </a>
            </section>
        </main>
    );
}
