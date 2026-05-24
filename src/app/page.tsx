import Footer from '@/components/Footer';

const services = [
    { title: 'Window Installation', icon: '▦' },
    { title: 'Door Installation', icon: '▯' },
    { title: 'Deck Repair & Build', icon: '▱' },
    { title: 'Remodeling', icon: '⌂' },
    { title: 'Exterior Services', icon: '◇' },
    { title: 'Handyman Services', icon: '⚒' },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0f1111] text-white">
            <main className="pt-20">
                <section className="relative min-h-[78vh] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/hero-construction.jpeg')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

                    <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-6 py-20">
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#d6ad63]">
                            Moliora Construction
                        </p>

                        <h1 className="max-w-4xl text-5xl font-semibold uppercase leading-tight tracking-[0.08em] sm:text-6xl md:text-7xl">
                            Building Quality.
                            <br />
                            Delivering Trust.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                            Windows, doors, remodeling and exterior services in
                            Minnesota.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center bg-[#d6ad63] px-7 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978]"
                            >
                                Get Free Estimate
                            </a>

                            <a
                                href="#projects"
                                className="inline-flex items-center justify-center border border-[#d6ad63]/70 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                            >
                                View Our Work
                            </a>
                        </div>

                        <div className="mt-14 grid max-w-3xl grid-cols-2 gap-5 text-xs font-semibold uppercase tracking-wider text-white/80 sm:grid-cols-4">
                            <div>Licensed & Insured</div>
                            <div>Quality Craftsmanship</div>
                            <div>Local Minnesota</div>
                            <div>Reliable & On Time</div>
                        </div>
                    </div>
                </section>

                <section className="bg-[#f4f1eb] px-6 py-16 text-[#151515]">
                    <div className="mx-auto max-w-7xl">
                        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#a67c35]">
                            Our Services
                        </p>

                        <h2 className="mt-3 text-center text-3xl font-semibold">
                            Quality Construction Services
                        </h2>

                        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                            {services.map(service => (
                                <div
                                    key={service.title}
                                    className="border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#d6ad63] text-2xl text-[#d6ad63]">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wide">
                                        {service.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-black/60">
                                        Professional work, clean finish and
                                        reliable communication.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid bg-[#101212] text-white lg:grid-cols-2">
                    <div className="px-6 py-20 lg:px-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">
                            Why Choose Moliora
                        </p>

                        <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
                            Experience. Precision. Results.
                        </h2>

                        <p className="mt-6 max-w-xl leading-8 text-white/70">
                            With a background in precision engineering and
                            international construction, we bring a
                            detail-oriented approach to every project — big or
                            small.
                        </p>

                        <div className="mt-10 grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="font-bold text-[#d6ad63]">
                                    Precision Craftsmanship
                                </h3>
                                <p className="mt-2 text-sm text-white/60">
                                    Attention to every detail.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#d6ad63]">
                                    Clear Communication
                                </h3>
                                <p className="mt-2 text-sm text-white/60">
                                    Honest updates and clean process.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#d6ad63]">
                                    Modern Solutions
                                </h3>
                                <p className="mt-2 text-sm text-white/60">
                                    Smart methods and quality materials.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-[#d6ad63]">
                                    Customer Satisfaction
                                </h3>
                                <p className="mt-2 text-sm text-white/60">
                                    Your home. Our reputation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-[420px] bg-[url('/interior-construction.jpeg')] bg-cover bg-center" />
                </section>

                <section className="bg-[#0f1111] px-6 py-20 text-white">
                    <div className="mx-auto grid max-w-7xl gap-10 border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[1.35fr_0.65fr] md:p-12">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                                UseWeDo Platform
                            </p>

                            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight">
                                Need More Control Over Your Home Services?
                            </h2>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                                UseWeDo is a simple platform for requesting,
                                organizing and managing different types of home
                                service work — from contractor projects to
                                cleaning, appliance repairs, handyman tasks and
                                more.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
                                {[
                                    'Contractor Work',
                                    'Cleaning',
                                    'Appliance Repair',
                                    'Handyman Tasks',
                                    'Furniture Assembly',
                                    'Painting',
                                    'Deck Repair',
                                    'Doors & Windows',
                                    'Moving Help',
                                    'Yard Work',
                                ].map(item => (
                                    <span
                                        key={item}
                                        className="border border-white/10 bg-black/30 px-4 py-2"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="https://usewedo.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center bg-[#d6ad63] px-7 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978]"
                                >
                                    Open UseWeDo
                                </a>

                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center border border-[#d6ad63]/70 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                                >
                                    Contact Moliora
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center border border-white/10 bg-black/30 p-6 text-center">
                            <div className="flex h-40 w-40 items-center justify-center bg-white ">
                                <img
                                    src="/usewedo-qr.png"
                                    alt="UseWeDo QR Code"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <p className="mt-4 text-sm text-white/60">
                                Scan to open UseWeDo
                            </p>
                        </div>
                    </div>
                </section>

                <section
                    id="projects"
                    className="bg-[#f4f1eb] px-6 py-16 text-[#151515]"
                >
                    <div className="mx-auto max-w-7xl">
                        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#a67c35]">
                            Recent Projects
                        </p>

                        <h2 className="mt-3 text-center text-3xl font-semibold">
                            Transforming Homes
                        </h2>

                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {[
                                {
                                    title: 'Deck Restoration',
                                    image: '/project-1.jpeg',
                                },
                                {
                                    title: 'Window Installation',
                                    image: '/project-2.jpeg',
                                },
                                {
                                    title: 'Door Installation',
                                    image: '/project-3.jpeg',
                                },
                                {
                                    title: 'High-end exterior remodeling',
                                    image: '/project-4.jpeg',
                                },
                            ].map(project => (
                                <div key={project.title} className="group">
                                    <div className="h-72 overflow-hidden shadow-lg">
                                        <div
                                            className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105"
                                            style={{
                                                backgroundImage: `url(${project.image})`,
                                            }}
                                        />
                                    </div>

                                    <h3 className="mt-5 text-xl font-semibold">
                                        {project.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-black/60">
                                        Minneapolis–St. Paul, MN
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-[#101212] px-6 py-16 text-white">
                    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">
                                Ready to start?
                            </p>

                            <h2 className="mt-4 text-4xl font-semibold">
                                Get Your Free Estimate
                            </h2>

                            <p className="mt-5 max-w-xl text-white/70">
                                Tell us about your project and we’ll get back to
                                you with a free, no-obligation estimate.
                            </p>
                        </div>

                        <div className="flex items-center lg:justify-end">
                            <a
                                href="/contact"
                                className="bg-[#d6ad63] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978]"
                            >
                                Contact Moliora
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
