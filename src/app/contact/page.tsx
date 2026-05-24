'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import ContactsInfo from '@/components/ContactsInfo';

/** ---------- draft helpers ---------- */
type Draft = {
    name?: string;
    phone?: string;
    email?: string;
    location?: string;
    service?: string;
    budget?: string;
    message?: string;
};

type ApiResponse = {
    success: boolean;
    error?: string;
    id?: string;
};

const DRAFT_KEY = 'contactDraft_v1';
const CONSENT_KEY = 'privacyAgreed';

function readDraft(): Draft {
    try {
        return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch {
        return {};
    }
}
function writeDraft(d: Draft) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}
function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [toast, setToast] = useState<{
        type: 'success' | 'error' | 'info';
        msg: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [consent, setConsent] = useState(false);

    /** Відновлюємо згоду і чернетку з localStorage при відкритті */
    useEffect(() => {
        const agreed = localStorage.getItem(CONSENT_KEY) === 'true';
        if (agreed) setConsent(true);

        const draft = readDraft();
        const f = formRef.current;
        if (!f) return;

        (
            [
                'name',
                'phone',
                'email',
                'location',
                'service',
                'budget',
                'message',
            ] as const
        ).forEach(name => {
            const el = f.elements.namedItem(name) as
                | HTMLInputElement
                | HTMLTextAreaElement
                | HTMLSelectElement
                | null;
            if (el && draft[name] != null) {
                el.value = draft[name] as string;
            }
        });
    }, []);

    /** Збереження форми (debounce 250ms) */
    const draftTimer = useRef<number | null>(null);
    const saveDraft = () => {
        const f = formRef.current;
        if (!f) return;
        const d: Draft = {
            name:
                (f.elements.namedItem('name') as HTMLInputElement)?.value || '',
            phone:
                (f.elements.namedItem('phone') as HTMLInputElement)?.value ||
                '',
            email:
                (f.elements.namedItem('email') as HTMLInputElement)?.value ||
                '',
            location:
                (f.elements.namedItem('location') as HTMLInputElement)?.value ||
                '',
            service:
                (f.elements.namedItem('service') as HTMLSelectElement)?.value ||
                '',
            budget:
                (f.elements.namedItem('budget') as HTMLSelectElement)?.value ||
                '',
            message:
                (f.elements.namedItem('message') as HTMLTextAreaElement)
                    ?.value || '',
        };
        writeDraft(d);
    };
    const handleAnyChange = () => {
        if (draftTimer.current) window.clearTimeout(draftTimer.current);
        draftTimer.current = window.setTimeout(saveDraft, 250);
    };

    /** Згода на контакт */
    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        setConsent(value);
        localStorage.setItem(CONSENT_KEY, value ? 'true' : 'false');
    };

    /** Надсилання форми */
    async function handleSubmit(formData: FormData) {
        setToast({ type: 'info', msg: 'Sending…' });

        // honeypot
        if ((formData.get('website') as string | null)?.trim()) {
            setToast({ type: 'error', msg: 'Spam detected.' });
            return;
        }

        // Готуємо "чистий" обʼєкт для JSON
        const payload: Record<string, string> = {};
        formData.forEach((value, key) => {
            // у нас тільки текстові поля, але на всяк випадок:
            if (typeof value === 'string') {
                payload[key] = value;
            }
        });

        startTransition(async () => {
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const data = (await res.json()) as ApiResponse;

                if (!res.ok || !data.success) {
                    setToast({
                        type: 'error',
                        msg:
                            data.error ??
                            `❌ Failed to send message (status ${res.status}).`,
                    });
                    return;
                }

                // успіх
                setToast({
                    type: 'success',
                    msg: '✅ Message sent successfully! We’ll get back within 1 business day.',
                });

                clearDraft();
                localStorage.setItem('privacyAgreed', 'false');
                setConsent(false);
                formRef.current?.reset();
            } catch (e) {
                console.error('Contact form error:', e);
                setToast({
                    type: 'error',
                    msg: '❌ Unexpected error. Please try again later.',
                });
            }
        });
    }
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const phoneCode = '+1';
        const phoneNumber = '(612) 468-3176';
        setPhone(`${phoneCode} ${phoneNumber}`);
    }, []);

    return (
        <main className="min-h-screen bg-[#0f1111] pt-20 text-white">
            <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                        Contact Moliora
                    </p>

                    <h1 className="mt-5 text-5xl font-semibold leading-tight sm:text-6xl">
                        Request Your Free Estimate
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                        Tell us about your project. We’ll review the details and
                        get back to you with the next steps.
                    </p>

                    <div className="mt-10 space-y-5 text-white/75">
                        <p>
                            <span className="text-[#d6ad63]">Phone:</span>{' '}
                            <a
                                href="tel:+16124683176"
                                className="hover:text-white"
                            >
                                (612) 468-3176
                            </a>
                        </p>

                        <p>
                            <span className="text-[#d6ad63]">Email:</span>{' '}
                            <a
                                href="mailto:support@moliora.us"
                                className="hover:text-white"
                            >
                                support@moliora.us
                            </a>
                        </p>

                        <p>
                            <span className="text-[#d6ad63]">
                                Service Area:
                            </span>{' '}
                            Minneapolis–St. Paul, MN
                        </p>
                    </div>
                </div>

                <form
                    ref={formRef}
                    onChange={handleAnyChange}
                    onSubmit={e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        handleSubmit(fd);
                    }}
                    method="POST"
                    className="border border-white/10 bg-white/[0.03] p-6 shadow-2xl"
                >
                    <div aria-live="polite" className="sr-only">
                        {toast?.msg}
                    </div>

                    {toast && (
                        <div
                            className={`mb-5 border p-4 text-sm ${
                                toast.type === 'success'
                                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                                    : toast.type === 'error'
                                      ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                                      : 'border-[#d6ad63]/40 bg-[#d6ad63]/10 text-[#f0c978]'
                            }`}
                        >
                            {toast.msg}
                        </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                        <input
                            name="name"
                            required
                            className="border border-white/10 bg-black/30 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#d6ad63]"
                            placeholder="Full Name"
                        />

                        <input
                            name="phone"
                            inputMode="tel"
                            className="border border-white/10 bg-black/30 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#d6ad63]"
                            placeholder="Phone Number"
                        />

                        <input
                            name="email"
                            type="email"
                            required
                            className="border border-white/10 bg-black/30 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#d6ad63]"
                            placeholder="Email Address"
                        />

                        <input
                            name="location"
                            className="border border-white/10 bg-black/30 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#d6ad63]"
                            placeholder="City / ZIP"
                        />
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <select
                            name="service"
                            className="border border-white/10 bg-black/30 px-4 py-4 text-white outline-none focus:border-[#d6ad63]"
                        >
                            <option>Window Installation</option>
                            <option>Door Installation</option>
                            <option>Deck Repair</option>
                            <option>Remodeling</option>
                            <option>Exterior Services</option>
                            <option>Handyman Services</option>
                            <option>Other</option>
                        </select>

                        <select
                            name="budget"
                            className="border border-white/10 bg-black/30 px-4 py-4 text-white outline-none focus:border-[#d6ad63]"
                        >
                            <option>Under $1,000</option>
                            <option>$1,000 – $5,000</option>
                            <option>$5,000 – $15,000</option>
                            <option>$15,000+</option>
                        </select>
                    </div>

                    <textarea
                        name="message"
                        rows={6}
                        required
                        className="mt-5 w-full border border-white/10 bg-black/30 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-[#d6ad63]"
                        placeholder="Tell us about the scope, timeline, and any photos/links…"
                    />

                    <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                    />

                    <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/65">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={handleConsentChange}
                            required={!consent}
                            className="mt-1"
                        />
                        <span>
                            I agree to be contacted about my request.
                            <Link
                                href="/policy"
                                onClick={saveDraft}
                                className="ml-1 text-[#d6ad63] hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-7 inline-flex items-center gap-3 bg-[#d6ad63] px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending && (
                            <svg
                                viewBox="0 0 24 24"
                                className="size-5 animate-spin"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    strokeWidth="2"
                                    className="opacity-25"
                                />
                                <path
                                    d="M21 12a9 9 0 0 1-9 9"
                                    strokeWidth="2"
                                    className="opacity-80"
                                />
                            </svg>
                        )}
                        {isPending ? 'Sending…' : 'Send Request'}
                    </button>

                    <p className="mt-3 text-xs text-white/45">
                        Response within 1 business day.
                    </p>
                </form>
            </section>

            <section className="border-t border-white/10 bg-[#101212] px-6 py-14">
                <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
                    <div className="border border-white/10 p-6">
                        <h3 className="text-xl font-semibold text-[#d6ad63]">
                            Get in touch
                        </h3>
                        <div className="mt-4 text-white/65">
                            <ContactsInfo />
                        </div>
                    </div>

                    <div className="border border-white/10 p-6">
                        <h3 className="text-xl font-semibold text-[#d6ad63]">
                            Hours
                        </h3>
                        <ul className="mt-4 space-y-2 text-white/65">
                            <li>Mon–Fri: 8:00–18:00</li>
                            <li>Sat: 9:00–14:00</li>
                            <li>Sun: by appointment</li>
                        </ul>
                    </div>

                    <div className="border border-white/10 p-6">
                        <h3 className="text-xl font-semibold text-[#d6ad63]">
                            Licensed & Insured
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-white/65">
                            Documentation available upon request.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
