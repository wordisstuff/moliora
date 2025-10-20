import Menu from '@/components/Menu/Menu';

export default function Home() {
    return (
        <div className="container mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-7 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="container">
                <Menu />
            </header>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
        </div>
    );
}
