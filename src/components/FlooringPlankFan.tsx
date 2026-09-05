const planks = [
    { tone: '#d9c3a3', rotate: '-18deg', x: '-52px', y: '22px', delay: '0ms' },
    { tone: '#b99168', rotate: '-10deg', x: '-28px', y: '10px', delay: '90ms' },
    { tone: '#9b6f4f', rotate: '-3deg', x: '-8px', y: '2px', delay: '180ms' },
    { tone: '#7f593e', rotate: '5deg', x: '14px', y: '4px', delay: '270ms' },
    { tone: '#65442f', rotate: '12deg', x: '34px', y: '14px', delay: '360ms' },
    { tone: '#493225', rotate: '19deg', x: '54px', y: '30px', delay: '450ms' },
] as const;

export default function FlooringPlankFan({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`group relative mx-auto w-full ${compact ? 'max-w-md' : 'max-w-xl'}`} aria-hidden="true">
            <div className={`relative ${compact ? 'h-64' : 'h-[360px] sm:h-[430px]'}`}>
                <div className="absolute inset-x-[12%] bottom-3 h-16 rounded-[50%] bg-black/45 blur-2xl transition duration-700 group-hover:scale-110" />
                {planks.map((plank, index) => (
                    <div
                        key={plank.tone}
                        className="absolute bottom-8 left-1/2 origin-bottom overflow-hidden rounded-sm border border-white/10 shadow-2xl transition duration-700 ease-out group-hover:-translate-y-2"
                        style={{
                            width: compact ? '72px' : '92px',
                            height: compact ? '210px' : '300px',
                            background: `linear-gradient(90deg, rgba(255,255,255,.08), transparent 24%, rgba(0,0,0,.08) 72%), ${plank.tone}`,
                            transform: `translateX(calc(-50% + ${plank.x})) translateY(${plank.y}) rotate(${plank.rotate})`,
                            transitionDelay: plank.delay,
                            zIndex: index + 1,
                        }}
                    >
                        <div className="absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(92deg,transparent_0,transparent_14px,rgba(255,255,255,.12)_15px,transparent_17px),repeating-linear-gradient(7deg,transparent_0,transparent_34px,rgba(0,0,0,.13)_36px,transparent_39px)]" />
                        <div className="absolute inset-x-3 top-5 h-px bg-white/20" />
                        <div className="absolute inset-x-3 top-1/2 h-px bg-black/15" />
                    </div>
                ))}
                <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#d6ad63]/30 bg-black/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#f0c978] backdrop-blur">
                    LVP Style Preview
                </div>
            </div>
        </div>
    );
}
