'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function RoomvoAssistant() {
    const pathname = usePathname();

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
