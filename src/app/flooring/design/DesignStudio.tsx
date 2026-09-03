'use client';

import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { flooringProducts } from '../catalog/catalogData';

const rooms = ['Bedroom', 'Living Room', 'Basement'] as const;
const directions = ['Toward the window', 'Across the window'] as const;
type PreviewMode = 'template' | 'photo';
type Point = { x: number; y: number };
const DEFAULT_MASK: Point[] = [{ x: 16, y: 58 }, { x: 84, y: 58 }, { x: 98, y: 96 }, { x: 2, y: 96 }];

const toneBackground: Record<string, string> = { Light: 'linear-gradient(135deg,#d8c7aa,#b99d74)', Natural: 'linear-gradient(135deg,#b79a72,#8e704d)', Warm: 'linear-gradient(135deg,#a87951,#704b30)', Dark: 'linear-gradient(135deg,#655448,#332b27)' };

function RoomFurniture({ room }: { room: (typeof rooms)[number] }) {
    if (room === 'Bedroom') return <><div className="absolute bottom-[27%] left-[18%] h-[19%] w-[44%] rounded-t-md border border-white/15 bg-white/10" /><div className="absolute bottom-[25%] left-[15%] h-[4%] w-[50%] bg-white/15" /></>;
    if (room === 'Living Room') return <><div className="absolute bottom-[25%] left-[12%] h-[15%] w-[48%] rounded-md border border-white/15 bg-white/10" /><div className="absolute bottom-[25%] right-[14%] h-[8%] w-[16%] border border-white/15 bg-white/5" /></>;
    return <><div className="absolute bottom-[24%] left-[15%] h-[10%] w-[32%] border border-white/15 bg-white/8" /><div className="absolute bottom-[24%] right-[16%] h-[15%] w-[24%] border border-white/15 bg-white/8" /></>;
}

