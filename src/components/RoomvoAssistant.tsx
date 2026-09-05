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
    const textTargets = Array.from(document.querySelectorAll<HTMLElement>('button, a, [role="button"]'))
        .filter(isVisible)
        .find(element => /browse all products|see our products(?: in your space)?/i.test(element.textContent ?? ''));

    if (textTargets) {
        textTargets.click();
        return;
    }

    const roomvoTargets = Array.from(
        document.querySelectorAll<HTMLElement>('[id*="roomvo" i], [class*="roomvo" i], [data-roomvo]')
    ).filter(element => element.id !== 'roomvoAssistant' && isVisible(element));

    const actionableRoomvoTarget = roomvoTargets.find(element =>
        element.matches('button, a, [role="button"]')
    ) ?? roomvoTargets.at(-1);

    if (actionableRoomvoTarget) {
        actionableRoomvoTarget.click();
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

export default function RoomvoAssistant() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== '/flooring/lvp') return;

        const cleanups: Array<() => void> = [];

        const activateButton = (element: HTMLElement, label: string) => {
            element.textContent = label;
            element.removeAttribute('aria-disabled');
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-label', 'Open Moliora Design Center');
            element.className = element.className
                .replace('cursor-not-allowed', 'cursor-pointer')
                .replace('text-white/65', 'text-white')
                .replace('text-white/45', 'text-white');

            const onClick = () => openRoomvo();
            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openRoomvo();
                }
            };

            element.addEventListener('click', onClick);
            element.addEventListener('keydown', onKeyDown);
            cleanups.push(() => {
                element.removeEventListener('click', onClick);
                element.removeEventListener('keydown', onKeyDown);
            });
        };

        const disabledSpans = Array.from(document.querySelectorAll<HTMLElement>('span[aria-disabled="true"]'));

        disabledSpans.forEach(element => {
            const text = element.textContent?.trim().toLowerCase() ?? '';
            if (text.includes('design center')) activateButton(element, 'Design Center →');
            else if (text === 'coming soon') activateButton(element, 'Open Design Center');
        });

        const headings = Array.from(document.querySelectorAll<HTMLElement>('h2'));
        const oldHeading = headings.find(element => element.textContent?.includes('A better flooring preview is in development'));
        if (oldHeading) oldHeading.textContent = 'See new flooring in your own room';

        const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('p'));
        const oldParagraph = paragraphs.find(element => element.textContent?.includes('We are building a room-based flooring visualizer'));
        if (oldParagraph) {
            oldParagraph.textContent = 'Upload a photo of your room, explore available flooring products, and preview how different styles can look in your space with our Roomvo-powered Design Center.';
        }

        return () => cleanups.forEach(cleanup => cleanup());
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
