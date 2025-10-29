'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium border transition cursor-pointer"
            style={{
                // кольори беремо з твоїх CSS-змінних
                color: 'var(--foreground)',
                borderColor: 'var(--foreground)',
                backgroundColor: 'transparent',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'color-mix(in srgb, var(--foreground) 8%, transparent)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'transparent';
            }}
        >
            Go Back {/* Назад */}
        </button>
    );
}
