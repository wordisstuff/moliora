'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

function isVisible(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
}

function findRoomvoLauncherFrame() {
    const frames = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe'))
        .filter(frame => /roomvo/i.test(frame.src || '') && isVisible(frame));

    if (!frames.length) return null;

    return frames
        .map(frame => {
            const rect = frame.getBoundingClientRect();
            return { frame, area: rect.width * rect.height };
        })
        .sort((a, b) => a.area - b.area)[0]?.frame ?? null;
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

    useEffect(() => {
        if (pathname !== '/flooring/lvp') return;

        const runActivation = () => activateDesignCenterUi();
        runActivation();

        const observer = new MutationObserver(runActivation);
        observer.observe(document.body, { childList: true, subtree: true });

        const interval = window.setInterval(runActivation, 500);
        const timeout = window.setTimeout(() => window.clearInterval(interval), 10000);
        let highlightTimer: number | null = null;

        const highlightNativeRoomvo = () => {
            const frame = findRoomvoLauncherFrame();
            if (!frame) return false;

            const oldTransition = frame.style.transition;
            const oldTransform = frame.style.transform;
            const oldFilter = frame.style.filter;

            frame.style.transition = 'transform 180ms ease, filter 180ms ease';
            frame.style.transform = `${oldTransform || ''} scale(1.08)`.trim();
            frame.style.filter = 'drop-shadow(0 0 14px rgba(240, 201, 120, 0.95))';

            if (highlightTimer !== null) window.clearTimeout(highlightTimer);
            highlightTimer = window.setTimeout(() => {
                frame.style.transition = oldTransition;
                frame.style.transform = oldTransform;
                frame.style.filter = oldFilter;
                highlightTimer = null;
            }, 2200);

            return true;
        };

        const launch = (target: HTMLElement) => {
            const found = highlightNativeRoomvo();
            const original = target.textContent;
            target.textContent = found ? 'Open Roomvo ↘' : 'Roomvo is loading…';
            window.setTimeout(() => {
                target.textContent = original || 'Design Center →';
            }, 2200);
        };

        const onClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            event.preventDefault();
            launch(target);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            event.preventDefault();
            launch(target);
        };

        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            observer.disconnect();
            window.clearInterval(interval);
            window.clearTimeout(timeout);
            if (highlightTimer !== null) window.clearTimeout(highlightTimer);
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [pathname]);

    if (pathname !== '/flooring/lvp') return null;

    return (
        <Script
            id="roomvoAssistant"
            src="https://www.roomvo.com/static/scripts/b2b/common/assistant.js"
            strategy="afterInteractive"
            data-locale="en-us"
            data-position="bottom-right"
        />
    );
}
