'use client';

import { useState } from 'react';

const rooms = ['Bedroom', 'Living Room', 'Basement'] as const;
const directions = ['Toward the window', 'Across the window'] as const;
const tones = ['Light oak', 'Natural oak', 'Warm wood', 'Dark wood'] as const;

export default function DesignStudio() {
    const [room, setRoom] = useState<(typeof rooms)[number]>('Bedroom');
    const [tone, setTone] = useState<(typeof tones)[number]>('Natural oak');
    const [direction, setDirection] = useState<(typeof directions)[number]>('Toward the window');

    return (
        <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
            <div className="space-y-6 border border-white/10 bg-white/[.025] p-6">
                <fieldset><legend className="text-sm font-semibold">1. Room</legend><div className="mt-3 grid gap-2">{rooms.map(item => <button type="button" key={item} onClick={() => setRoom(item)} className={`min-h-11 border px-4 text-left ${room === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div></fieldset>
                <fieldset><legend className="text-sm font-semibold">2. Floor tone</legend><div className="mt-3 grid grid-cols-2 gap-2">{tones.map(item => <button type="button" key={item} onClick={() => setTone(item)} className={`min-h-11 border px-3 text-sm ${tone === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div></fieldset>
                <fieldset><legend className="text-sm font-semibold">3. Plank direction</legend><div className="mt-3 grid gap-2">{directions.map(item => <button type="button" key={item} onClick={() => setDirection(item)} className={`min-h-11 border px-4 text-left text-sm ${direction === item ? 'border-[#d6ad63] text-[#f0c978]' : 'border-white/10 text-white/65'}`}>{item}</button>)}</div></fieldset>
            </div>
            <div className="flex min-h-[420px] flex-col border border-white/10 bg-[linear-gradient(145deg,rgba(214,173,99,.08),rgba(255,255,255,.02))] p-6 sm:p-8">
                <div className="flex flex-1 items-center justify-center border border-dashed border-white/15 text-center">
                    <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#d6ad63]">Preview foundation</p><h2 className="mt-3 text-2xl font-semibold">{room}</h2><p className="mt-2 text-white/55">{tone} • {direction}</p><p className="mx-auto mt-6 max-w-md text-sm leading-6 text-white/40">The controls and selection state are ready. A licensed room image/rendering layer can be connected here next, followed later by customer photo upload and AI visualization.</p></div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2"><a href="/flooring/catalog" className="flex min-h-12 items-center justify-center border border-white/15 text-sm font-semibold">Browse Flooring</a><a href="/flooring/lvp#flooring-estimate" className="flex min-h-12 items-center justify-center bg-[#d6ad63] text-sm font-bold uppercase tracking-wider text-black">Request Estimate</a></div>
            </div>
        </div>
    );
}
