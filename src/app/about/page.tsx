import Link from 'next/link';

export const metadata = {
    title: 'About — mOliora',
    description: 'About mOliora Home Services',
};

export default function AboutPage() {
    return (
        <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
            <section className="mx-auto max-w-3xl px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-serif mb-6">
                    About Us {/* Про нас */}
                </h1>

                <p className="leading-7 text-base md:text-lg mb-4">
                    At mOliora, we specialize in delivering top-quality home
                    services backed by years of experience in complex
                    technological processes.
                    {/* У mOliora ми спеціалізуємось на наданні високоякісних послуг для дому, спираючись на багаторічний досвід у складних технологічних процесах. */}
                </p>

                <p className="leading-7 text-base md:text-lg mb-4">
                    We believe in bringing innovative solutions to every
                    project, whether through our proficiency in 3D printing,
                    programming, or cutting-edge techniques.
                    {/* Ми віримо у впровадження інноваційних рішень у кожен проєкт — завдяки володінню 3D-друком, програмуванням і сучасними методами. */}
                </p>

                <p className="leading-7 text-base md:text-lg mb-4">
                    Our experience in technical fields has given us a deep
                    understanding of precision, efficiency, and craftsmanship,
                    which we apply to every home service we offer.
                    {/* Наш досвід у технічних сферах дав глибоке розуміння точності, ефективності та майстерності, які ми застосовуємо в кожній послузі для дому. */}
                </p>

                <p className="leading-7 text-base md:text-lg mb-8">
                    At mOliora, we’re committed to excellence, reliability, and
                    building trust with each client. We don’t just complete
                    projects — we provide solutions tailored to your unique
                    needs.
                    {/* У mOliora ми прагнемо до досконалості, надійності та довіри з кожним клієнтом. Ми не просто виконуємо проєкти — ми пропонуємо рішення під ваші унікальні потреби. */}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Кнопка “Назад” окремим клієнтським компонентом */}
                    <BackButton />

                    {/* Заклик зробити замовлення */}
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-medium
                        bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition"
                    >
                        Place Order {/* Зробити замовлення */}
                    </Link>
                </div>
            </section>
        </main>
    );
}

// 👇 імпорт клієнтського компонента (див. файл нижче)
import BackButton from '@/components/BackBtn';
