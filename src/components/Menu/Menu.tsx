'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Menu() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* LOGO */}
                <Link href="/" className="group">
                    <div className="flex flex-col">
                        <span className="text-3xl font-semibold tracking-[0.35em] text-white">
                            MOLIORA
                        </span>

                        <span className="mt-1 text-[10px] uppercase tracking-[0.5em] text-[#d6ad63]">
                            Construction
                        </span>
                    </div>
                </Link>

                {/* DESKTOP */}
                <nav className="hidden items-center gap-10 md:flex">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-[#d6ad63]"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <a
                        href="/contact"
                        className="bg-[#d6ad63] px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0c978]"
                    >
                        Free Estimate
                    </a>
                </nav>

                {/* MOBILE BUTTON */}
                <button
                    onClick={() => setOpen(v => !v)}
                    className="flex flex-col gap-1 md:hidden"
                    aria-label="Menu"
                >
                    <span className="h-[2px] w-6 bg-white" />
                    <span className="h-[2px] w-6 bg-white" />
                    <span className="h-[2px] w-6 bg-white" />
                </button>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="border-t border-white/10 bg-[#111111] md:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col px-6 py-6">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="border-b border-white/5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <a
                            href="/contact"
                            className="mt-5 bg-[#d6ad63] px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-black"
                        >
                            Free Estimate
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
