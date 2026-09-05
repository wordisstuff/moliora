const planks = [
    { src: '/plank/1.png', rotate: '-19deg', x: '-58px', y: '24px', delay: '0ms' },
    { src: '/plank/2.png', rotate: '-11deg', x: '-34px', y: '11px', delay: '80ms' },
    { src: '/plank/3.png', rotate: '-4deg', x: '-11px', y: '3px', delay: '160ms' },
    { src: '/plank/4.png', rotate: '4deg', x: '13px', y: '4px', delay: '240ms' },
    { src: '/plank/5.png', rotate: '12deg', x: '36px', y: '15px', delay: '320ms' },
    { src: '/plank/6.png', rotate: '20deg', x: '58px', y: '31px', delay: '400ms' },
] as const;

export default function FlooringPlankFan({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`group relative mx-auto w-full ${compact ? 'max-w-md' : 'max-w-xl'}`} aria-hidden="true">
            <div className={`relative ${compact ? 'h-64' : 'h-[360px] sm:h-[430px]'}`}>
                <div className="absolute inset-x-[10%] bottom-4 h-20 rounded-[50%] bg-black/55 blur-2xl transition duration-700 group-hover:scale-110" />
                {planks.map((plank, index) => (
                    <div
                        key={plank.src}
                        className="absolute bottom-8 left-1/2 origin-bottom overflow-hidden rounded-[3px] border border-white/15 bg-cover bg-center shadow-[0_22px_55px_rgba(0,0,0,.42)] transition duration-700 ease-out group-hover:-translate-y-2"
                        style={{
                            width: compact ? '74px' : '94px',
                            height: compact ? '212px' : '304px',
                            backgroundImage: `url('${plank.src}')`,
                            transform: `translateX(calc(-50% + ${plank.x})) translateY(${plank.y}) rotate(${plank.rotate})`,
                            transitionDelay: plank.delay,
                            zIndex: index + 1,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/10" />
                    </div>
                ))}
                <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#d6ad63]/35 bg-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#f0c978] backdrop-blur-md">
                    LVP Style Preview
                </div>
            </div>
        </div>
    );
}
