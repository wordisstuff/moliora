'use client';

import { useMemo, useState, useTransition } from 'react';

type ExistingFloor = 'none' | 'carpet' | 'floating' | 'hardwood' | 'tile';
type TrimOption = 'keep' | 'reinstall' | 'new' | 'shoe';
type MaterialOption = 'have' | 'value' | 'premium' | 'heavy';
type SubfloorOption = 'good' | 'minor' | 'unsure';

type Estimate = {
    sqft: number;
    perimeter: number;
    low: number;
    high: number;
};

const fieldClass = 'min-h-12 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#d6ad63] focus:ring-2 focus:ring-[#d6ad63]/25';
const optionClass = (active: boolean) => `rounded-xl border px-4 py-3 text-left transition ${active ? 'border-[#d6ad63] bg-[#d6ad63]/12 text-white' : 'border-white/10 bg-white/[0.025] text-white/65 hover:border-white/25'}`;

function money(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function round100(value: number) {
    return Math.max(0, Math.round(value / 100) * 100);
}

function WalletCalculatorIcon() {
    return (
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" aria-hidden="true">
            <path d="M8 18.5A6.5 6.5 0 0 1 14.5 12H42a6 6 0 0 1 6 6v3H16a8 8 0 0 0 0 16h32v7a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7V18.5Z" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16 21h34a6 6 0 0 1 6 6v10H16a8 8 0 0 1 0-16Z" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="45" cy="29" r="2" fill="currentColor" />
            <rect x="36" y="33" width="18" height="23" rx="3" fill="#0f1111" stroke="currentColor" strokeWidth="2.5" />
            <path d="M40 38h10M40 43h2M46 43h2M40 48h2M46 48h2M40 53h2M46 53h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export default function LvpProjectEstimator() {
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const [sizeMode, setSizeMode] = useState<'dimensions' | 'sqft'>('dimensions');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [sqftInput, setSqftInput] = useState('');
    const [location, setLocation] = useState('');
    const [existingFloor, setExistingFloor] = useState<ExistingFloor>('carpet');
    const [removeOld, setRemoveOld] = useState(true);
    const [trim, setTrim] = useState<TrimOption>('keep');
    const [doors, setDoors] = useState(1);
    const [stairs, setStairs] = useState(0);
    const [subfloor, setSubfloor] = useState<SubfloorOption>('unsure');
    const [material, setMaterial] = useState<MaterialOption>('have');

    const estimate = useMemo<Estimate | null>(() => {
        const l = Number(length);
        const w = Number(width);
        const directSqft = Number(sqftInput);
        const sqft = sizeMode === 'dimensions' ? l * w : directSqft;
        if (!Number.isFinite(sqft) || sqft <= 0) return null;

        const perimeter = sizeMode === 'dimensions' && l > 0 && w > 0
            ? 2 * (l + w)
            : 4.5 * Math.sqrt(sqft);

        let total = sqft * 3.25;

        if (removeOld) {
            const removalRate: Record<ExistingFloor, number> = {
                none: 0,
                carpet: 1,
                floating: 1.25,
                hardwood: 2.5,
                tile: 4,
            };
            total += sqft * removalRate[existingFloor];
            if (existingFloor === 'tile' || existingFloor === 'hardwood') total += 250;
        }

        const trimRate: Record<TrimOption, number> = {
            keep: 0,
            reinstall: 2,
            new: 4.75,
            shoe: 2.75,
        };
        total += perimeter * trimRate[trim];
        total += Math.max(0, doors) * 65;
        total += Math.max(0, stairs) * 150;

        if (subfloor === 'minor') total += sqft * 0.5;
        if (subfloor === 'unsure') total += sqft * 0.25;

        const materialRate: Record<MaterialOption, number> = {
            have: 0,
            value: 2.5,
            premium: 4,
            heavy: 6,
        };
        total += sqft * 1.1 * materialRate[material];

        total = Math.max(total, 700);
        const uncertainty = subfloor === 'unsure' ? 1.2 : 1.15;
        return {
            sqft: Math.round(sqft),
            perimeter: Math.round(perimeter),
            low: round100(total * 0.92),
            high: round100(total * uncertainty),
        };
    }, [doors, existingFloor, length, material, removeOld, sizeMode, sqftInput, stairs, subfloor, trim, width]);

    const existingFloorLabel: Record<ExistingFloor, string> = {
        none: 'Bare subfloor', carpet: 'Carpet', floating: 'LVP / laminate', hardwood: 'Hardwood', tile: 'Tile',
    };
    const trimLabel: Record<TrimOption, string> = {
        keep: 'Keep existing trim', reinstall: 'Remove & reinstall existing trim', new: 'Install new baseboards', shoe: 'Add shoe / quarter-round',
    };
    const materialLabel: Record<MaterialOption, string> = {
        have: 'Customer already has flooring', value: 'Value LVP', premium: 'Premium residential LVP', heavy: 'Heavy-duty / premium LVP',
    };
    const subfloorLabel: Record<SubfloorOption, string> = {
        good: 'Looks good', minor: 'Minor issues visible', unsure: 'Not sure',
    };

    async function submitQuote(form: HTMLFormElement) {
        if (!estimate || !location.trim()) {
            setError('Please complete the project details first.');
            return;
        }
        setError('');
        const data = new FormData(form);
        const dimensionText = sizeMode === 'dimensions' ? `${length} ft × ${width} ft` : `${estimate.sqft} sq ft`;
        const acceptedRange = `${money(estimate.low)}–${money(estimate.high)}`;
        const message = [
            'LVP PROJECT CALCULATOR — customer requested an exact quote',
            `Calculator estimate shown: ${acceptedRange}`,
            `Project size: ${dimensionText} (${estimate.sqft} sq ft)`,
            `Estimated wall perimeter used for trim: ${estimate.perimeter} linear ft`,
            `Existing flooring: ${existingFloorLabel[existingFloor]}`,
            `Old-floor removal selected: ${removeOld ? 'Yes' : 'No'}`,
            `Trim selection: ${trimLabel[trim]}`,
            `Doorways / estimated transitions: ${doors}`,
            `Stairs: ${stairs}`,
            `Subfloor condition: ${subfloorLabel[subfloor]}`,
            `Material selection: ${materialLabel[material]}`,
            'Estimator version: LVP-v1',
            'Note: online range is preliminary; final scope and price require measurements/site review.',
        ].join('\n');

        const payload = {
            name: String(data.get('name') || ''),
            phone: String(data.get('phone') || ''),
            email: String(data.get('email') || ''),
            location: location.trim(),
            service: 'LVP Flooring',
            approximateArea: `${estimate.sqft} sq ft`,
            existingFlooring: existingFloorLabel[existingFloor],
            demolition: removeOld ? 'Yes' : 'No',
            materialSupply: material === 'have' ? 'I already have flooring' : `Need Moliora to supply it — ${materialLabel[material]}`,
            message,
            consent: data.get('consent') === 'true',
            website: '',
            leadSource: 'LVP Project Calculator',
            landingPage: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/flooring/lvp',
        };

        startTransition(async () => {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const result = await response.json() as { success?: boolean; error?: string };
                if (!response.ok || !result.success) {
                    setError(result.error || 'We could not submit your request. Please try again.');
                    return;
                }
                setSubmitted(true);
                setShowContact(false);
            } catch {
                setError('Unexpected error. Please try again.');
            }
        });
    }

    if (submitted) {
        return (
            <div className="rounded-2xl border border-[#d6ad63]/35 bg-[#d6ad63]/[.06] p-7 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6ad63]/50 text-2xl text-[#f0c978]">✓</div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">Quote request received</p>
                <h3 className="mt-2 text-3xl font-semibold">We have your project details.</h3>
                <p className="mt-4 max-w-2xl leading-7 text-white/65">Your calculator selections and estimated project range were saved with your request. We’ll review them and follow up about an exact quote.</p>
            </div>
        );
    }

    if (!started) {
        return (
            <button type="button" onClick={() => setStarted(true)} className="group w-full rounded-2xl border border-[#d6ad63]/30 bg-[linear-gradient(135deg,rgba(214,173,99,.12),rgba(255,255,255,.025))] p-6 text-left shadow-2xl transition hover:border-[#d6ad63]/60 hover:bg-[#d6ad63]/10 sm:p-8">
                <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#d6ad63]/35 bg-black/30 text-[#e9c985] transition group-hover:scale-105"><WalletCalculatorIcon /></div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">Plan your project</p>
                        <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Build a quick LVP project estimate</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Choose your room size, existing floor, trim, transitions, stairs and material level. We’ll show one approximate project range — no confusing line-item pricing.</p>
                    </div>
                    <span className="ml-auto hidden text-3xl text-[#d6ad63] sm:block">→</span>
                </div>
            </button>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">LVP Project Planner</p><h3 className="mt-2 text-3xl font-semibold">Tell us about the space</h3></div>
                <div className="text-[#e9c985]"><WalletCalculatorIcon /></div>
            </div>

            <div className="mt-7 space-y-8">
                <section>
                    <p className="mb-3 text-sm font-semibold">1. Project size</p>
                    <div className="mb-4 flex gap-2">
                        <button type="button" onClick={() => setSizeMode('dimensions')} className={optionClass(sizeMode === 'dimensions')}>Room dimensions</button>
                        <button type="button" onClick={() => setSizeMode('sqft')} className={optionClass(sizeMode === 'sqft')}>I know the square footage</button>
                    </div>
                    {sizeMode === 'dimensions' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <label><span className="mb-2 block text-xs text-white/50">Length (ft)</span><input value={length} onChange={e => setLength(e.target.value)} type="number" min="1" step="0.5" className={fieldClass} placeholder="20" /></label>
                            <label><span className="mb-2 block text-xs text-white/50">Width (ft)</span><input value={width} onChange={e => setWidth(e.target.value)} type="number" min="1" step="0.5" className={fieldClass} placeholder="10" /></label>
                        </div>
                    ) : <input value={sqftInput} onChange={e => setSqftInput(e.target.value)} type="number" min="1" className={fieldClass} placeholder="Square feet, e.g. 750" />}
                    {estimate && <p className="mt-3 text-sm text-white/55">Calculated area: <b className="text-white">{estimate.sqft} sq ft</b>{sizeMode === 'dimensions' ? <> • wall perimeter for trim: <b className="text-white">{estimate.perimeter} ft</b></> : null}</p>}
                </section>

                <section>
                    <p className="mb-3 text-sm font-semibold">2. City or ZIP</p>
                    <input value={location} onChange={e => setLocation(e.target.value)} className={fieldClass} placeholder="Ramsey, MN or 55303" />
                </section>

                <section>
                    <p className="mb-3 text-sm font-semibold">3. What is on the floor now?</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                        {([['none','Bare subfloor'],['carpet','Carpet'],['floating','LVP / Laminate'],['hardwood','Hardwood'],['tile','Tile']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setExistingFloor(value)} className={optionClass(existingFloor === value)}>{label}</button>)}
                    </div>
                    {existingFloor !== 'none' && <label className="mt-4 flex items-center gap-3 text-sm text-white/70"><input type="checkbox" checked={removeOld} onChange={e => setRemoveOld(e.target.checked)} className="h-4 w-4 accent-[#d6ad63]" />Include removal of the existing floor</label>}
                </section>

                <section>
                    <p className="mb-3 text-sm font-semibold">4. Trim around the room</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {([['keep','Keep existing trim'],['reinstall','Remove & reinstall'],['new','Install new baseboards'],['shoe','Add shoe / quarter-round']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setTrim(value)} className={optionClass(trim === value)}>{label}</button>)}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/40">When dimensions are entered, trim length is estimated automatically from the room perimeter.</p>
                </section>

                <section className="grid gap-5 sm:grid-cols-2">
                    <label><span className="mb-2 block text-sm font-semibold">5. Doorways / transitions</span><input value={doors} onChange={e => setDoors(Math.max(0, Number(e.target.value)))} type="number" min="0" className={fieldClass} /></label>
                    <label><span className="mb-2 block text-sm font-semibold">6. LVP-covered stairs</span><input value={stairs} onChange={e => setStairs(Math.max(0, Number(e.target.value)))} type="number" min="0" className={fieldClass} /></label>
                </section>

                <section>
                    <p className="mb-3 text-sm font-semibold">7. Subfloor condition</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                        {([['good','Looks good'],['minor','Minor issues'],['unsure','Not sure']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setSubfloor(value)} className={optionClass(subfloor === value)}>{label}</button>)}
                    </div>
                </section>

                <section>
                    <p className="mb-3 text-sm font-semibold">8. New LVP material</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {([['have','I already have flooring'],['value','Help source — Value'],['premium','Help source — Premium'],['heavy','Help source — Heavy-duty / Premium']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setMaterial(value)} className={optionClass(material === value)}>{label}</button>)}
                    </div>
                </section>
            </div>

            {estimate ? (
                <div className="mt-8 rounded-2xl border border-[#d6ad63]/30 bg-black/35 p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">Estimated project range</p>
                    <p className="mt-3 text-4xl font-semibold text-[#f0c978] sm:text-5xl">{money(estimate.low)} – {money(estimate.high)}</p>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/50">This is a preliminary planning range based on the options selected. Final pricing is confirmed after measurements, product selection and site conditions are reviewed.</p>
                    {!showContact && <button type="button" onClick={() => { setError(''); setShowContact(true); }} disabled={!location.trim()} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#d6ad63] px-7 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978] disabled:cursor-not-allowed disabled:opacity-40">Request My Exact Quote</button>}
                </div>
            ) : <p className="mt-8 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/45">Enter the project size to calculate an estimated range.</p>}

            {showContact && estimate && (
                <form onSubmit={event => { event.preventDefault(); submitQuote(event.currentTarget); }} className="mt-7 border-t border-white/10 pt-7">
                    <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">Send this project to Moliora</p>
                    <h4 className="mt-2 text-2xl font-semibold">Just your contact information</h4>
                    <p className="mt-2 text-sm text-white/50">Your project selections and the {money(estimate.low)}–{money(estimate.high)} range are already attached.</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <label><span className="mb-2 block text-sm">Name *</span><input name="name" required autoComplete="name" className={fieldClass} /></label>
                        <label><span className="mb-2 block text-sm">Phone *</span><input name="phone" required type="tel" autoComplete="tel" className={fieldClass} placeholder="(612) 555-0123" /></label>
                        <label><span className="mb-2 block text-sm">Email *</span><input name="email" required type="email" autoComplete="email" className={fieldClass} /></label>
                    </div>
                    <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/60"><input name="consent" value="true" required type="checkbox" className="mt-1 h-4 w-4 accent-[#d6ad63]" /><span>I agree that Moliora may contact me by phone, text or email about this flooring request. *</span></label>
                    {error && <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
                    <button type="submit" disabled={isPending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978] disabled:opacity-50">{isPending ? 'Sending…' : 'Submit Quote Request'}</button>
                </form>
            )}
        </div>
    );
}
