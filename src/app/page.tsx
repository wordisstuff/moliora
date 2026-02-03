import Footer from '@/components/Footer';
import ServicesCarouselModal from '@/components/SCM/SCM';

export default function Home() {
    return (
        <div className="min-h-screen w-full pb-8">
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-8">
                {/* HERO */}
                <section className="relative py-10 text-center bg-gradient-to-b from-[var(--background)] to-white/60 dark:to-black/30 rounded-2xl">
                    <div className="mx-auto max-w-4xl px-2 sm:px-6">
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)]">
                            Your{' '}
                            <span className="text-[color:var(--foreground)]/80 italic">
                                Home Service
                            </span>{' '}
                            Partner
                        </h1>

                        <p className="mt-4 text-[var(--foreground)]/80 max-w-2xl mx-auto text-base sm:text-lg">
                            From remodeling to finishing touches — we bring
                            quality and care to every home.
                        </p>

                        <a
                            href="/contact"
                            className="mt-8 inline-block bg-[color:var(--foreground)] text-[color:var(--background)] px-8 py-3 rounded-md hover:opacity-90 transition font-medium"
                        >
                            Contact Us
                        </a>
                    </div>
                </section>

                {/* SERVICES */}
                <ServicesCarouselModal />

                {/* IMAGE / BANNER */}
                <img
                    src="/hero.png"
                    alt=""
                    className="w-full max-w-6xl rounded-2xl shadow-md"
                />
            </main>

            <footer className="mx-auto mt-10 flex w-full max-w-6xl flex-wrap items-center justify-center gap-6 px-4 sm:px-8">
                <Footer />
            </footer>
        </div>
    );
}
