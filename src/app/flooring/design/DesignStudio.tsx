'use client';

import { PointerEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { flooringProducts } from '../catalog/catalogData';

const rooms = ['Bedroom', 'Living Room', 'Basement'] as const;
const directions = ['Toward the window', 'Across the window'] as const;
type PreviewMode = 'template' | 'photo';
type Point = { x: number; y: number };

type PerspectiveFloorProps = {
    mask: Point[];
    tone: string;
    direction: (typeof directions)[number];
    textureAssets: { src: string; label?: string }[];
};

const DEFAULT_MASK: Point[] = [
    { x: 16, y: 58 },
    { x: 84, y: 58 },
    { x: 98, y: 96 },
    { x: 2, y: 96 },
];

const toneColors: Record<string, { base: string; line: string; light: string }> = {
    Light: { base: '#c9b38f', line: '#7f6a4c', light: '#eadbbf' },
    Natural: { base: '#a98963', line: '#604b34', light: '#d3b88f' },
    Warm: { base: '#946542', line: '#50321f', light: '#c49368' },
    Dark: { base: '#51443b', line: '#251f1b', light: '#806e60' },
};

function mix(a: Point, b: Point, t: number): Point {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function quadPoint(points: Point[], u: number, v: number): Point {
    const top = mix(points[0], points[1], u);
    const bottom = mix(points[3], points[2], u);
    return mix(top, bottom, v);
}

function pts(points: Point[]) {
    return points.map(point => `${point.x},${point.y}`).join(' ');
}

function seeded(seed: number) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}

function shade(hex: string, amount: number) {
    const value = Number.parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (value >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((value >> 8) & 255) + amount));
    const b = Math.max(0, Math.min(255, (value & 255) + amount));
    return `rgb(${r}, ${g}, ${b})`;
}

function PerspectiveFloor({ mask, tone, direction, textureAssets }: PerspectiveFloorProps) {
    const id = useId().replace(/:/g, '');
    const c = toneColors[tone] ?? toneColors.Natural;
    const hasTexture = textureAssets.length > 0;
    const planks: { points: Point[]; textureIndex: number; shadeAmount: number }[] = [];

    if (direction === 'Toward the window') {
        const laneCount = 8;
        const plankLength = 0.29;

        for (let lane = 0; lane < laneCount; lane += 1) {
            const u0 = lane / laneCount;
            const u1 = (lane + 1) / laneCount;
            const offset = -(0.04 + seeded(lane * 37 + 9) * plankLength);
            let segment = 0;

            for (let start = offset; start < 1; start += plankLength) {
                const raw0 = Math.max(0, start);
                const raw1 = Math.min(1, start + plankLength);
                if (raw1 <= 0 || raw0 >= 1) continue;
                const v0 = raw0 * raw0;
                const v1 = raw1 * raw1;
                const seed = lane * 101 + segment * 29;
                planks.push({
                    points: [
                        quadPoint(mask, u0, v0),
                        quadPoint(mask, u1, v0),
                        quadPoint(mask, u1, v1),
                        quadPoint(mask, u0, v1),
                    ],
                    textureIndex: textureAssets.length ? Math.floor(seeded(seed) * textureAssets.length) : 0,
                    shadeAmount: Math.round((seeded(seed + 17) - 0.5) * 18),
                });
                segment += 1;
            }
        }
    } else {
        const courseCount = 10;
        const plankLength = 0.31;

        for (let course = 0; course < courseCount; course += 1) {
            const rawV0 = course / courseCount;
            const rawV1 = (course + 1) / courseCount;
            const v0 = rawV0 * rawV0;
            const v1 = rawV1 * rawV1;
            const offset = -(0.05 + seeded(course * 41 + 5) * plankLength);
            let segment = 0;

            for (let start = offset; start < 1; start += plankLength) {
                const u0 = Math.max(0, start);
                const u1 = Math.min(1, start + plankLength);
                if (u1 <= 0 || u0 >= 1) continue;
                const seed = course * 103 + segment * 31;
                planks.push({
                    points: [
                        quadPoint(mask, u0, v0),
                        quadPoint(mask, u1, v0),
                        quadPoint(mask, u1, v1),
                        quadPoint(mask, u0, v1),
                    ],
                    textureIndex: textureAssets.length ? Math.floor(seeded(seed) * textureAssets.length) : 0,
                    shadeAmount: Math.round((seeded(seed + 19) - 0.5) * 18),
                });
                segment += 1;
            }
        }
    }

    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
        >
            <defs>
                <clipPath id={`${id}-mask`}>
                    <polygon points={pts(mask)} />
                </clipPath>
                {textureAssets.map((asset, index) => (
                    <pattern
                        key={`${asset.src}-${index}`}
                        id={`${id}-texture-${index}`}
                        width="1"
                        height="1"
                        patternUnits="objectBoundingBox"
                    >
                        <image
                            href={asset.src}
                            x="0"
                            y="0"
                            width="1"
                            height="1"
                            preserveAspectRatio="xMidYMid slice"
                        />
                    </pattern>
                ))}
            </defs>

            <g clipPath={`url(#${id}-mask)`}>
                {planks.map((plank, index) => (
                    <g key={index}>
                        <polygon
                            points={pts(plank.points)}
                            fill={
                                hasTexture
                                    ? `url(#${id}-texture-${plank.textureIndex})`
                                    : shade(c.base, plank.shadeAmount)
                            }
                            fillOpacity={hasTexture ? 0.9 : 0.88}
                            stroke={c.line}
                            strokeOpacity=".58"
                            strokeWidth=".18"
                        />
                        {!hasTexture && index % 2 === 0 ? (
                            <line
                                x1={mix(plank.points[0], plank.points[3], 0.48).x}
                                y1={mix(plank.points[0], plank.points[3], 0.48).y}
                                x2={mix(plank.points[1], plank.points[2], 0.52).x}
                                y2={mix(plank.points[1], plank.points[2], 0.52).y}
                                stroke={c.light}
                                strokeOpacity=".13"
                                strokeWidth=".12"
                            />
                        ) : null}
                    </g>
                ))}
                <polygon points={pts(mask)} fill="rgba(20,15,10,.08)" />
            </g>

            <polygon
                points={pts(mask)}
                fill="none"
                stroke="#d6ad63"
                strokeOpacity=".85"
                strokeWidth=".35"
            />
        </svg>
    );
}

