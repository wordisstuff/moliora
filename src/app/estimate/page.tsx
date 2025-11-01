import Image from 'next/image';
import PrintButton from '@/components/PrintButton';

type Line = {
    no: number;
    description: string;
    unit: 'ft²' | 'lf' | 'ea' | string;
    qty: number | string;
    rate: number; // USD
    total: number; // USD (qty * rate) — можна прораховувати динамічно
};

const currency = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function EstimatePage() {
    // ----- ЗАМІНИ ДАНІ НИЖЧЕ ПІД КОНКРЕТНИЙ ЕСТІМЕЙТ -----
    const billTo = {
        name: 'Ann Becker',
        address1: '393 Herschel St, St Paul MN 55104',
        phone: '651',
    };

    const company = {
        name: 'mOliora LLC',
        email: 'support',
        phone: '612',
        website: 'www.moliora.us',
        estimateNo: 'EST-91625-3-V2',
    };

    const scope =
        'Remove existing deck boards and install new AC2 2×6 pressure treated (PT) decking on the existing frame; replace 4 stair treads; apply one coat of semi-transparent stain after PT lumber acclimates; perform railing repair and partial replacement as noted. No structural framing changes included.';

    const lines: Line[] = [
        {
            no: 1,
            description: 'Decking replacement (remove & install new PT 2×6)',
            unit: 'ft²',
            qty: 12,
            rate: 50.0,
            total: 600.0,
        },
        {
            no: 2,
            description:
                'Stain – deck + stair treads (one coat, semi-transparent)',
            unit: 'ft²',
            qty: 60,
            rate: 4.0,
            total: 240.0,
        },
        {
            no: 3,
            description: 'Replace stair treads (PT)',
            unit: 'ea',
            qty: 6,
            rate: 35.0,
            total: 210.0,
        },
        {
            no: 4,
            description: 'Partial railing replacement (PT rails + balusters)',
            unit: 'lf',
            qty: 10,
            rate: 42.0,
            total: 420.0,
        },
    ];

    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    const cardFee = Math.round(subtotal * 0.035 * 100) / 100; // 3.5% як у макеті
    const totalDue = subtotal; // у прикладі на фото підсумок = 1400.00. За потреби додай cardFee.
    // ------------------------------------------------------

    return (
        <main className="bg-[color:var(--background)] text-[color:var(--foreground)] min-h-screen print:bg-white print:text-black">
            <section className="mx-auto w-full max-w-4xl p-6 md:p-10">
                {/* Верхня панель: логотип + кнопка друку */}
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="mOliora"
                            width={120}
                            height={32}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                    </div>
                    <PrintButton />
                </div>

                {/* Хедер документа */}
                <div className="rounded-xl border border-[color:var(--foreground)]/15 overflow-hidden bg-white/60 dark:bg-white/5">
                    {/* Блакитно-сірий хедер з правим блоком "Estimate" */}
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-12 md:col-span-7 p-6">
                            <Image
                                src="/logo.png"
                                alt="mOliora"
                                width={150}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-5 p-6 bg-neutral-800/80 text-white">
                            <h2 className="text-2xl font-semibold tracking-wide">
                                Estimate
                            </h2>
                            <div className="mt-4 text-sm space-y-1 opacity-90">
                                <p>
                                    <span className="opacity-80">Company:</span>{' '}
                                    {company.name}
                                </p>
                                <p>
                                    <span className="opacity-80">Email:</span>{' '}
                                    {company.email}
                                </p>
                                <p>
                                    <span className="opacity-80">Phone:</span>{' '}
                                    {company.phone}
                                </p>
                                <p>
                                    <span className="opacity-80">
                                        Web site:
                                    </span>{' '}
                                    {company.website}
                                </p>
                                <p>
                                    <span className="opacity-80">
                                        Estimate #:
                                    </span>{' '}
                                    {company.estimateNo}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bill to + Project description */}
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs tracking-[0.18em] uppercase opacity-70">
                                    Billed to:
                                </p>
                                <div className="mt-2 text-sm">
                                    <p className="font-semibold">
                                        {billTo.name}
                                    </p>
                                    <p>{billTo.address1}</p>
                                    <p>{billTo.phone}</p>
                                </div>
                            </div>
                            <div />
                        </div>

                        <h3 className="mt-6 text-center font-semibold">
                            Project Description
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed opacity-90 text-center">
                            {scope}
                        </p>

                        {/* Таблиця ЛЕЙБЛІВ */}
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-neutral-800/90 text-white">
                                        <th className="p-2 text-left w-12">
                                            No.
                                        </th>
                                        <th className="p-2 text-left">
                                            Description
                                        </th>
                                        <th className="p-2 text-center">
                                            Area ({'ft²'})
                                        </th>
                                        <th className="p-2 text-right">
                                            Rate ($)
                                        </th>
                                        <th className="p-2 text-right">
                                            Total Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lines.map(l => (
                                        <tr
                                            key={l.no}
                                            className="odd:bg-white/70 dark:odd:bg-white/5"
                                        >
                                            <td className="p-2 align-top">
                                                {l.no}
                                            </td>
                                            <td className="p-2 align-top">
                                                {l.description}
                                            </td>
                                            <td className="p-2 text-center align-top">
                                                {typeof l.qty === 'number'
                                                    ? l.qty
                                                    : l.qty}{' '}
                                                <span className="opacity-70">
                                                    {l.unit}
                                                </span>
                                            </td>
                                            <td className="p-2 text-right align-top">
                                                {currency(l.rate)}
                                            </td>
                                            <td className="p-2 text-right align-top font-medium">
                                                {currency(l.total)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-2 text-right font-semibold"
                                        >
                                            Total
                                        </td>
                                        <td className="p-2 text-right font-semibold">
                                            {currency(subtotal)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Summary of charges */}
                        <div className="mt-8 rounded-lg overflow-hidden border border-[color:var(--foreground)]/15">
                            <div className="bg-neutral-800/90 text-white p-3 font-medium">
                                SUMMARY OF CHARGES
                            </div>
                            <div className="divide-y divide-[color:var(--foreground)]/10">
                                <div className="flex items-center justify-between p-3 text-sm">
                                    <span>Part Description</span>
                                    <span className="font-medium">
                                        {currency(subtotal)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 text-xs opacity-80">
                                    <span>
                                        Add 3.50% for Visa/Mastercard payment
                                    </span>
                                    <span>{currency(cardFee)}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 text-base font-semibold">
                                    <span>Total Due</span>
                                    <span>{currency(totalDue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes & Conditions */}
                        <div className="mt-6 text-xs leading-5 opacity-85">
                            <p className="font-semibold mb-1">
                                Notes and Conditions:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    Pricing assumes existing framing is sound
                                    and reusable; damaged joists/posts
                                    identified during demolition will be quoted
                                    separately.
                                </li>
                                <li>
                                    Materials are pressure treated (PT) Southern
                                    Pine decking and railing components unless
                                    otherwise specified.
                                </li>
                                <li>
                                    No permit assumed for resurfacing only (no
                                    structural changes). Verify local
                                    requirements if conditions change.
                                </li>
                                <li>
                                    Railing partial replacement priced for
                                    straight sections; custom angles, stair rail
                                    section, or new posts may affect cost.
                                </li>
                                <li>
                                    PT lumber requires 2–6 weeks to
                                    acclimate/dry before staining; schedule will
                                    account for weather.
                                </li>
                                <li>
                                    Payment term: 25% deposit, balance upon
                                    completion.
                                </li>
                            </ul>
                        </div>

                        {/* План-схема (плейсхолдер SVG) */}
                        <div className="mt-8">
                            <div className="text-sm font-medium mb-2">
                                Plan (not to scale)
                            </div>
                            <div className="rounded-lg border border-[color:var(--foreground)]/20 bg-white/70 dark:bg-white/5 p-4">
                                {/* Простий SVG, підстав свій PNG/SVG за потреби */}
                                <svg
                                    viewBox="0 0 480 260"
                                    className="w-full h-auto"
                                >
                                    <rect
                                        x="40"
                                        y="40"
                                        width="300"
                                        height="140"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <rect
                                        x="40"
                                        y="180"
                                        width="80"
                                        height="40"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <rect
                                        x="340"
                                        y="100"
                                        width="100"
                                        height="80"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <text
                                        x="190"
                                        y="120"
                                        textAnchor="middle"
                                        fontSize="14"
                                    >
                                        154 sq ft
                                    </text>
                                    <text
                                        x="80"
                                        y="205"
                                        textAnchor="middle"
                                        fontSize="12"
                                    >
                                        18 sq ft
                                    </text>
                                </svg>
                            </div>
                        </div>

                        {/* Футер */}
                        <div className="mt-8 border-t border-[color:var(--foreground)]/10 pt-4 text-center text-xs opacity-70">
                            © {new Date().getFullYear()} mOliora Home Services •
                            Minneapolis–St. Paul, MN
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
