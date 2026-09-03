import type { Metadata } from 'next';
import CatalogBrowser from './CatalogBrowser';

export const metadata: Metadata = {
    title: 'LVP Flooring Catalog | Moliora',
    description: 'Browse LVP flooring styles and color directions for your Moliora flooring project in the North Twin Cities.',
    alternates: { canonical: 'https://moliora.us/flooring/catalog' },
};

export default function FlooringCatalogPage() {
    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-20">
                <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Moliora Flooring</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold sm:text-5xl">Explore your flooring direction</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">Start with a color family and product direction. Exact colors, availability and project pricing are confirmed before ordering. Manufacturer-authorized product imagery will be added as supplier access is approved.</p>
                <div className="mt-10"><CatalogBrowser /></div>
            </section>
            <section className="border-t border-white/10 bg-white/[.02]">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
                    <h2 className="text-2xl font-semibold">Already have flooring?</h2>
                    <p className="mt-3 max-w-2xl text-white/60">Moliora can also quote installation for compatible LVP you already purchased. Send the product information with your estimate request.</p>
                    <a href="/flooring/lvp#flooring-estimate" className="mt-6 inline-flex min-h-12 items-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black">Request an Estimate</a>
                </div>
            </section>
        </main>
    );
}
