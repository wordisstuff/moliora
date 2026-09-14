'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { trackEvent } from '@/lib/analytics';

const fieldClass = 'min-h-12 w-full border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#d6ad63] focus:ring-2 focus:ring-[#d6ad63]/30';
const selectClass = `${fieldClass} appearance-none`;

export default function LvpLeadForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const plannerCompleteTracked = useRef(false);
  const plannerLeadTracked = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (anchor?.getAttribute('href')?.startsWith('tel:')) {
        trackEvent('phone_click', { source: 'lvp_landing_page' });
        return;
      }

      const button = target.closest('button');
      if (!button) return;
      const text = button.textContent?.replace(/\s+/g, ' ').trim() || '';

      if (text.includes('Plan Your Project & Request a Quote')) {
        plannerCompleteTracked.current = false;
        plannerLeadTracked.current = false;
        trackEvent('planner_open', { source: 'lvp_hero' });
        return;
      }

      if (text.startsWith('Continue')) {
        const dialog = button.closest('[role="dialog"]');
        const stepText = dialog?.textContent?.match(/Step\s+(\d+)\s+of\s+6/i)?.[1];
        const step = Number(stepText || 0);
        if (step > 0) {
          trackEvent('planner_step_complete', { step, source: 'lvp_project_planner' });
          if (step === 5 && !plannerCompleteTracked.current) {
            plannerCompleteTracked.current = true;
            trackEvent('planner_complete', { source: 'lvp_project_planner' });
          }
        }
        return;
      }

      if (text.includes('Request My Exact Quote')) {
        if (!plannerCompleteTracked.current) {
          plannerCompleteTracked.current = true;
          trackEvent('planner_complete', { source: 'lvp_project_planner' });
        }
        trackEvent('planner_quote_request', { source: 'lvp_project_planner' });
      }
    };

    const observer = new MutationObserver(() => {
      if (plannerLeadTracked.current) return;
      const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'));
      const successDialog = dialogs.find(dialog => dialog.textContent?.includes('We have your project.'));
      if (!successDialog) return;

      plannerLeadTracked.current = true;
      trackEvent('lead_submit', { lead_type: 'planner', source: 'lvp_project_planner' });
      trackEvent('planner_lead_submit', { source: 'lvp_project_planner' });
    });

    document.addEventListener('click', onClick, true);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      document.removeEventListener('click', onClick, true);
      observer.disconnect();
    };
  }, []);

  async function submit(form: HTMLFormElement) {
    setError('');
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''), phone: String(data.get('phone') || ''), email: String(data.get('email') || ''),
      location: String(data.get('location') || ''), service: 'LVP Flooring', approximateArea: String(data.get('approximateArea') || ''),
      existingFlooring: String(data.get('existingFlooring') || ''), demolition: String(data.get('demolition') || ''), materialSupply: String(data.get('materialSupply') || ''),
      message: String(data.get('message') || '').trim() || 'LVP flooring estimate request', consent: data.get('consent') === 'true', website: '',
      leadSource: 'LVP Flooring Landing Page', landingPage: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/flooring/lvp',
    };
    startTransition(async () => {
      try {
        const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await response.json() as { success?: boolean; error?: string };
        if (!response.ok || !result.success) return setError(result.error || 'We could not submit your request.');
        trackEvent('lead_submit', { lead_type: 'quick_estimate', source: 'lvp_quick_estimate' });
        trackEvent('quick_estimate_submit', { source: 'lvp_quick_estimate' });
        setSuccess(true); form.reset();
      } catch { setError('Unexpected error. Please try again.'); }
    });
  }

  if (success) return <div className="border border-[#d6ad63]/30 bg-white/[0.03] p-7"><p className="text-xs font-bold uppercase tracking-[.3em] text-[#d6ad63]">Request received</p><h3 className="mt-2 text-3xl font-semibold">Thank you!</h3><p className="mt-3 text-white/65">We received your flooring request and will contact you about the next step.</p></div>;

  return <form onSubmit={e => { e.preventDefault(); submit(e.currentTarget); }} className="border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-7">
    <div className="grid gap-5 sm:grid-cols-2">
      <label><span className="mb-2 block text-sm font-medium">Name *</span><input name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" /></label>
      <label><span className="mb-2 block text-sm font-medium">Phone *</span><input name="phone" required type="tel" className={fieldClass} placeholder="(612) 555-0123" /></label>
      <label><span className="mb-2 block text-sm font-medium">Email</span><input name="email" type="email" className={fieldClass} placeholder="Optional" /></label>
      <label><span className="mb-2 block text-sm font-medium">City or ZIP *</span><input name="location" required className={fieldClass} placeholder="St. Paul, MN or ZIP" /></label>
      <label><span className="mb-2 block text-sm font-medium">Approximate floor area *</span><select name="approximateArea" required defaultValue="" className={selectClass}><option value="" disabled>Select area</option><option>Under 500 sq ft</option><option>500–1,000 sq ft</option><option>1,000–1,500 sq ft</option><option>1,500+ sq ft</option><option>Not sure</option></select></label>
      <label><span className="mb-2 block text-sm font-medium">Current flooring *</span><select name="existingFlooring" required defaultValue="" className={selectClass}><option value="" disabled>Select current floor</option><option>Carpet</option><option>LVP or Laminate</option><option>Hardwood</option><option>Tile</option><option>Bare subfloor</option><option>Not sure</option></select></label>
      <label><span className="mb-2 block text-sm font-medium">Need old flooring removed? *</span><select name="demolition" required defaultValue="" className={selectClass}><option value="" disabled>Select</option><option>Yes</option><option>No</option><option>Not sure</option></select></label>
      <label><span className="mb-2 block text-sm font-medium">New LVP material *</span><select name="materialSupply" required defaultValue="" className={selectClass}><option value="" disabled>Select</option><option>Need Moliora to supply it</option><option>I already have flooring</option><option>Not sure</option></select></label>
    </div>
    <label className="mt-5 block"><span className="mb-2 block text-sm font-medium">Project details</span><textarea name="message" rows={4} className={fieldClass} placeholder="Rooms, stairs, baseboards, timing or anything else." /></label>
    <label className="mt-5 flex gap-3 text-sm leading-6 text-white/65"><input name="consent" value="true" required type="checkbox" className="mt-1 size-4 accent-[#d6ad63]" /><span>I agree that Moliora may contact me by phone, text or email about this flooring request. *</span></label>
    {error && <p className="mt-4 text-sm text-red-200">{error}</p>}
    <button disabled={pending} className="mt-6 min-h-12 w-full bg-[#d6ad63] px-6 text-sm font-bold uppercase tracking-wider text-black hover:bg-[#f0c978] disabled:opacity-60">{pending ? 'Sending…' : 'Request Estimate'}</button>
    <p className="mt-3 text-center text-xs text-white/45">Approximate information is fine. Final scope and pricing are confirmed before work starts.</p>
  </form>;
}
