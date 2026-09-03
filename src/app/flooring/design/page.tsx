import type { Metadata } from 'next';
import DesignStudio from './DesignStudio';

export const metadata: Metadata = {
    title: 'Flooring Design Center | Moliora',
    description: 'Explore room, flooring tone and plank direction options before requesting your Moliora LVP flooring estimate.',
    alternates: { canonical: 'https://moliora.us/flooring/design' },
};

export default function FlooringDesignPage() {
    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-20">
                <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Moliora Design Center • Beta</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold sm:text-5xl">Plan the look before the floor goes down</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">Choose a room type, general floor tone and plank direction. This first version establishes the design workflow without using unlicensed manufacturer or stock photography.</p>
                <div className="mt-10"><DesignStudio /></div>
            </section>
            <section className="border-t border-white/10"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-6"><h2 className="text-2xl font-semibold">Next: visualize your own room</h2><p className="mt-3 max-w-3xl leading-7 text-white/60">The next visualizer phase can add room templates first, then customer photo upload, floor masking and AI-assisted previews. Final flooring color and appearance will always need to be confirmed from a physical manufacturer sample.</p></div></section>
        </main>
    );
}
