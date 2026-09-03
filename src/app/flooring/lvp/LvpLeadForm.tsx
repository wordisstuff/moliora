'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { phoneDisplay, phoneHref } from '@/config/company';
import { flooringProducts } from '../catalog/catalogData';

type ApiResponse = {
    success: boolean;
    error?: string;
    id?: string;
    notificationPending?: boolean;
};

type Attribution = {
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
    gclid: string;
    landingPage: string;
};

const ATTRIBUTION_KEY = 'moliora_lvp_attribution_v1';

const fieldClass =
    'min-h-12 w-full border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#d6ad63] focus:ring-2 focus:ring-[#d6ad63]/30';
const selectClass = `${fieldClass} appearance-none`;

function readAttribution(): Attribution {
    const empty: Attribution = {
        utmSource: '', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '', gclid: '', landingPage: '',
    };
    if (typeof window === 'undefined') return empty;

    const params = new URLSearchParams(window.location.search);
    const current: Attribution = {
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmTerm: params.get('utm_term') || '',
        utmContent: params.get('utm_content') || '',
        gclid: params.get('gclid') || '',
        landingPage: `${window.location.pathname}${window.location.search}`,
    };

    const hasCampaignData = Object.entries(current).some(([key, value]) => key !== 'landingPage' && Boolean(value));
    if (hasCampaignData) {
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
        return current;
    }

    try {
        const saved = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || '{}') as Partial<Attribution>;
        return { ...empty, ...saved, landingPage: current.landingPage };
    } catch {
        return current;
    }
}

function fireEvent(eventName: string, params: Record<string, string> = {}) {
    const w = window as typeof window & {
        dataLayer?: Array<Record<string, unknown>>;
        gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: eventName, ...params });
    w.gtag?.('event', eventName, params);
}

