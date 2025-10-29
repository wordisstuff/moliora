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
            <div className="relative">
                <Link
                    href="/"
                    className="relative flex flex-col items-center justify-center group"
                >
                    {/* Верхнє лого */}
                    <img
                        src="/logo.PNG"
                        alt="Logo"
                        className="
                            absolute top-[-18px] left-1 w-14
                            filter hue-rotate-[0deg] dark:hue-rotate-[90deg] brightness-110 dark:brightness-105
                            drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]
                            dark:drop-shadow-[0_4px_8px_rgba(255,255,255,0.15)]
                            transition-all duration-500 ease-out
                            group-hover:drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]
                            group-hover:dark:drop-shadow-[0_6px_12px_rgba(255,255,255,0.25)]"
                    />

                    {/* Текст */}
                    <p
                        className="
        relative z-10 flex items-center justify-center
        font-serif font-extrabold tracking-wide
        text-neutral-800 dark:text-neutral-100
        transition-colors duration-300
        group-hover:text-bluegren
    "
                    >
                        mOliora
                    </p>

                    {/* Дзеркальне лого знизу */}
                    <img
                        src="/logo.PNG"
                        alt="Logo reflection"
                        className="
                            filter hue-rotate-[0deg] dark:hue-rotate-[90deg] brightness-110 dark:brightness-105
                            drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]
                            dark:drop-shadow-[0_2px_3px_rgba(255,255,255,0.15)]
                            transition-all duration-500 ease-out
                            group-hover:opacity-80 group-hover:blur-0
                            absolute scale-y-[-1] top-5 left-1 w-14 h-2 opacity-60 blur-[1px]
    "
                    />
                </Link>
            </div>

            <div className="flex-col items-center justify-center sm:flex">
                {/* <img src="logoLeters.png" alt="" className="w-50" /> */}
                <h1 className="flex items-center justify-center text-4xl font-serif font-extrabold">
                    mOliora
                </h1>
                <h2 className="flex items-center justify-center text-sm">
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
                        className="absolute right-0 mt-2 w-48 dark:bg-gray-600 z-50 border border-neutral-200/50 dark:border-neutral-800/60 rounded-md overflow-hidden backdrop-blur-sm"
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
