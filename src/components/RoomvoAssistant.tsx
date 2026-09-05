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

        let restoreTimer: number | null = null;
        let armedFrame: HTMLIFrameElement | null = null;
        let originalStyle = '';

        const restoreFrame = () => {
            if (!armedFrame) return;
            armedFrame.setAttribute('style', originalStyle);
            armedFrame = null;
            originalStyle = '';
            if (restoreTimer !== null) window.clearTimeout(restoreTimer);
            restoreTimer = null;
        };

        const armNativeRoomvoLauncher = (target: HTMLElement) => {
            restoreFrame();

            const frame = findRoomvoLauncherFrame();
            if (!frame) return false;

            const rect = target.getBoundingClientRect();
            armedFrame = frame;
            originalStyle = frame.getAttribute('style') ?? '';

            Object.assign(frame.style, {
                position: 'fixed',
                left: `${rect.left}px`,
                top: `${rect.top}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                minWidth: '0',
                minHeight: '0',
                maxWidth: 'none',
                maxHeight: 'none',
                margin: '0',
                border: '0',
                transform: 'none',
                opacity: '0.01',
                pointerEvents: 'auto',
                zIndex: '2147483647',
            });

            // The next physical click lands inside Roomvo's own iframe, so Roomvo
            // receives a real user gesture and opens its normal on-site overlay.
            restoreTimer = window.setTimeout(restoreFrame, 1800);
            return true;
        };

        const onPointerEnter = (event: PointerEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target || event.pointerType === 'touch') return;
            armNativeRoomvoLauncher(target);
        };

        const onFocusIn = (event: FocusEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            armNativeRoomvoLauncher(target);
        };

        const onClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;

            // If the native iframe was not armed (for example on touch), keep the
            // shopper on Moliora and point them to Roomvo's already-working widget.
            event.preventDefault();
            window.alert('Tap the Roomvo “See our products in your space” button in the lower-right corner to open the Design Center.');
        };

        document.addEventListener('pointerover', onPointerEnter);
        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('click', onClick);

        return () => {
            observer.disconnect();
            window.clearInterval(interval);
            window.clearTimeout(timeout);
            restoreFrame();
            document.removeEventListener('pointerover', onPointerEnter);
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('click', onClick);
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