export default function LvpLeadForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [selectedFloorId, setSelectedFloorId] = useState('');
    const [attribution, setAttribution] = useState<Attribution>({
        utmSource: '', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '', gclid: '', landingPage: '',
    });

    useEffect(() => {
        setAttribution(readAttribution());
        const params = new URLSearchParams(window.location.search);
        setSelectedFloorId(params.get('floor') || '');
    }, []);

    const selectedFloor = useMemo(
        () => flooringProducts.find(item => item.id === selectedFloorId),
        [selectedFloorId],
    );

    async function submit(form: HTMLFormElement) {
        setError('');
        const data = new FormData(form);
        const userMessage = String(data.get('message') || '').trim();
        const floorNote = selectedFloor
            ? `Selected flooring: ${selectedFloor.brand} ${selectedFloor.name} (${selectedFloor.model})`
            : '';
        const message = [userMessage || 'LVP flooring estimate request', floorNote]
            .filter(Boolean)
            .join('\n\n');

        const payload = {
            name: String(data.get('name') || ''),
            phone: String(data.get('phone') || ''),
            email: String(data.get('email') || ''),
            location: String(data.get('location') || ''),
            service: 'LVP Flooring',
            approximateArea: String(data.get('approximateArea') || ''),
            existingFlooring: String(data.get('existingFlooring') || ''),
            demolition: String(data.get('demolition') || ''),
            materialSupply: String(data.get('materialSupply') || ''),
            message,
            consent: data.get('consent') === 'true',
            website: String(data.get('website') || ''),
            leadSource: selectedFloor ? 'LVP Catalog / Design Center' : 'LVP Flooring Landing Page',
            ...attribution,
        };

        startTransition(async () => {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const result = (await response.json()) as ApiResponse;
                if (!response.ok || !result.success) {
                    setError(result.error || 'We could not submit your request. Please try again.');
                    return;
                }

                fireEvent('generate_lead', {
                    service: 'LVP Flooring',
                    lead_id: result.id || '',
                    location: payload.location,
                    approximate_area: payload.approximateArea,
                    selected_floor: selectedFloor?.id || '',
                });
                setSuccess(true);
                form.reset();
            } catch {
                setError('Unexpected error. Please call us or try again later.');
            }
        });
    }

    if (success) {
        return (
            <div className="border border-[#d6ad63]/30 bg-white/[0.03] p-6 sm:p-8" role="status">
                <div className="flex size-12 items-center justify-center rounded-full border border-[#d6ad63]/60 bg-[#d6ad63]/10 text-2xl text-[#f0c978]">✓</div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Request received</p>
                <h3 className="mt-2 text-3xl font-semibold">Thank you!</h3>
                <p className="mt-4 max-w-xl leading-7 text-white/70">We received your flooring request and will review the project details. We’ll contact you about the next step.</p>
                <a href={phoneHref} onClick={() => fireEvent('call_click', { placement: 'lvp_success' })} className="mt-6 inline-flex min-h-12 items-center justify-center border border-[#d6ad63]/60 px-5 text-sm font-semibold text-[#f0c978] hover:bg-[#d6ad63]/10">Call {phoneDisplay}</a>
            </div>
        );
    }

    return (
        <form onSubmit={event => { event.preventDefault(); submit(event.currentTarget); }} className="border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-7">
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {selectedFloor && (
                <div className="mb-5 border border-[#d6ad63]/30 bg-[#d6ad63]/[.07] px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d6ad63]">Selected from catalog</p>
                    <p className="mt-1 font-semibold">{selectedFloor.brand} — {selectedFloor.name}</p>
                    <p className="mt-1 text-xs text-white/45">{selectedFloor.collection} • {selectedFloor.wearLayer} • {selectedFloor.model}</p>
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-sm font-medium">Name *</span><input name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Phone *</span><input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className={fieldClass} placeholder="(612) 555-0123" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Email</span><input name="email" type="email" autoComplete="email" className={fieldClass} placeholder="Optional" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">City or ZIP *</span><input name="location" required autoComplete="postal-code" className={fieldClass} placeholder="Ramsey, MN or 55303" /></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Approximate floor area *</span><select name="approximateArea" required defaultValue="" className={selectClass}><option value="" disabled>Select area</option><option>Under 500 sq ft</option><option>500–1,000 sq ft</option><option>1,000–1,500 sq ft</option><option>1,500+ sq ft</option><option>Not sure</option></select></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Current flooring *</span><select name="existingFlooring" required defaultValue="" className={selectClass}><option value="" disabled>Select flooring</option><option>Carpet</option><option>LVP or Laminate</option><option>Hardwood</option><option>Tile</option><option>Bare subfloor</option><option>Not sure</option></select></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Need old flooring removed? *</span><select name="demolition" required defaultValue="" className={selectClass}><option value="" disabled>Select</option><option>Yes</option><option>No</option><option>Not sure</option></select></label>
                <label className="block"><span className="mb-2 block text-sm font-medium">Who is supplying the LVP? *</span><select name="materialSupply" required defaultValue="" className={selectClass}><option value="" disabled>Select</option><option>Need Moliora to supply it</option><option>I already have flooring</option><option>Not sure</option></select></label>
            </div>

            <label className="mt-5 block"><span className="mb-2 block text-sm font-medium">Project details</span><textarea name="message" rows={4} className={fieldClass} placeholder="Rooms, stairs, baseboards, timing or anything else we should know." /></label>
            <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/65"><input name="consent" value="true" required type="checkbox" className="mt-1 size-4 accent-[#d6ad63]" /><span>I agree that Moliora may contact me by phone, text or email about this flooring request. *</span></label>
            {error && <p className="mt-4 border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
            <button type="submit" disabled={isPending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978] disabled:cursor-not-allowed disabled:opacity-60">{isPending ? 'Sending…' : 'Request Free Estimate'}</button>
            <p className="mt-3 text-center text-xs leading-5 text-white/45">Approximate information is fine. Final scope and pricing are confirmed before work starts.</p>
        </form>
    );
}
