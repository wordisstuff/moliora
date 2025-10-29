'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
// import ThemeToggleButton from '../themeToggleButton/themeToggleButton';

const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    // const { i18n /*, t */ } = useTranslation();
    const pathname = usePathname();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const isActive = (href: string) => pathname === href;

    return (
        <div className="container flex items-center justify-between p-4 relative shadow-md text-neutral-600 dark:text-neutral-100 rounded gap-4">
            <div>
                <Link href="/" className="flex items-center gap-2">
                    <img src="logoHouse.png" alt="" className="w-8" />
                    <img src="logoLeters.png" alt="" className="w-10" />
                </Link>
            </div>

            <div className="flex-col items-center justify-center hidden sm:flex">
                <img src="logoLeters.png" alt="" className="w-50" />
                <h2 className="flex items-center justify-center">
                    HOME SERVICES
                </h2>
            </div>

            <div className="relative">
                <button
                    ref={buttonRef}
                    className="flex flex-col justify-center items-center w-10 h-10 p-2 space-y-1 z-10"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`w-6 h-0.5 bg-black dark:bg-gray-100 transform transition duration-300 ease-in-out ${
                            menuOpen ? 'rotate-45 translate-y-1.5' : ''
                        }`}
                    />
                    <span
                        className={`w-6 h-0.5 bg-black dark:bg-gray-400 transition-opacity duration-300 ease-in-out ${
                            menuOpen ? 'opacity-0' : ''
                        }`}
                    />
                    <span
                        className={`w-6 h-0.5 bg-black dark:bg-gray-200 transform transition duration-300 ease-in-out ${
                            menuOpen ? '-rotate-45 -translate-y-1.5' : ''
                        }`}
                    />
                </button>

                {menuOpen && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-48 dark:bg-gray-900 z-50 border border-neutral-200/50 dark:border-neutral-800/60 rounded-md overflow-hidden backdrop-blur-sm"
                    >
                        <Link
                            href="/about"
                            className={`block px-4 py-2 uppercase text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900 rounded shadow-sm
                            zap ${
                                isActive('/about')
                                    ? 'zap--active font-semibold'
                                    : ''
                            }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            about
                        </Link>

                        <Link
                            href="/contact"
                            className={`block px-4 py-2 uppercase text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900 rounded shadow-sm
                            zap ${
                                isActive('/contact')
                                    ? 'zap--active font-semibold'
                                    : ''
                            }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            contacts
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
