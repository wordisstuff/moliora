'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

function isVisible(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
}

function openRoomvo() {
    const textTarget = Array.from(document.querySelectorAll<HTMLElement>('button, a, [role="button"], div, span'))
        .filter(isVisible)
        .find(element => /browse all products|see our products(?: in your space)?/i.test(element.textContent?.trim() ?? ''));

    if (textTarget) {
        textTarget.click();
        return;
    }

    const roomvoTargets = Array.from(
        document.querySelectorAll<HTMLElement>('[id*="roomvo" i], [class*="roomvo" i], [data-roomvo]')
    ).filter(element => element.id !== 'roomvoAssistant' && isVisible(element));

    const actionable = roomvoTargets.find(element => element.matches('button, a, [role="button"]')) ?? roomvoTargets.at(-1);
    if (actionable) {
        actionable.click();
        return;
    }

    const roomvoFrame = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe'))
        .find(frame => /roomvo/i.test(frame.src) && isVisible(frame));

    if (roomvoFrame) {
        roomvoFrame.focus();
        roomvoFrame.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return;
    }

    window.alert('The Design Center is loading. Please use the Roomvo button in the lower-right corner.');
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

        const onClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            event.preventDefault();
            openRoomvo();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-moliora-roomvo-launcher="true"]');
            if (!target) return;
            event.preventDefault();
            openRoomvo();
        };

        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            observer.disconnect();
            window.clearInterval(interval);
            window.clearTimeout(timeout);
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
