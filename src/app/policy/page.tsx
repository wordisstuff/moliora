'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PrivacyPolicy() {
    const router = useRouter();

    const [email, setEmail] = useState('');

    useEffect(() => {
        const emailUser = 'support';
        const emailDomain = 'moliora.us';
        setEmail(`${emailUser}@${emailDomain}`);
    }, []);
    const handleAgree = () => {
        // зберігаємо “згоду” в localStorage (опціонально)
        localStorage.setItem('privacyAgreed', 'true');
        router.back(); // повертаємось на попередню сторінку (форму)
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="min-h-screen flex flex-col justify-centr bg-[var(--background)] text-[var(--foreground)] p-8">
            <section className="max-w-3xl mx-auto mt-10">
                <h1 className="text-3xl font-serif mb-6">Privacy Policy</h1>
                <p className="mb-4 leading-relaxed">
                    At <strong>mOliora Home Services</strong>, we respect your
                    privacy. Any personal information you share through our
                    contact form — such as your name, phone number, or email —
                    is used solely to respond to your inquiry.
                </p>
                <p className="mb-4 leading-relaxed">
                    We do not store or share your data with third parties. By
                    proceeding, you consent to us contacting you regarding your
                    request.
                </p>
                {/* =============================== */}
                {/* 🍪 Cookies Section */}
                {/* =============================== */}
                <h2 className="text-2xl font-serif mt-8 mb-3">
                    🍪 Cookies and Tracking
                </h2>
                <p className="leading-relaxed pb-3">
                    mOliora Home Services does{' '}
                    <strong>not use cookies or tracking technologies</strong> on
                    this website. We do not collect analytical, advertising, or
                    profiling data. Any information you provide through our
                    contact form is used solely to respond to your inquiry and
                    is not stored or shared beyond that purpose.
                </p>

                {/* 🇺🇦 Ukrainian version (commented out for now)
  <h2 className="text-2xl font-serif mt-8 mb-3">🍪 Файли cookie та відстеження</h2>
  <p className="leading-relaxed">
    Сайт <strong>mOliora Home Services</strong> <strong>не використовує файли cookie</strong> чи технології відстеження.
    Ми не збираємо аналітичні, рекламні чи профільні дані.
    Уся інформація, яку ви надсилаєте через контактну форму, використовується лише для відповіді на ваш запит
    і не зберігається та не передається третім сторонам.
  </p>
  */}

                <p className="leading-relaxed">
                    If you have any questions, please contact us at{' '}
                    <a
                        href={email}
                        className="underline hover:text-[var(--accent-zap)]"
                    >
                        {email}
                    </a>
                    .
                </p>
            </section>

            {/* Кнопки дій */}
            <div className="flex justify-center gap-4 mt-12 mb-10">
                <button
                    onClick={handleAgree}
                    className="px-6 py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)]
                        hover:opacity-90 transition font-medium cursor-pointer"
                >
                    I Agree
                </button>
                <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-lg border border-[var(--foreground)]
                        text-[var(--foreground)] bg-transparent hover:bg-[color:var(--foreground)/0.6)]
                        transition font-medium cursor-pointer"
                >
                    Go Back
                </button>
            </div>
        </main>
    );
}
