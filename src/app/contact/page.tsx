'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import ContactsInfo from '@/components/ContactsInfo';
import { email, phoneDisplay, phoneHref, serviceArea } from '@/config/company';
import { CONTACT_SERVICES } from '@/config/contact';

type Draft = {
    service?: string;
    message?: string;
    name?: string;
    phone?: string;
    location?: string;
    email?: string;
};

type ApiResponse = {
    success: boolean;
    error?: string;
    id?: string;
    notificationPending?: boolean;
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

function fieldClass() {
    return 'min-h-12 w-full border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#d6ad63] focus:ring-2 focus:ring-[#d6ad63]/30';
}

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const successHeadingRef = useRef<HTMLHeadingElement>(null);
    const draftTimer = useRef<number | null>(null);
    const [toast, setToast] = useState<{
        type: 'error' | 'info';
        msg: string;
    } | null>(null);
    const [submittedContact, setSubmittedContact] = useState<{
        name: string;
        email: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [consent, setConsent] = useState(false);
    const [service, setService] = useState('');

    useEffect(() => {
        if (submittedContact) {
            successHeadingRef.current?.focus();
        }
    }, [submittedContact]);

    useEffect(() => {
        setConsent(localStorage.getItem(CONSENT_KEY) === 'true');
        const draft = readDraft();
        if (
            draft.service &&
            CONTACT_SERVICES.includes(
                draft.service as (typeof CONTACT_SERVICES)[number],
            )
        ) {
            setService(draft.service);
        }

        const form = formRef.current;
        if (!form) return;
        (['message', 'name', 'phone', 'location', 'email'] as const).forEach(
            name => {
                const element = form.elements.namedItem(name) as
                    | HTMLInputElement
                    | HTMLTextAreaElement
                    | null;
                if (element && draft[name] != null) {
                    element.value = draft[name] as string;
                }
            },
        );
    }, []);

    const saveDraft = () => {
        const form = formRef.current;
        if (!form) return;
        const value = (name: string) =>
            (
                form.elements.namedItem(name) as
                    | HTMLInputElement
                    | HTMLTextAreaElement
            )?.value || '';
        const selectedService = (
            form.elements.namedItem('service') as RadioNodeList | null
        )?.value;

        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({
                service: selectedService || '',
                message: value('message'),
                name: value('name'),
                phone: value('phone'),
                location: value('location'),
                email: value('email'),
            } satisfies Draft),
        );
    };

    const handleAnyChange = () => {
        if (draftTimer.current) window.clearTimeout(draftTimer.current);
        draftTimer.current = window.setTimeout(saveDraft, 250);
    };

    const handleConsentChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.checked;
        setConsent(value);
        localStorage.setItem(CONSENT_KEY, value ? 'true' : 'false');
    };

    async function handleSubmit(formData: FormData) {
        setToast({ type: 'info', msg: 'Sending your request…' });

        if ((formData.get('website') as string | null)?.trim()) {
            setToast({ type: 'error', msg: 'Unable to submit request.' });
            return;
        }

        const payload: Record<string, string | boolean> = {};
        formData.forEach((value, key) => {
            if (typeof value === 'string') payload[key] = value;
        });
        payload.consent = formData.get('consent') === 'true';

        startTransition(async () => {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = (await response.json()) as ApiResponse;

                if (!response.ok || !data.success) {
                    setToast({
                        type: 'error',
                        msg:
                            data.error ||
                            'We could not submit your request. Please check the form and try again.',
                    });
                    return;
                }

                setSubmittedContact({
                    name: String(formData.get('name') || '').trim(),
                    email: String(formData.get('email') || '').trim(),
                });
                setToast(null);
                localStorage.removeItem(DRAFT_KEY);
                localStorage.setItem(CONSENT_KEY, 'false');
                setConsent(false);
                setService('');
                formRef.current?.reset();
            } catch (error) {
                console.error('Contact form error:', error);
                setToast({
                    type: 'error',
                    msg: 'Unexpected error. Please call us or try again later.',
                });
            }
        });
    }

    const focusForm = () => {
        window.requestAnimationFrame(() => {
            document.getElementById('estimate-form-heading')?.focus();
        });
    };

    return (
        <main className="min-h-screen bg-[#0f1111] pb-28 pt-20 text-white md:pb-0">
            <section className="mx-auto grid max-w-7xl gap-7 px-5 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#d6ad63]">
                        Contact Moliora
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold leading-tight sm:mt-5 sm:text-5xl lg:text-6xl">
                        Request Your Free Estimate
                    </h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:mt-6 sm:text-lg sm:leading-8">
                        Tell us what you need. We’ll review your project and
                        contact you with the next steps.
                    </p>

                    <div className="mt-6 border-l-2 border-[#d6ad63] bg-white/[0.04] px-4 py-3 sm:mt-8">
                        <p className="text-sm font-semibold text-white">
                            Prefer to talk?
                        </p>
                        <a
                            href={phoneHref}
                            className="mt-1 inline-flex min-h-11 items-center text-lg font-semibold text-[#d6ad63] outline-none hover:text-[#f0c978] focus-visible:ring-2 focus-visible:ring-[#d6ad63]"
                        >
                            Call us: {phoneDisplay}
                        </a>
                    </div>

                    <div className="mt-6 hidden space-y-3 text-sm text-white/65 lg:block">
                        <p>
                            Email:{' '}
                            <a
                                href={`mailto:${email}`}
                                className="hover:text-white"
                            >
                                {email}
                            </a>
                        </p>
                        <p>Service Area: {serviceArea}</p>
                    </div>
                </div>

                {submittedContact ? (
                    <section
                        aria-labelledby="contact-success-heading"
                        className="relative overflow-hidden border border-[#d6ad63]/30 bg-white/[0.03] p-5 shadow-2xl sm:p-8"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute -right-20 -top-20 size-52 rounded-full bg-[#d6ad63]/[0.07] blur-3xl"
                        />
                        <div className="relative">
                            <div
                                aria-hidden="true"
                                className="flex size-12 items-center justify-center rounded-full border border-[#d6ad63]/60 bg-[#d6ad63]/10 text-2xl text-[#f0c978]"
                            >
                                ✓
                            </div>
                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">
                                Request received
                            </p>
                            <h2
                                id="contact-success-heading"
                                ref={successHeadingRef}
                                tabIndex={-1}
                                className="mt-2 text-3xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad63] sm:text-4xl"
                            >
                                Thank you
                                {submittedContact.name
                                    ? `, ${submittedContact.name.split(/\s+/)[0]}`
                                    : ''}
                                !
                            </h2>
                            <div className="mt-5 space-y-3 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                                <p>
                                    We&apos;ve received your project request and
                                    will review the details shortly.
                                </p>
                                <p>
                                    We&apos;ll get back to you within 1 business
                                    day by phone or email.
                                </p>
                                {submittedContact.email && (
                                    <p className="border-l-2 border-[#d6ad63] pl-4 text-white/80">
                                        We&apos;ve sent a confirmation email to{' '}
                                        <span className="font-semibold text-white">
                                            {submittedContact.email}
                                        </span>
                                        .
                                    </p>
                                )}
                            </div>

                            <div className="mt-7 border-t border-white/10 pt-6">
                                <h3 className="text-base font-semibold text-white">
                                    Need to add something or prefer to talk?
                                </h3>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    <a
                                        href={phoneHref}
                                        className="inline-flex min-h-12 items-center justify-center bg-[#d6ad63] px-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978] focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        Call {phoneDisplay}
                                    </a>
                                    <a
                                        href={`mailto:${email}`}
                                        className="inline-flex min-h-12 items-center justify-center border border-[#d6ad63]/60 px-4 text-sm font-semibold text-[#f0c978] transition hover:border-[#d6ad63] hover:bg-[#d6ad63]/10 focus-visible:ring-2 focus-visible:ring-[#d6ad63]"
                                    >
                                        Email us
                                    </a>
                                </div>
                                <Link
                                    href="/"
                                    className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-white/65 underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#d6ad63]"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </section>
                ) : (
                    <form
                        id="estimate-form"
                        ref={formRef}
                        onChange={handleAnyChange}
                        onSubmit={event => {
                            event.preventDefault();
                            handleSubmit(new FormData(event.currentTarget));
                        }}
                        className="scroll-mt-24 border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-6"
                    >
                        <h2
                            id="estimate-form-heading"
                            tabIndex={-1}
                            className="text-2xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#d6ad63]"
                        >
                            Tell us about your project
                        </h2>
                        <p className="mt-1 text-sm text-white/55">
                            Required fields are marked with an asterisk.
                        </p>

                        <div aria-live="polite" aria-atomic="true">
                            {toast && (
                                <div
                                    role={
                                        toast.type === 'error'
                                            ? 'alert'
                                            : 'status'
                                    }
                                    className={`mt-4 border p-3 text-sm ${
                                        toast.type === 'error'
                                            ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                                            : 'border-[#d6ad63]/40 bg-[#d6ad63]/10 text-[#f0c978]'
                                    }`}
                                >
                                    {toast.msg}
                                </div>
                            )}
                        </div>

                        <fieldset className="mt-5">
                            <legend className="text-sm font-semibold text-white">
                                What can we help you with?{' '}
                                <span aria-hidden="true">*</span>
                            </legend>
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2">
                                {CONTACT_SERVICES.map(option => (
                                    <label
                                        key={option}
                                        className={`flex min-h-12 cursor-pointer items-center border px-3 py-2.5 text-sm font-medium transition focus-within:ring-2 focus-within:ring-[#d6ad63] ${
                                            service === option
                                                ? 'border-[#d6ad63] bg-[#d6ad63]/15 text-[#f0c978]'
                                                : 'border-white/15 bg-black/30 text-white/75 hover:border-white/35'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="service"
                                            value={option}
                                            checked={service === option}
                                            onChange={() => setService(option)}
                                            required
                                            className="mr-2 accent-[#d6ad63]"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="mt-5">
                            <label
                                htmlFor="message"
                                className="text-sm font-semibold"
                            >
                                Tell us about your project{' '}
                                <span aria-hidden="true">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                maxLength={4000}
                                required
                                className={`${fieldClass()} mt-2 resize-y`}
                                placeholder="What would you like to have done?"
                            />
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="text-sm font-semibold"
                                >
                                    Name <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    maxLength={120}
                                    required
                                    className={`${fieldClass()} mt-2`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="text-sm font-semibold"
                                >
                                    Phone <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    maxLength={30}
                                    required
                                    className={`${fieldClass()} mt-2`}
                                    placeholder="(612) 555-0123"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="location"
                                    className="text-sm font-semibold"
                                >
                                    City or ZIP{' '}
                                    <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    autoComplete="postal-code"
                                    maxLength={120}
                                    required
                                    className={`${fieldClass()} mt-2`}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-sm font-semibold"
                                >
                                    Email{' '}
                                    <span className="font-normal text-white/55">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    maxLength={254}
                                    className={`${fieldClass()} mt-2`}
                                />
                            </div>
                        </div>

                        <input
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            className="hidden"
                            aria-hidden="true"
                        />

                        <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/70">
                            <input
                                id="consent"
                                name="consent"
                                type="checkbox"
                                value="true"
                                checked={consent}
                                onChange={handleConsentChange}
                                required
                                className="mt-1 size-5 shrink-0 accent-[#d6ad63] focus-visible:ring-2 focus-visible:ring-[#d6ad63]"
                            />
                            <label htmlFor="consent">
                                I agree to be contacted about my request.
                                <Link
                                    href="/policy"
                                    onClick={saveDraft}
                                    className="ml-1 text-[#d6ad63] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#d6ad63]"
                                >
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#d6ad63] px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#f0c978] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1111] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? 'Sending…' : 'Request Free Estimate'}
                        </button>
                        <p className="mt-3 text-center text-xs text-white/45">
                            Response within 1 business day.
                        </p>
                    </form>
                )}
            </section>

            <section className="border-t border-white/10 bg-[#101212] px-6 py-12">
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
                            Licensed &amp; Insured
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-white/65">
                            Documentation available upon request.
                        </p>
                    </div>
                </div>
            </section>

            <nav
                aria-label="Contact actions"
                className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#0b0c0c]/95 px-3 pt-3 backdrop-blur md:hidden"
                style={{
                    paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
                }}
            >
                <div
                    className={`mx-auto grid max-w-md gap-2 ${
                        submittedContact ? 'grid-cols-1' : 'grid-cols-2'
                    }`}
                >
                    <a
                        href={phoneHref}
                        className="flex min-h-12 items-center justify-center border border-[#d6ad63] text-sm font-bold tracking-wider text-[#d6ad63] focus-visible:ring-2 focus-visible:ring-white"
                    >
                        CALL NOW
                    </a>
                    {!submittedContact && (
                        <a
                            href="#estimate-form"
                            onClick={focusForm}
                            className="flex min-h-12 items-center justify-center bg-[#d6ad63] text-sm font-bold tracking-wider text-black focus-visible:ring-2 focus-visible:ring-white"
                        >
                            FREE ESTIMATE
                        </a>
                    )}
                </div>
            </nav>
        </main>
    );
}
