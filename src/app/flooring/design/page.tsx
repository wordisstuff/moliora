import type { Metadata } from 'next';
import DesignStudio from './DesignStudio';

export const metadata: Metadata = {
    title: 'Flooring Design Center | Moliora',
    description: 'Preview LVP flooring in room templates or your own room photo, compare floor tones and plank direction, and request a Moliora flooring estimate.',
    alternates: { canonical: 'https://moliora.us/flooring/design' },
};

export default function FlooringDesignPage() {
    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-20">
                <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Moliora Design Center • Beta</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold sm:text-5xl">See the layout before the floor goes down</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">Use a Moliora room template or choose a photo from your phone, select a catalog floor and switch the plank direction. Your photo stays in your browser in this beta and is not sent to Moliora.</p>
                <div className="mt-10"><DesignStudio /></div>
            </section>
            <section className="border-t border-white/10">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
                    <h2 className="text-2xl font-semibold">Where the visualizer goes next</h2>
                    <p className="mt-3 max-w-3xl leading-7 text-white/60">The browser-only photo preview establishes the upload workflow. The next technical phase is automatic floor-area detection/masking, perspective-aware plank placement and, later, AI-assisted rendering. Final color and appearance should still be confirmed from a physical manufacturer sample before material is ordered.</p>
                </div>
            </section>
        </main>
    );
}