export default function DesignStudio() {
    const [room, setRoom] = useState<(typeof rooms)[number]>('Bedroom');
    const [productId, setProductId] = useState(flooringProducts[0]?.id ?? '');
    const [direction, setDirection] = useState<(typeof directions)[number]>('Toward the window');
    const [mode, setMode] = useState<PreviewMode>('template');
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoName, setPhotoName] = useState('');
    const [mask, setMask] = useState<Point[]>(DEFAULT_MASK);
    const [dragging, setDragging] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => { const requested = new URLSearchParams(window.location.search).get('floor'); if (requested && flooringProducts.some(item => item.id === requested)) setProductId(requested); }, []);
    useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl); }, [photoUrl]);

    const product = useMemo(() => flooringProducts.find(item => item.id === productId) ?? flooringProducts[0], [productId]);
    const floorBackground = toneBackground[product?.tone ?? 'Natural'];
    const plankPattern = direction === 'Toward the window'
        ? 'repeating-linear-gradient(90deg,transparent 0 62px,rgba(0,0,0,.22) 63px,transparent 64px),repeating-linear-gradient(0deg,transparent 0 13px,rgba(255,255,255,.16) 14px,transparent 15px)'
        : 'repeating-linear-gradient(0deg,transparent 0 55px,rgba(0,0,0,.22) 56px,transparent 57px),repeating-linear-gradient(90deg,transparent 0 14px,rgba(255,255,255,.16) 15px,transparent 16px)';
    const maskPolygon = `polygon(${mask.map(p => `${p.x}% ${p.y}%`).join(',')})`;

    function choosePhoto(file?: File) { if (!file || !file.type.startsWith('image/')) return; if (photoUrl) URL.revokeObjectURL(photoUrl); setPhotoUrl(URL.createObjectURL(file)); setPhotoName(file.name); setMask(DEFAULT_MASK); setMode('photo'); }
    function movePoint(index: number, event: PointerEvent<HTMLButtonElement | HTMLDivElement>) {
        const rect = previewRef.current?.getBoundingClientRect(); if (!rect) return;
        const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
        setMask(points => points.map((point, i) => i === index ? { x, y } : point));
    }

    return <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
        <div className="space-y-6 border border-white/10 bg-white/[.025] p-6">
            <div><p className="text-sm font-semibold">Preview source</p><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setMode('template')} className={`min-h-11 border px-3 text-sm ${mode === 'template' ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>Room template</button><button type="button" onClick={() => inputRef.current?.click()} className={`min-h-11 border px-3 text-sm ${mode === 'photo' ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>Upload your room</button></div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => choosePhoto(e.target.files?.[0])} /><p className="mt-2 text-xs leading-5 text-white/40">Photo stays in your browser; it is not uploaded to Moliora.</p></div>
            {mode === 'template' ? <fieldset><legend className="text-sm font-semibold">1. Room template</legend><div className="mt-3 grid gap-2">{rooms.map(item => <button type="button" key={item} onClick={() => setRoom(item)} className={`min-h-11 border px-4 text-left ${room === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div></fieldset> : <div className="border border-white/10 p-4"><p className="text-sm font-semibold">Your room photo</p><p className="mt-1 truncate text-xs text-white/45">{photoName || 'Choose a room image'}</p><p className="mt-3 text-xs leading-5 text-[#d6ad63]">Drag the 4 numbered points on the preview to outline the visible floor.</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => inputRef.current?.click()} className="min-h-10 border border-white/15 px-3 text-xs font-semibold">Change photo</button><button type="button" onClick={() => setMask(DEFAULT_MASK)} className="min-h-10 border border-white/15 px-3 text-xs font-semibold">Reset floor area</button></div></div>}
            <fieldset><legend className="text-sm font-semibold">{mode === 'template' ? '2' : '1'}. Flooring</legend><select value={productId} onChange={e => setProductId(e.target.value)} className="mt-3 min-h-12 w-full border border-white/15 bg-[#151717] px-3 text-sm text-white outline-none focus:border-[#d6ad63]">{flooringProducts.map(item => <option key={item.id} value={item.id}>{item.brand} — {item.name}</option>)}</select>{product && <p className="mt-2 text-xs leading-5 text-white/45">{product.collection} • {product.wearLayer} • model {product.model}</p>}</fieldset>
            <fieldset><legend className="text-sm font-semibold">{mode === 'template' ? '3' : '2'}. Plank direction</legend><div className="mt-3 grid gap-2">{directions.map(item => <button type="button" key={item} onClick={() => setDirection(item)} className={`min-h-11 border px-4 text-left text-sm ${direction === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div></fieldset>
            <p className="text-xs leading-5 text-white/40">Preview is conceptual. Final color should be approved from a physical sample.</p>
        </div>
        <div className="flex min-h-[500px] flex-col border border-white/10 bg-white/[.02] p-4 sm:p-6">
            <div ref={previewRef} onPointerMove={e => { if (dragging !== null) movePoint(dragging, e); }} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)} className="relative min-h-[390px] flex-1 touch-none overflow-hidden border border-white/10 bg-[#d8d4cd]">
                {mode === 'photo' && photoUrl ? <><img src={photoUrl} alt="Your room preview" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" /><div className="absolute inset-0 opacity-72" style={{ background: floorBackground, clipPath: maskPolygon }}><div className="absolute inset-0 opacity-65" style={{ backgroundImage: plankPattern }} /></div><div className="pointer-events-none absolute inset-0" style={{ clipPath: maskPolygon, boxShadow: 'inset 0 0 0 2px rgba(214,173,99,.9)' }} />{mask.map((point, index) => <button key={index} type="button" aria-label={`Floor corner ${index + 1}`} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(index); movePoint(index, e); }} onPointerMove={e => { if (dragging === index) movePoint(index, e); }} onPointerUp={() => setDragging(null)} className="absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border-2 border-black/70 bg-[#d6ad63] text-xs font-black text-black shadow-lg" style={{ left: `${point.x}%`, top: `${point.y}%` }}>{index + 1}</button>)}<div className="pointer-events-none absolute left-3 top-3 bg-black/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-white/80">Drag 1–4 to outline floor</div></> : <><div className="absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(#dad7d0,#c6c2bb)]" /><div className="absolute left-1/2 top-[9%] h-[30%] w-[28%] -translate-x-1/2 border-[7px] border-white/75 bg-[linear-gradient(#9db5c3,#dce7eb)] shadow-lg" /><div className="absolute inset-x-0 bottom-0 h-[43%] [clip-path:polygon(7%_0,93%_0,100%_100%,0_100%)]" style={{ background: floorBackground }}><div className="absolute inset-0 opacity-55" style={{ backgroundImage: plankPattern }} /></div><RoomFurniture room={room} /></>}
            </div>
            <div className="mt-4"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#d6ad63]">Current preview</p><h2 className="mt-1 text-xl font-semibold">{mode === 'photo' ? 'Your room' : room} • {product?.name}</h2><p className="mt-1 text-sm text-white/50">{product?.brand} • {product?.tone} tone • {direction}</p></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><a href="/flooring/catalog" className="flex min-h-12 items-center justify-center border border-white/15 text-sm font-semibold">Browse Catalog</a><a href={`/flooring/lvp?floor=${encodeURIComponent(product?.id ?? '')}#flooring-estimate`} className="flex min-h-12 items-center justify-center bg-[#d6ad63] px-4 text-center text-sm font-bold uppercase tracking-wider text-black">Estimate This Floor</a></div>
        </div>
    </div>;
}
