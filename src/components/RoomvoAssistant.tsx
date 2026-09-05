'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

function isVisible(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
}

function findRoomvoFrameUrl() {
    const frames = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe'))
        .filter(frame => /roomvo/i.test(frame.src || ''));

    if (!frames.length) return null;

    const ranked = frames
        .map(frame => {
            const rect = frame.getBoundingClientRect();
            return { frame, area: rect.width * rect.height };
        })
        .sort((a, b) => b.area - a.area);

    return ranked[0]?.frame.src || frames[0]?.src || null;
}

function activateDesignCenterUi() {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('span, button, a'));

    for (const element of elements) {
        const text = element.textContent?.trim().toLowerCase() ?? '';

        if (text === 'design center — coming soon' || text === 'design center - coming soon') {
            element.textContent = 'Design Center →';
            element.removeAttribute('aria-disabled');
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('data-moliora-roomvo-launcher', 'true');
            element.className = element.className
                .replace('cursor-not-allowed', 'cursor-pointer')
                .replace('text-white/65', 'text-white');
        }

        if (text === 'coming soon') {
            element.textContent = 'Open Design Center';
            element.removeAttribute('aria-disabled');
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('data-moliora-roomvo-launcher', 'true');
            element.className = element.className
                .replace('cursor-not-allowed', 'cursor-pointer')
                .replace('text-white/45', 'text-white');
        }
    }

    const heroEstimate = document.querySelector<HTMLElement>('main a[href="#flooring-estimate"]');
    if (heroEstimate) {
        heroEstimate.className = heroEstimate.className
            .replace('min-h-13', 'min-h-16')
            .replace('px-6', 'px-9')
            .replace('text-sm', 'text-base');
        heroEstimate.classList.add('sm:px-10', 'sm:text-lg');
    }

    const heading = Array.from(document.querySelectorAll<HTMLElement>('h2'))
        .find(element => element.textContent?.includes('A better flooring preview is in development'));
    if (heading) heading.textContent = 'See new flooring in your own room';

    const paragraph = Array.from(document.querySelectorAll<HTMLElement>('p'))
        .find(element => element.textContent?.includes('We are building a room-based flooring visualizer'));
    if (paragraph) {
        paragraph.textContent = 'Upload a photo of your room, explore available flooring products, and preview how different styles can look in your space with our Roomvo-powered Design Center.';
    }
}

export default function RoomvoAssistant() {
    const pathname = usePathname();
    const [roomvoUrl, setRoomvoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (pathname !== '/flooring/lvp') return;

        const runActivation = () => activateDesignCenterUi();
        runActivation();

        const observer = new MutationObserver(runActivation);
        observer.observe(document.body, { childList: true, subtree: true });

        const interval = window.setInterval(runActivation, 500);
        const timeout = window.setTimeout(() => window.clearInterval(interval), 10000);

        const openDesignCenter = () => {
            const url = findRoomvoFrameUrl();
            if (url) {
                setRoomvoUrl(url);
                document.documentElement.style.overflow = 'hidden';
                return;
            }

            window.alert('The Design Center is still loading. Please use the Roomvo button in the lower-right corner for now.');
        };

        const onClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            event.preventDefault();
            openDesignCenter();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            event.preventDefault();
            openDesignCenter();
        };

        const onCustomLaunch = () => openDesignCenter();

        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('moliora:open-roomvo', onCustomLaunch as EventListener);

        return () => {
            observer.disconnect();
            window.clearInterval(interval);
            window.clearTimeout(timeout);
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('moliora:open-roomvo', onCustomLaunch as EventListener);
            document.documentElement.style.overflow = '';
        };
    }, [pathname]);

    const closeDesignCenter = () => {
        setRoomvoUrl(null);
        document.documentElement.style.overflow = '';
    };

    if (pathname !== '/flooring/lvp') return null;

    return (
        <>
            <Script
                id="roomvoAssistant"
                src="https://www.roomvo.com/static/scripts/b2b/common/assistant.js"
                strategy="afterInteractive"
                data-locale="en-us"
                data-position="bottom-right"
            />

            {roomvoUrl && (
                <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Moliora Design Center">
                    <div className="flex h-full w-full flex-col bg-[#0f1111] sm:p-3">
                        <div className="flex min-h-14 items-center justify-between border-b border-white/10 bg-[#0f1111] px-4 sm:rounded-t-xl sm:px-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d6ad63]">Moliora</p>
                                <p className="text-sm font-semibold text-white">Design Center</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeDesignCenter}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl text-white transition hover:border-[#d6ad63] hover:text-[#f0c978]"
                                aria-label="Close Design Center"
                            >
                                ×
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-hidden bg-white sm:rounded-b-xl">
                            <iframe
                                key={roomvoUrl}
                                src={roomvoUrl}
                                title="Roomvo flooring visualizer"
                                className="h-full w-full border-0"
                                allow="camera; fullscreen; clipboard-read; clipboard-write"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
