'use client';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="h-10 px-4 rounded-md bg-[color:var(--foreground)] text-[color:var(--background)] text-sm font-medium hover:opacity-90 transition"
        >
            Print / Save as PDF
        </button>
    );
}