function RoomFurniture({ room }: { room: (typeof rooms)[number] }) {
    if (room === 'Bedroom') {
        return (
            <>
                <div className="absolute bottom-[27%] left-[18%] h-[19%] w-[44%] rounded-t-md border border-white/15 bg-white/10" />
                <div className="absolute bottom-[25%] left-[15%] h-[4%] w-[50%] bg-white/15" />
            </>
        );
    }
    if (room === 'Living Room') {
        return (
            <>
                <div className="absolute bottom-[25%] left-[12%] h-[15%] w-[48%] rounded-md border border-white/15 bg-white/10" />
                <div className="absolute bottom-[25%] right-[14%] h-[8%] w-[16%] border border-white/15 bg-white/5" />
            </>
        );
    }
    return (
        <>
            <div className="absolute bottom-[24%] left-[15%] h-[10%] w-[32%] border border-white/15 bg-white/8" />
            <div className="absolute bottom-[24%] right-[16%] h-[15%] w-[24%] border border-white/15 bg-white/8" />
        </>
    );
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

    useEffect(() => {
        const requested = new URLSearchParams(window.location.search).get('floor');
        if (requested && flooringProducts.some(item => item.id === requested)) setProductId(requested);
    }, []);

    useEffect(
        () => () => {
            if (photoUrl) URL.revokeObjectURL(photoUrl);
        },
        [photoUrl],
    );

    const product = useMemo(
        () => flooringProducts.find(item => item.id === productId) ?? flooringProducts[0],
        [productId],
    );

    const textureAssets = product?.textureAssets ?? [];
    const templateMask: Point[] = [
        { x: 7, y: 57 },
        { x: 93, y: 57 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
    ];

    function choosePhoto(file?: File) {
        if (!file || !file.type.startsWith('image/')) return;
        if (photoUrl) URL.revokeObjectURL(photoUrl);
        setPhotoUrl(URL.createObjectURL(file));
        setPhotoName(file.name);
        setMask(DEFAULT_MASK);
        setMode('photo');
    }

    function movePoint(index: number, event: PointerEvent<HTMLButtonElement | HTMLDivElement>) {
        const rect = previewRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
        setMask(points => points.map((point, i) => (i === index ? { x, y } : point)));
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
            <div className="space-y-6 border border-white/10 bg-white/[.025] p-6">
                <div>
                    <p className="text-sm font-semibold">Preview source</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setMode('template')} className={`min-h-11 border px-3 text-sm ${mode === 'template' ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>
                            Room template
                        </button>
                        <button type="button" onClick={() => inputRef.current?.click()} className={`min-h-11 border px-3 text-sm ${mode === 'photo' ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>
                            Upload your room
                        </button>
                    </div>
                    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => choosePhoto(e.target.files?.[0])} />
                    <p className="mt-2 text-xs leading-5 text-white/40">Photo stays in your browser; it is not uploaded to Moliora.</p>
                </div>

                {mode === 'template' ? (
                    <fieldset>
                        <legend className="text-sm font-semibold">1. Room template</legend>
                        <div className="mt-3 grid gap-2">
                            {rooms.map(item => (
                                <button type="button" key={item} onClick={() => setRoom(item)} className={`min-h-11 border px-4 text-left ${room === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </fieldset>
                ) : (
                    <div className="border border-white/10 p-4">
                        <p className="text-sm font-semibold">Your room photo</p>
                        <p className="mt-1 truncate text-xs text-white/45">{photoName || 'Choose a room image'}</p>
                        <p className="mt-3 text-xs leading-5 text-[#d6ad63]">Drag the 4 numbered points to match the visible floor and perspective.</p>
                        <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => inputRef.current?.click()} className="min-h-10 border border-white/15 px-3 text-xs font-semibold">Change photo</button>
                            <button type="button" onClick={() => setMask(DEFAULT_MASK)} className="min-h-10 border border-white/15 px-3 text-xs font-semibold">Reset floor area</button>
                        </div>
                    </div>
                )}

                <fieldset>
                    <legend className="text-sm font-semibold">{mode === 'template' ? '2' : '1'}. Flooring</legend>
                    <select value={productId} onChange={e => setProductId(e.target.value)} className="mt-3 min-h-12 w-full border border-white/15 bg-[#151717] px-3 text-sm text-white outline-none focus:border-[#d6ad63]">
                        {flooringProducts.map(item => <option key={item.id} value={item.id}>{item.brand} — {item.name}</option>)}
                    </select>
                    {product ? <p className="mt-2 text-xs leading-5 text-white/45">{product.collection} • {product.wearLayer} • model {product.model}</p> : null}
                    <div className={`mt-3 border px-3 py-2 text-xs ${textureAssets.length ? 'border-emerald-400/30 text-emerald-200' : 'border-white/10 text-white/45'}`}>
                        {textureAssets.length
                            ? `${textureAssets.length} approved product texture${textureAssets.length === 1 ? '' : 's'} active.`
                            : 'Product texture pending — using Moliora tonal preview.'}
                    </div>
                </fieldset>

                <fieldset>
                    <legend className="text-sm font-semibold">{mode === 'template' ? '3' : '2'}. Plank direction</legend>
                    <div className="mt-3 grid gap-2">
                        {directions.map(item => (
                            <button type="button" key={item} onClick={() => setDirection(item)} className={`min-h-11 border px-4 text-left text-sm ${direction === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>
                                {item}
                            </button>
                        ))}
                    </div>
                </fieldset>
                <p className="text-xs leading-5 text-white/40">Visualization is approximate. Final color and pattern should be approved from a physical sample.</p>
            </div>

            <div className="flex min-h-[500px] flex-col border border-white/10 bg-white/[.02] p-4 sm:p-6">
                <div ref={previewRef} onPointerMove={e => { if (dragging !== null) movePoint(dragging, e); }} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)} className="relative min-h-[390px] flex-1 touch-none overflow-hidden border border-white/10 bg-[#d8d4cd]">
                    {mode === 'photo' && photoUrl ? (
                        <>
                            <img src={photoUrl} alt="Your room preview" draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" />
                            <PerspectiveFloor mask={mask} tone={product?.tone ?? 'Natural'} direction={direction} textureAssets={textureAssets} />
                            {mask.map((point, index) => (
                                <button key={index} type="button" aria-label={`Floor corner ${index + 1}`} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(index); movePoint(index, e); }} onPointerMove={e => { if (dragging === index) movePoint(index, e); }} onPointerUp={() => setDragging(null)} className="absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border-2 border-black/70 bg-[#d6ad63] text-xs font-black text-black shadow-lg" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
                                    {index + 1}
                                </button>
                            ))}
                            <div className="pointer-events-none absolute left-3 top-3 bg-black/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-white/80">Perspective • staggered LVP • {textureAssets.length ? 'product texture' : 'tone preview'}</div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(#dad7d0,#c6c2bb)]" />
                            <div className="absolute left-1/2 top-[9%] h-[30%] w-[28%] -translate-x-1/2 border-[7px] border-white/75 bg-[linear-gradient(#9db5c3,#dce7eb)] shadow-lg" />
                            <PerspectiveFloor mask={templateMask} tone={product?.tone ?? 'Natural'} direction={direction} textureAssets={textureAssets} />
                            <RoomFurniture room={room} />
                        </>
                    )}
                </div>

                <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d6ad63]">Current preview</p>
                    <h2 className="mt-1 text-xl font-semibold">{mode === 'photo' ? 'Your room' : room} • {product?.name}</h2>
                    <p className="mt-1 text-sm text-white/50">{product?.brand} • {product?.tone} tone • {direction} • {textureAssets.length ? 'approved product texture' : 'tonal preview'}</p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <a href="/flooring/catalog" className="flex min-h-12 items-center justify-center border border-white/15 text-sm font-semibold">Browse Catalog</a>
                    <a href={`/flooring/lvp?floor=${encodeURIComponent(product?.id ?? '')}#flooring-estimate`} className="flex min-h-12 items-center justify-center bg-[#d6ad63] px-4 text-center text-sm font-bold uppercase tracking-wider text-black">Estimate This Floor</a>
                </div>
            </div>
        </div>
    );
}
