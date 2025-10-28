'use client';
import { useRef, useState, useTransition } from 'react';
import { submitContactForm } from '../actions/contactForm';

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [toast, setToast] = useState<{
        type: 'success' | 'error' | 'info';
        msg: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        setToast({ type: 'info', msg: 'Sending…' });

        // Honeypot: якщо поле "website" заповнили — не відправляємо
        if ((formData.get('website') as string)?.trim()) {
            setToast({ type: 'error', msg: 'Spam detected.' });
            return;
        }

        startTransition(async () => {
            try {
                const result = await submitContactForm(formData);
                if (result?.success) {
                    setToast({
                        type: 'success',
                        msg: '✅ Message sent successfully! We’ll get back within 1 business day.',
                    });
                    formRef.current?.reset();
                } else {
                    setToast({
                        type: 'error',
                        msg: result?.error || '❌ Failed to send message.',
                    });
                }
            } catch {
                setToast({
                    type: 'error',
                    msg: '❌ Unexpected error. Please try again later.',
                });
            }
        });
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {/* Hero */}
            <section className="mx-auto w-full max-w-5xl px-6 pt-16 pb-6">
                <p className="tracking-[0.2em] uppercase text-sm opacity-70">
                    Contact
                </p>
                <h1 className="mt-2 text-4xl md:text-5xl font-serif">
                    Tell us about your project
                </h1>
                <p className="mt-3 max-w-2xl opacity-80">
                    We’ll review your request and get back within one business
                    day.
                </p>
            </section>

            {/* Content grid */}
            <section className="mx-auto w-full max-w-5xl px-6 pb-20 grid gap-10 md:grid-cols-3">
                {/* Left: form */}
                <form
                    ref={formRef}
                    action={handleSubmit}
                    method="POST"
                    className="md:col-span-2 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-[color:var(--foreground)]/15"
                >
                    {/* Toast */}
                    <div aria-live="polite" className="sr-only">
                        {toast?.msg}
                    </div>
                    {toast && (
                        <div
                            className={`mb-4 rounded-lg border p-3 text-sm ${
                                toast.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                    : toast.type === 'error'
                                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                                    : 'bg-amber-50 border-amber-300 text-amber-900'
                            }`}
                        >
                            {toast.msg}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="grid gap-1">
                            <span className="text-sm uppercase tracking-wide opacity-70">
                                Full name
                            </span>
                            <input
                                name="name"
                                required
                                className="h-11 rounded-md px-3 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--foreground)]/30"
                                placeholder="John Smith"
                            />
                        </label>

                        <label className="grid gap-1">
                            <span className="text-sm uppercase tracking-wide opacity-70">
                                Phone
                            </span>
                            <input
                                name="phone"
                                inputMode="tel"
                                className="h-11 rounded-md px-3 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--foreground)]/30"
                                placeholder="(612) 555-0123"
                            />
                        </label>

                        <label className="grid gap-1">
                            <span className="text-sm uppercase tracking-wide opacity-70">
                                Email
                            </span>
                            <input
                                name="email"
                                type="email"
                                required
                                className="h-11 rounded-md px-3 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--foreground)]/30"
                                placeholder="you@example.com"
                            />
                        </label>

                        <label className="grid gap-1">
                            <span className="text-sm uppercase tracking-wide opacity-70">
                                City / ZIP
                            </span>
                            <input
                                name="location"
                                className="h-11 rounded-md px-3 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--foreground)]/30"
                                placeholder="Minneapolis, 55401"
                            />
                        </label>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="grid gap-1">
                            <span className="text-sm uppercase tracking-wide opacity-70">
                                Service
                            </span>
                            <select
                                name="service"
                                className="h-11 rounded-md px-3 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20"
                            >
                                <option>Drywall & Painting</option>
                                <option>Flooring</option>
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Other</option>
                            </select>
                        </label>

                        <label className="grid gap-1">
                            <span className="text-sm uppercase tracking-wide opacity-70">
                                Budget (optional)
                            </span>
                            <select
                                name="budget"
                                className="h-11 rounded-md px-3 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20"
                            >
                                <option>Under $1,000</option>
                                <option>$1,000 – $5,000</option>
                                <option>$5,000 – $15,000</option>
                                <option>$15,000+</option>
                            </select>
                        </label>
                    </div>

                    <label className="grid gap-1 mt-4">
                        <span className="text-sm uppercase tracking-wide opacity-70">
                            Project details
                        </span>
                        <textarea
                            name="message"
                            rows={5}
                            required
                            className="rounded-md px-3 py-2 bg-white/80 dark:bg-black/20 border border-[color:var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--foreground)]/30"
                            placeholder="Tell us about the scope, timeline, and any photos/links…"
                        />
                    </label>

                    {/* Honeypot (приховане поле) */}
                    <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                    />

                    <div className="mt-4 flex items-center gap-2">
                        <input
                            id="agree"
                            type="checkbox"
                            required
                            className="size-4 accent-[color:var(--foreground)]"
                        />
                        <label htmlFor="agree" className="text-sm opacity-80">
                            I agree to be contacted about my request.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-6 h-11 px-6 rounded-md bg-[color:var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
                        {isPending ? 'Sending…' : 'Send request'}
                    </button>
                    <p className="mt-2 text-xs opacity-70">
                        Response within 1 business day.
                    </p>
                </form>

                {/* Right: contact info / hours (без змін) */}
                <aside className="space-y-6">
                    <div className="rounded-xl p-6 border border-[color:var(--foreground)]/15 bg-white/50 dark:bg-white/5">
                        <h3 className="font-serif text-2xl">Get in touch</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <span className="opacity-70">Phone:</span>{' '}
                                <a
                                    className="underline-offset-2 hover:underline"
                                    href="tel:+16124683176"
                                >
                                    +1 (612) 468-3176
                                </a>
                            </li>
                            <li>
                                <span className="opacity-70">Email:</span>{' '}
                                <a
                                    className="underline-offset-2 hover:underline"
                                    href="mailto:wordisstuff@gmail.com"
                                >
                                    wordisstuff@gmail.com
                                </a>
                            </li>
                            <li>
                                <span className="opacity-70">
                                    Service area:
                                </span>{' '}
                                Minneapolis–St. Paul, MN
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl p-6 border border-[color:var(--foreground)]/15 bg-white/50 dark:bg-white/5">
                        <h3 className="font-serif text-2xl">Hours</h3>
                        <ul className="mt-3 space-y-1">
                            <li>Mon–Fri: 8:00–18:00</li>
                            <li>Sat: 9:00–14:00</li>
                            <li>Sun: by appointment</li>
                        </ul>
                    </div>

                    <div className="rounded-xl p-6 border border-[color:var(--foreground)]/15 bg-white/50 dark:bg-white/5">
                        <h3 className="font-serif text-2xl">
                            Licensed & Insured
                        </h3>
                        <p className="mt-2 opacity-80 text-sm">
                            Documentation available upon request.
                        </p>
                    </div>
                </aside>
            </section>

            {/* CTA strip */}
            <section className="border-t border-[color:var(--foreground)]/15">
                <div className="mx-auto w-full max-w-5xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <p className="uppercase tracking-[0.2em] text-sm opacity-70">
                            Free estimate
                        </p>
                        <h4 className="font-serif text-2xl">
                            Ready to start your home project?
                        </h4>
                    </div>
                    <a
                        href="tel:+16124683176"
                        className="h-11 px-6 rounded-md bg-[color:var(--foreground)] text-[var(--background)] flex items-center justify-center"
                    >
                        Call now
                    </a>
                </div>
            </section>
        </main>
    );
}
