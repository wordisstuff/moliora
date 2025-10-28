'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeToggleButton from '../themeToggleButton/themeToggleButton';

const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { i18n, t } = useTranslation();

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
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="container flex items-center justify-between p-4 relative shadow-md text-neutral-600 dark:text-neutral-100 rounded gap-4">
            <div>
                <Link href="/">
                    <img src="logoHouse.png" alt="" className="w-8" />
                    <img src="logoLeters.png" alt="" className="w-10" />
                </Link>
            </div>
            <div className="flex-col items-center justify-center">
                <img src="logoLeters.png" alt="" className="w-50" />
                <h2 className="flex items-center justify-center">
                    HOME SERVICES
                </h2>
            </div>
            {/* <select
                className="cursor-pointer appearance-none ml-4 px-2 py-1 border-separate rounded bg-babyblue hover:bg-bluegren hover:dark:bg-babyblue dark:bg-ocean text-sm"
                value={i18n.language}
                onChange={e => i18n.changeLanguage(e.target.value)}
            >
                <option value="us">🇺🇸</option>
                <option value="ua">🇺🇦</option>
            </select> */}
            {/* <ThemeToggleButton /> */}
            <div className="relative">
                <button
                    ref={buttonRef}
                    className="flex flex-col justify-center items-center w-10 h-10 p-2 space-y-1 z-10"
                    onClick={() => setMenuOpen(!menuOpen)}
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
                        className="absolute right-0 mt-2 w-48 shadow-md bg-#f5e8d9 dark:bg-gray-900  rounded shadow-lg z-50"
                    >
                        <Link
                            href="/about"
                            className="block px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900 text uppercase"
                        >
                            services
                        </Link>
                        <Link
                            href="/settings"
                            className="block px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900 uppercase"
                        >
                            about
                        </Link>
                        <Link
                            href="/contact"
                            className="block px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900 uppercase"
                        >
                            contacts
                        </Link>
                    </div>
                    // <div
                    //     ref={menuRef}
                    //     className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border rounded shadow-lg z-50"
                    // >
                    //     <Link
                    //         href="/about"
                    //         className="block px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900"
                    //     >
                    //         {t('header.about')}
                    //     </Link>
                    //     <Link
                    //         href="/settings"
                    //         className="block px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900"
                    //     >
                    //         {t('header.projects')}
                    //     </Link>
                    //     <Link
                    //         href="/logout"
                    //         className="block px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 hover:dark:text-gray-900"
                    //     >
                    //         {t('header.contacts')}
                    //     </Link>
                    // </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
