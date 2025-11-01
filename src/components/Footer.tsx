import Link from 'next/link';
import ContactInfo from '@/components/ContactInfo';

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-[color:var(--foreground)]/15 bg-[var(--background)] text-[var(--foreground)]">
            <div className="mx-auto w-full max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-4">
                {/* Brand */}
                <div className="space-y-3">
                    <div className="text-2xl font-serif leading-none">
                        <span className="font-semibold">m</span>
                        <span className="font-extrabold">O</span>
                        liora
                    </div>
                    <p className="text-sm opacity-80">
                        Your Home Service Partner. Reliable renovations, honest
                        work, and trusted craftsmanship.
                    </p>
                    {/* Socials */}
                    <div className="flex gap-3 pt-1">
                        <a
                            aria-label="Instagram"
                            href="#"
                            className="p-2 rounded-md border border-[color:var(--foreground)]/20 hover:opacity-80 transition"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="size-4"
                                fill="currentColor"
                            >
                                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7Zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
                            </svg>
                        </a>
                        <a
                            aria-label="Facebook"
                            href="#"
                            className="p-2 rounded-md border border-[color:var(--foreground)]/20 hover:opacity-80 transition"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="size-4"
                                fill="currentColor"
                            >
                                <path d="M13 22v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4Z" />
                            </svg>
                        </a>
                        <a
                            aria-label="X / Twitter"
                            href="#"
                            className="p-2 rounded-md border border-[color:var(--foreground)]/20 hover:opacity-80 transition"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="size-4"
                                fill="currentColor"
                            >
                                <path d="M3 3h3l6 8 6-8h3l-7.5 10L21 21h-3l-6-8-6 8H3l7.5-10L3 3Z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Quick links */}
                <div>
                    <h4 className="font-serif text-lg mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                className="hover:underline underline-offset-2"
                                href="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <a
                                className="hover:underline underline-offset-2"
                                href="/services"
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                className="hover:underline underline-offset-2"
                                href="/gallery"
                            >
                                Gallery
                            </a>
                        </li>
                        <li>
                            <a
                                className="hover:underline underline-offset-2"
                                href="/about"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                className="hover:underline underline-offset-2"
                                href="/contact"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-serif text-lg mb-3">Contact</h4>
                    <ContactInfo />
                    <ul className="space-y-2 text-sm">
                        <li>
                            <span className="opacity-70">
                                Licensed &amp; Insured
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Hours */}
                <div>
                    <h4 className="font-serif text-lg mb-3">Hours</h4>
                    <ul className="space-y-1 text-sm">
                        <li>Mon–Fri: 8:00–18:00</li>
                        <li>Sat: 9:00–14:00</li>
                        <li>Sun: by appointment</li>
                    </ul>
                    {/* Back to top */}
                    <a
                        href="#top"
                        className="inline-block mt-4 text-sm underline underline-offset-2 hover:opacity-80"
                    >
                        Back to top ↑
                    </a>
                </div>
            </div>

            {/* Bottom strip */}
            <div className="border-t border-[color:var(--foreground)]/15">
                <div className="mx-auto w-full max-w-6xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs opacity-80">
                    <p>
                        © {new Date().getFullYear()} mOliora Home Services •
                        Minneapolis–St. Paul, MN
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="/terms"
                            className="hover:underline underline-offset-2"
                        >
                            Terms
                        </a>
                        <a
                            href="/privacy"
                            className="hover:underline underline-offset-2"
                        >
                            Privacy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
