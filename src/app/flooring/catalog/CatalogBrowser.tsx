'use client';

import { useMemo, useState } from 'react';
import { flooringProducts } from './catalogData';

const tones = ['All', 'Light', 'Natural', 'Warm', 'Dark'] as const;

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
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <article key={product.id} className="flex min-h-72 flex-col border border-white/10 bg-white/[0.025] p-6">
                        <div className="flex h-24 items-center justify-center border border-dashed border-white/15 bg-black/20 text-center text-xs uppercase tracking-[.2em] text-white/35">
                            Authorized product image<br />coming after supplier approval
                        </div>
                        <p className="mt-5 text-xs font-bold uppercase tracking-[.24em] text-[#d6ad63]">{product.brand} • {product.collection}</p>
                        <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/55">
                            <span className="border border-white/10 px-2 py-1">{product.tone}</span>
                            <span className="border border-white/10 px-2 py-1">{product.construction}</span>
                            {product.waterproof && <span className="border border-white/10 px-2 py-1">Waterproof</span>}
                        </div>
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
