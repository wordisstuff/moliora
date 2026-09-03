'use client';

import { useMemo, useState } from 'react';
import { flooringProducts } from './catalogData';

const tones = ['All', 'Light', 'Natural', 'Warm', 'Dark'] as const;

const toneBackground: Record<string, string> = {
    Light: 'linear-gradient(135deg,#d8c7aa,#b99d74)',
    Natural: 'linear-gradient(135deg,#b79a72,#8e704d)',
    Warm: 'linear-gradient(135deg,#a87951,#704b30)',
    Dark: 'linear-gradient(135deg,#655448,#332b27)',
};

export default function CatalogBrowser() {
    const [tone, setTone] = useState<(typeof tones)[number]>('All');
    const products = useMemo(() => tone === 'All' ? flooringProducts : flooringProducts.filter(item => item.tone === tone), [tone]);

    return (
        <div>
            <div className="flex flex-wrap gap-2" aria-label="Filter flooring by color tone">
                {tones.map(item => (
                    <button key={item} type="button" onClick={() => setTone(item)} className={`min-h-11 border px-4 text-sm font-semibold ${tone === item ? 'border-[#d6ad63] bg-[#d6ad63] text-black' : 'border-white/15 text-white/75'}`}>
                        {item}
                    </button>
                ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-white/45">Color blocks are neutral tone previews, not manufacturer photography. Confirm final color from a physical sample before ordering.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <article key={product.id} className="flex min-h-[390px] flex-col border border-white/10 bg-white/[0.025] p-6">
                        <div className="relative h-28 overflow-hidden border border-white/10" style={{ background: toneBackground[product.tone] }}>
                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent 0 15px,rgba(255,255,255,.22) 16px,transparent 17px),repeating-linear-gradient(90deg,transparent 0 85px,rgba(0,0,0,.2) 86px,transparent 87px)' }} />
                            <div className="absolute bottom-2 left-2 bg-black/55 px-2 py-1 text-[10px] uppercase tracking-[.18em] text-white/75">Tone preview only</div>
                        </div>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-[#d6ad63]">{product.brand} • {product.collection}</p>
                        <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
                        <p className="mt-1 font-mono text-xs text-white/40">Model {product.model}</p>
                        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/60">
                            <span>Wear layer</span><strong className="text-right font-medium text-white/80">{product.wearLayer}</strong>
                            <span>Plank</span><strong className="text-right font-medium text-white/80">{product.plankSize}</strong>
                            <span>Type</span><strong className="text-right font-medium text-white/80">{product.construction}</strong>
                            <span>Waterproof</span><strong className="text-right font-medium text-white/80">{product.waterproof ? 'Yes' : 'Check specs'}</strong>
                        </div>
                        <a href={product.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 text-xs text-white/45 underline decoration-white/20 underline-offset-4 hover:text-white/70">Verify on {product.sourceLabel}</a>
                        <div className="mt-auto flex gap-2 pt-6">
                            <a href={`/flooring/lvp?floor=${encodeURIComponent(product.id)}#flooring-estimate`} className="flex min-h-11 flex-1 items-center justify-center bg-[#d6ad63] px-3 text-center text-xs font-bold uppercase tracking-wider text-black">Request Estimate</a>
                            <a href={`/flooring/design?floor=${encodeURIComponent(product.id)}`} className="flex min-h-11 flex-1 items-center justify-center border border-white/15 px-3 text-center text-xs font-bold uppercase tracking-wider text-white">Visualize</a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
