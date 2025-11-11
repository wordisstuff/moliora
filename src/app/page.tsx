import Footer from '@/components/Footer';

export default function Home() {
    return (
        <div className="container mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen  pb-8 gap-0 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main
                id="top"
                className=" flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start"
            >
                <section className="relative py-10 text-center bg-gradient-to-b from-[var(--background)] to-white/60 dark:to-black/30">
                    <div id="top" className="mx-auto max-w-4xl px-6">
                        <h1 className="font-serif text-5xl md:text-6xl text-[var(--foreground)]">
                            Your{' '}
                            <span className="text-[color:var(--foreground)]/80 italic">
                                Home Service
                            </span>{' '}
                            Partner
                        </h1>
                        <p className="mt-4 text-[var(--foreground)]/80 max-w-2xl mx-auto text-lg">
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
                <img
                    src="hero.png"
                    alt=""
                    className="container flex items-center justify-between p-4 bg-babyblue dark:ocean relative shadow-md text-neutral-600 dark:text-neutral-100 rounded gap-4"
                />
            </main>
            <footer className="row-start-4 flex gap-[24px] flex-wrap items-center justify-center">
                <Footer />
            </footer>
        </div>
    );
}
