const planks = [
    { base: '#dbc8aa', grain: '#a98c68', rotate: '-19deg', x: '-58px', y: '24px', delay: '0ms' },
    { base: '#c6a67d', grain: '#8d6848', rotate: '-11deg', x: '-34px', y: '11px', delay: '80ms' },
    { base: '#b58b61', grain: '#765238', rotate: '-4deg', x: '-11px', y: '3px', delay: '160ms' },
    { base: '#9f7652', grain: '#65452f', rotate: '4deg', x: '13px', y: '4px', delay: '240ms' },
    { base: '#7d573d', grain: '#493225', rotate: '12deg', x: '36px', y: '15px', delay: '320ms' },
    { base: '#52382a', grain: '#2f211a', rotate: '20deg', x: '58px', y: '31px', delay: '400ms' },
] as const;

export default function FlooringPlankFan({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`group relative mx-auto w-full ${compact ? 'max-w-md' : 'max-w-xl'}`} aria-hidden="true">
            <div className={`relative ${compact ? 'h-64' : 'h-[360px] sm:h-[430px]'}`}>
                <div className="absolute inset-x-[10%] bottom-4 h-20 rounded-[50%] bg-black/55 blur-2xl transition duration-700 group-hover:scale-110" />
                {planks.map((plank, index) => (
                    <div
                        key={plank.base}
                        className="absolute bottom-8 left-1/2 origin-bottom overflow-hidden rounded-[3px] border border-white/15 shadow-[0_22px_55px_rgba(0,0,0,.42)] transition duration-700 ease-out group-hover:-translate-y-2"
                        style={{
                            width: compact ? '74px' : '94px',
                            height: compact ? '212px' : '304px',
                            backgroundColor: plank.base,
                            backgroundImage: `
                                radial-gradient(ellipse at 22% 18%, transparent 0 18%, ${plank.grain}55 19% 20%, transparent 21% 32%, ${plank.grain}3d 33% 34%, transparent 35%),
                                radial-gradient(ellipse at 74% 62%, transparent 0 20%, ${plank.grain}4d 21% 22%, transparent 23% 38%, ${plank.grain}38 39% 40%, transparent 41%),
                                repeating-linear-gradient(94deg, transparent 0 9px, ${plank.grain}22 10px, transparent 12px, transparent 21px),
                                linear-gradient(90deg, rgba(255,255,255,.18), transparent 22%, rgba(0,0,0,.10) 78%, rgba(255,255,255,.05))
                            `,
                            backgroundSize: '150% 115%, 145% 125%, 100% 100%, 100% 100%',
                            transform: `translateX(calc(-50% + ${plank.x})) translateY(${plank.y}) rotate(${plank.rotate})`,
                            transitionDelay: plank.delay,
                            zIndex: index + 1,
                        }}
                    >
                        <div className="absolute inset-x-0 top-[31%] h-px bg-black/12" />
                        <div className="absolute inset-x-0 top-[64%] h-px bg-black/10" />
                        <div className="absolute inset-y-0 left-2 w-px bg-white/10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />
                    </div>
                ))}
                <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#d6ad63]/35 bg-black/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#f0c978] backdrop-blur-md">
                    LVP Style Preview
                </div>
            </div>
        </div>
    );
}
