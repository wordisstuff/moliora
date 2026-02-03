'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SCM.module.css';
import { SERVICES } from '../../app/constants/consts.js';

type Service = {
    id: string;
    title: string;
    subtitle: string;
    tags?: string[];
    bullets?: string[];
    coverUrl: string;
    galleryUrls?: string[];
};

const TYPED_SERVICES = SERVICES as Service[];

function clampIndex(i: number, len: number): number {
    if (!len) return 0;
    return ((i % len) + len) % len;
}

export default function ServicesCarouselModal() {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const [openId, setOpenId] = useState<string | null>(null);
    const [activeImg, setActiveImg] = useState<number>(0);

    // для ефекту “центр більший”
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const activeService = useMemo<Service | null>(() => {
        return TYPED_SERVICES?.find(s => s.id === openId) ?? null;
    }, [openId]);

    useEffect(() => {
        if (!openId) return;

        const body = document.body;

        // Save current scroll position
        const scrollY = window.scrollY;

        // Lock body
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';

        return () => {
            // Restore body
            const y = Math.abs(parseInt(body.style.top || '0', 10)) || scrollY;

            body.style.position = '';
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';
            body.style.width = '';
            body.style.overflow = '';

            window.scrollTo(0, y);
        };
    }, [openId]);
    // Reset image index when modal opens
    useEffect(() => {
        if (openId) setActiveImg(0);
    }, [openId]);

    // ESC + arrow navigation inside modal
    useEffect(() => {
        if (!openId) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenId(null);

            if (!activeService) return;
            const len = activeService.galleryUrls?.length ?? 0;
            if (!len) return;

            if (e.key === 'ArrowRight')
                setActiveImg(v => clampIndex(v + 1, len));
            if (e.key === 'ArrowLeft')
                setActiveImg(v => clampIndex(v - 1, len));
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [openId, activeService]);

    // Визначаємо, яка картка найближча до центру scroller (для cardActive/cardSide/cardFar)
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const calcActive = () => {
            const cards = Array.from(
                el.querySelectorAll<HTMLElement>('[data-card="service"]'),
            );
            if (!cards.length) return;

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;

            let bestIdx = 0;
            let bestDist = Number.POSITIVE_INFINITY;

            for (let i = 0; i < cards.length; i++) {
                const r = cards[i].getBoundingClientRect();
                const cardCenter = r.left + r.width / 2;
                const dist = Math.abs(centerX - cardCenter);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = i;
                }
            }

            setActiveIndex(bestIdx);
        };

        let rafId = 0;
        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(calcActive);
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        // ініціалізуємо після першого рендера
        calcActive();

        return () => {
            el.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    const scrollByCards = (dir: -1 | 1) => {
        const el = scrollerRef.current;
        if (!el) return;

        const card = el.querySelector<HTMLElement>('[data-card="service"]');
        const cardW = card?.offsetWidth ?? 280;

        el.scrollBy({
            left: dir * (cardW + 16),
            behavior: 'smooth',
        });
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Our Services</h2>
                <p className={styles.subtitle}>
                    Swipe to browse. Tap a service to see details and examples.
                </p>
            </div>

            <div className={styles.carouselWrap}>
                <button
                    className={styles.arrowBtn}
                    onClick={() => scrollByCards(-1)}
                    aria-label="Scroll left"
                    type="button"
                >
                    ‹
                </button>

                <div className={styles.scroller} ref={scrollerRef}>
                    {Array.isArray(TYPED_SERVICES) &&
                        TYPED_SERVICES.map((s, idx) => {
                            const dist = Math.abs(idx - activeIndex);

                            const cardClassName = [
                                styles.card,
                                dist === 0 ? styles.cardActive : '',
                                dist === 1 ? styles.cardSide : '',
                                dist >= 2 ? styles.cardFar : '',
                            ]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <button
                                    key={s.id}
                                    data-card="service"
                                    className={cardClassName}
                                    type="button"
                                    onClick={() => setOpenId(s.id)}
                                    aria-label={`Open ${s.title}`}
                                >
                                    <div
                                        className={styles.cover}
                                        style={{
                                            backgroundImage: `url(${s.coverUrl})`,
                                        }}
                                    />
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTitle}>
                                            {s.title}
                                        </div>
                                        <div className={styles.cardSubtitle}>
                                            {s.subtitle}
                                        </div>

                                        <div className={styles.tagRow}>
                                            {(s.tags ?? [])
                                                .slice(0, 3)
                                                .map(tag => (
                                                    <span
                                                        key={tag}
                                                        className={styles.tag}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                </div>

                <button
                    className={styles.arrowBtn}
                    onClick={() => scrollByCards(1)}
                    aria-label="Scroll right"
                    type="button"
                >
                    ›
                </button>
            </div>

            {/* ===== Modal ===== */}
            {activeService && (
                <div
                    className={styles.backdrop}
                    role="dialog"
                    aria-modal="true"
                    onMouseDown={e => {
                        if (e.target === e.currentTarget) setOpenId(null);
                    }}
                >
                    <div className={styles.modal}>
                        <div className={styles.modalTop}>
                            <div>
                                <div className={styles.modalTitle}>
                                    {activeService.title}
                                </div>
                                <div className={styles.modalSubtitle}>
                                    {activeService.subtitle}
                                </div>
                            </div>

                            <button
                                className={styles.closeBtn}
                                onClick={() => setOpenId(null)}
                                aria-label="Close"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalGrid}>
                            {/* Left: viewer */}
                            <div className={styles.viewer}>
                                <div
                                    className={styles.viewerImg}
                                    style={{
                                        backgroundImage: `url(${
                                            activeService.galleryUrls?.[
                                                activeImg
                                            ] ?? activeService.coverUrl
                                        })`,
                                    }}
                                />

                                <div className={styles.viewerControls}>
                                    <button
                                        className={styles.ctrlBtn}
                                        type="button"
                                        onClick={() => {
                                            const len =
                                                activeService.galleryUrls
                                                    ?.length ?? 0;
                                            setActiveImg(v =>
                                                clampIndex(v - 1, len),
                                            );
                                        }}
                                        aria-label="Previous image"
                                    >
                                        ‹
                                    </button>

                                    <div className={styles.counter}>
                                        {Math.min(
                                            activeImg + 1,
                                            activeService.galleryUrls?.length ??
                                                1,
                                        )}{' '}
                                        /{' '}
                                        {activeService.galleryUrls?.length ?? 1}
                                    </div>

                                    <button
                                        className={styles.ctrlBtn}
                                        type="button"
                                        onClick={() => {
                                            const len =
                                                activeService.galleryUrls
                                                    ?.length ?? 0;
                                            setActiveImg(v =>
                                                clampIndex(v + 1, len),
                                            );
                                        }}
                                        aria-label="Next image"
                                    >
                                        ›
                                    </button>
                                </div>

                                <div className={styles.thumbRow}>
                                    {(activeService.galleryUrls ?? []).map(
                                        (url, idx) => (
                                            <button
                                                key={`${url}-${idx}`}
                                                type="button"
                                                className={`${styles.thumb} ${idx === activeImg ? styles.thumbActive : ''}`}
                                                style={{
                                                    backgroundImage: `url(${url})`,
                                                }}
                                                onClick={() =>
                                                    setActiveImg(idx)
                                                }
                                                aria-label={`Open image ${idx + 1}`}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Right: details */}
                            <div className={styles.details}>
                                <div className={styles.includesTitle}>
                                    What’s included
                                </div>

                                <ul className={styles.ul}>
                                    {(activeService.bullets ?? []).map(b => (
                                        <li key={b} className={styles.li}>
                                            {b}
                                        </li>
                                    ))}
                                </ul>

                                <a href="/contact" className={styles.cta}>
                                    Get a quote
                                </a>

                                <div className={styles.note}>
                                    Minneapolis–St. Paul • Fast response • Clean
                                    work
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
