import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/context/themeContext';
import Menu from '@/components/Menu/Menu';
import Providers from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://moliora.us'),
    title: {
        default: 'mOliora — Home Services',
        template: 'mOliora — %s',
    },
    description:
        'Reliable home improvement and repair in Minneapolis–St. Paul: drywall & painting, flooring, plumbing, electrical. Free estimates. Licensed & insured.',
    keywords: [
        'home services',
        'home improvement',
        'general contractor',
        'remodeling',
        'drywall',
        'painting',
        'flooring',
        'plumbing',
        'electrical',
        'Minneapolis',
        'St Paul',
        'Minnesota',
    ],
    applicationName: 'mOliora',
    authors: [{ name: 'mOliora Home Services' }],
    alternates: {
        canonical: 'https://moliora.us/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'mOliora',
        title: 'mOliora — Your Home Service Partner',
        description:
            'Trusted renovations and repairs in Minneapolis–St. Paul. Free estimates.',
        url: 'https://moliora.us/',
        images: [
            // Можеш пізніше покласти /public/og.png — поки що посилання валідне
            {
                url: 'https://moliora.us/og.png',
                width: 1200,
                height: 630,
                alt: 'mOliora — Home Services',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'mOliora — Your Home Service Partner',
        description:
            'Reliable home improvement and repair in Minneapolis–St. Paul.',
        images: ['https://moliora.us/og.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },
    category: 'home services',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
        shortcut: ['/favicon.ico'],
    },
    manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f5e8d9' },
        { media: '(prefers-color-scheme: dark)', color: '#3f3a2e' },
    ],
};
export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    // У твоїй версії Next cookies() — async:
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get('theme')?.value as
        | 'light'
        | 'dark'
        | undefined;
    const initialTheme = themeCookie ?? 'light';

    // JSON-LD (Local Business / Home & Construction)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: 'mOliora Home Services',
        url: 'https://moliora.us',
        telephone: '+16124683176',
        email: 'wordisstuff@gmail.com',
        areaServed: ['Minneapolis', 'St. Paul', 'Minnesota'],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Minneapolis',
            addressRegion: 'MN',
            addressCountry: 'US',
        },
        openingHours: 'Mo-Fr 08:00-18:00, Sa 09:00-14:00',
        image: 'https://moliora.us/icon.svg',
        makesOffer: [
            {
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: 'Drywall & Painting' },
            },
            {
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: 'Flooring' },
            },
            {
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: 'Plumbing' },
            },
            {
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: 'Electrical' },
            },
        ],
    };

    return (
        <html lang="en" className={initialTheme} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                id="top"
            >
                {/* JSON-LD Schema.org */}
                {/* JSON-LD Schema.org */}
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd, null, 2),
                    }}
                ></script>
                {/* THEME PROVIDER + NAV */}
                <Providers>
                    <ThemeProvider>
                        <header className="container">
                            <Menu />
                        </header>
                        {children}
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
