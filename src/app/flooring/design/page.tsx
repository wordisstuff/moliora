import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Flooring Design Center | Moliora',
    description: 'Moliora Flooring Design Center is being prepared with approved flooring imagery and improved room previews.',
    robots: { index: false, follow: false },
};

export default function FlooringDesignPage() {
    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="mx-auto flex min-h-[72vh] max-w-5xl items-center px-5 py-16 sm:px-6 lg:py-24">
                <div className="w-full border border-white/10 bg-white/[0.03] p-8 sm:p-12 lg:p-16">
                    <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Moliora Design Center</p>
                    <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Coming soon — with real approved flooring visuals</h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">We are finishing the room visualizer and connecting it to supplier-approved product imagery. We would rather launch it correctly than show placeholder flooring to customers.</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="/flooring/lvp#flooring-estimate" className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978]">Get a Flooring Estimate</a>
                        <a href="/flooring/lvp" className="inline-flex min-h-12 items-center justify-center border border-white/20 px-6 text-sm font-semibold hover:border-[#d6ad63] hover:text-[#f0c978]">Back to Flooring</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
