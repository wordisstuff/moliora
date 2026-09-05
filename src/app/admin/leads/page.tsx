'use client';

import { useMemo, useState } from 'react';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Estimate Scheduled', 'Estimate Sent', 'Won', 'Lost'];
type Lead = { _id: string; name: string; phone: string; email?: string; location: string; approximateArea?: string; existingFlooring?: string; demolition?: string; materialSupply?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; utmTerm?: string; gclid?: string; status?: string; estimatedValue?: number; finalJobValue?: number; notes?: string; createdAt: string };

export default function LeadDashboard() {
    const [key, setKey] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true); setError('');
        const res = await fetch('/api/admin/leads', { headers: { 'x-admin-key': key } });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) return setError(data.error || 'Unable to load leads.');
        setLeads(data.leads || []);
    };

    const save = async (lead: Lead, patch: Partial<Lead>) => {
        const res = await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-key': key }, body: JSON.stringify({ id: lead._id, ...patch }) });
        const data = await res.json();
        if (!res.ok) return setError(data.error || 'Unable to save lead.');
        setLeads(current => current.map(item => item._id === lead._id ? data.lead : item));
    };

    const metrics = useMemo(() => ({
        total: leads.length,
        qualified: leads.filter(l => ['Qualified', 'Estimate Scheduled', 'Estimate Sent', 'Won'].includes(l.status || '')).length,
        estimates: leads.filter(l => ['Estimate Scheduled', 'Estimate Sent', 'Won'].includes(l.status || '')).length,
        won: leads.filter(l => l.status === 'Won').length,
        revenue: leads.reduce((sum, l) => sum + (l.finalJobValue || 0), 0),
    }), [leads]);

    return <main className="min-h-screen bg-[#0f1111] px-4 py-24 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d6ad63]">mOliora</p>
            <h1 className="mt-2 text-3xl font-bold">Flooring Lead Dashboard</h1>
            <p className="mt-2 text-sm text-white/60">Track every flooring inquiry from click to won job.</p>
            <div className="mt-6 flex max-w-xl gap-2"><input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="Admin CRM key" className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-3"/><button onClick={load} className="rounded-lg bg-[#d6ad63] px-5 py-3 font-bold text-black">{loading?'Loading…':'Open CRM'}</button></div>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            {leads.length>0 && <>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">{[['Leads',metrics.total],['Qualified',metrics.qualified],['Estimates',metrics.estimates],['Won',metrics.won],['Won revenue',`$${metrics.revenue.toLocaleString()}`]].map(([label,value])=><div key={String(label)} className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase text-white/50">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</div>
                <div className="mt-6 space-y-4">{leads.map(lead=><article key={lead._id} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{lead.name} · {lead.location}</h2><p className="text-sm text-white/65"><a href={`tel:${lead.phone}`}>{lead.phone}</a>{lead.email?` · ${lead.email}`:''} · {new Date(lead.createdAt).toLocaleString()}</p></div><select value={lead.status||'New'} onChange={e=>save(lead,{status:e.target.value})} className="rounded-lg bg-[#202323] px-3 py-2 text-sm">{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
                    <div className="mt-4 grid gap-2 text-sm text-white/75 sm:grid-cols-3"><p><b>Area:</b> {lead.approximateArea||'—'}</p><p><b>Existing:</b> {lead.existingFlooring||'—'}</p><p><b>Removal:</b> {lead.demolition||'—'}</p><p><b>Material:</b> {lead.materialSupply||'—'}</p><p><b>Source:</b> {lead.utmSource||'direct'} / {lead.utmMedium||'—'}</p><p><b>Campaign:</b> {lead.utmCampaign||'—'}</p><p><b>Keyword:</b> {lead.utmTerm||'—'}</p><p className="sm:col-span-2"><b>GCLID:</b> {lead.gclid||'—'}</p></div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-xs text-white/55">Estimated value<input defaultValue={lead.estimatedValue||''} onBlur={e=>save(lead,{estimatedValue:Number(e.target.value)||0})} type="number" min="0" className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"/></label><label className="text-xs text-white/55">Final job value<input defaultValue={lead.finalJobValue||''} onBlur={e=>save(lead,{finalJobValue:Number(e.target.value)||0})} type="number" min="0" className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"/></label><label className="text-xs text-white/55">Notes<textarea defaultValue={lead.notes||''} onBlur={e=>save(lead,{notes:e.target.value})} className="mt-1 h-20 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"/></label></div>
                </article>)}</div>
            </>}
        </div>
    </main>;
}
