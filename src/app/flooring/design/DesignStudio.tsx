'use client';

import { useMemo, useState } from 'react';
import { flooringProducts } from '../catalog/catalogData';

const rooms = ['Bedroom', 'Living Room', 'Basement'] as const;
const directions = ['Toward the window', 'Across the window'] as const;

const toneBackground: Record<string, string> = {
    Light: 'linear-gradient(135deg,#d8c7aa,#b99d74)',
    Natural: 'linear-gradient(135deg,#b79a72,#8e704d)',
    Warm: 'linear-gradient(135deg,#a87951,#704b30)',
    Dark: 'linear-gradient(135deg,#655448,#332b27)',
};

function RoomFurniture({ room }: { room: (typeof rooms)[number] }) {
    if (room === 'Bedroom') {
        return <><div className="absolute bottom-[27%] left-[18%] h-[19%] w-[44%] rounded-t-md border border-white/15 bg-white/10" /><div className="absolute bottom-[25%] left-[15%] h-[4%] w-[50%] bg-white/15" /></>;
    }
    if (room === 'Living Room') {
        return <><div className="absolute bottom-[25%] left-[12%] h-[15%] w-[48%] rounded-md border border-white/15 bg-white/10" /><div className="absolute bottom-[25%] right-[14%] h-[8%] w-[16%] border border-white/15 bg-white/5" /></>;
    }
    return <><div className="absolute bottom-[24%] left-[15%] h-[10%] w-[32%] border border-white/15 bg-white/8" /><div className="absolute bottom-[24%] right-[16%] h-[15%] w-[24%] border border-white/15 bg-white/8" /></>;
}

export default function DesignStudio() {
    const [room, setRoom] = useState<(typeof rooms)[number]>('Bedroom');
    const [productId, setProductId] = useState(flooringProducts[0]?.id ?? '');
    const [direction, setDirection] = useState<(typeof directions)[number]>('Toward the window');

    const product = useMemo(() => flooringProducts.find(item => item.id === productId) ?? flooringProducts[0], [productId]);
    const floorBackground = toneBackground[product?.tone ?? 'Natural'];
    const plankPattern = direction === 'Toward the window'
        ? 'repeating-linear-gradient(90deg,transparent 0 62px,rgba(0,0,0,.22) 63px,transparent 64px),repeating-linear-gradient(0deg,transparent 0 13px,rgba(255,255,255,.16) 14px,transparent 15px)'
        : 'repeating-linear-gradient(0deg,transparent 0 55px,rgba(0,0,0,.22) 56px,transparent 57px),repeating-linear-gradient(90deg,transparent 0 14px,rgba(255,255,255,.16) 15px,transparent 16px)';

    return (
        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
            <div className="space-y-6 border border-white/10 bg-white/[.025] p-6">
                <fieldset>
                    <legend className="text-sm font-semibold">1. Room template</legend>
                    <div className="mt-3 grid gap-2">{rooms.map(item => <button type="button" key={item} onClick={() => setRoom(item)} className={`min-h-11 border px-4 text-left ${room === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div>
                </fieldset>
                <fieldset>
                    <legend className="text-sm font-semibold">2. Flooring</legend>
                    <select value={productId} onChange={event => setProductId(event.target.value)} className="mt-3 min-h-12 w-full border border-white/15 bg-[#151717] px-3 text-sm text-white outline-none focus:border-[#d6ad63]">
                        {flooringProducts.map(item => <option key={item.id} value={item.id}>{item.brand} — {item.name}</option>)}
                    </select>
                    {product && <p className="mt-2 text-xs leading-5 text-white/45">{product.collection} • {product.wearLayer} • model {product.model}</p>}
                </fieldset>
                <fieldset>
                    <legend className="text-sm font-semibold">3. Plank direction</legend>
                    <div className="mt-3 grid gap-2">{directions.map(item => <button type="button" key={item} onClick={() => setDirection(item)} className={`min-h-11 border px-4 text-left text-sm ${direction === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div>
                </fieldset>
                <p className="text-xs leading-5 text-white/40">This is a layout/tone visualization, not an exact color match. Final material should be approved from a physical sample.</p>
            </div>

            <div className="flex min-h-[500px] flex-col border border-white/10 bg-white/[.02] p-4 sm:p-6">
                <div className="relative min-h-[390px] flex-1 overflow-hidden border border-white/10 bg-[#d8d4cd]">
                    <div className="absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(#dad7d0,#c6c2bb)]" />
                    <div className="absolute left-1/2 top-[9%] h-[30%] w-[28%] -translate-x-1/2 border-[7px] border-white/75 bg-[linear-gradient(#9db5c3,#dce7eb)] shadow-lg">
                        <div className="absolute left-1/2 top-0 h-full w-px bg-white/60" /><div className="absolute left-0 top-1/2 h-px w-full bg-white/60" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-[43%] origin-bottom [clip-path:polygon(7%_0,93%_0,100%_100%,0_100%)]" style={{ background: floorBackground }}>
                        <div className="absolute inset-0 opacity-55" style={{ backgroundImage: plankPattern }} />
                    </div>
                    <RoomFurniture room={room} />
                    <div className="absolute left-3 top-3 bg-black/55 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white/75">Moliora room template</div>
                </div>
                <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#d6ad63]">Current preview</p><h2 className="mt-1 text-xl font-semibold">{room} • {product?.name}</h2><p className="mt-1 text-sm text-white/50">{product?.brand} • {product?.tone} tone • {direction}</p></div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2"><a href="/flooring/catalog" className="flex min-h-12 items-center justify-center border border-white/15 text-sm font-semibold">Browse Catalog</a><a href={`/flooring/lvp?floor=${encodeURIComponent(product?.id ?? '')}#flooring-estimate`} className="flex min-h-12 items-center justify-center bg-[#d6ad63] px-4 text-center text-sm font-bold uppercase tracking-wider text-black">Estimate This Floor</a></div>
            </div>
        </div>
    );
}
