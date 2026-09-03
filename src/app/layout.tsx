import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/context/themeContext';
import Menu from '@/components/Menu/Menu';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Providers from './providers';
import { email, phoneE164 } from '@/config/company';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://moliora.us'),
    title: {
        default: 'Moliora Construction',
        template: 'Moliora Construction | %s',
    },
    description:
        'Windows, doors, remodeling, flooring and exterior construction services in Minneapolis–St. Paul, Minnesota.',
    keywords: [
        'construction company',
        'window installation',
        'door installation',
        'deck repair',
        'LVP flooring installation',
        'remodeling',
        'exterior services',
        'general contractor',
        'Minneapolis',
        'St Paul',
        'Minnesota',
    ],
    applicationName: 'Moliora Construction',
    authors: [{ name: 'Moliora Construction' }],
    alternates: { canonical: 'https://moliora.us/' },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Moliora Construction',
        title: 'Moliora Construction',
        description: 'Modern construction, flooring and exterior services in Minnesota.',
        url: 'https://moliora.us/',
        images: [
            {
                url: 'https://moliora.us/og.png',
                width: 1200,
                height: 630,
                alt: 'Moliora Construction',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Moliora Construction',
        description: 'Modern construction, flooring and remodeling services in Minnesota.',
        images: ['https://moliora.us/og.png'],
    },
    robots: { index: true, follow: true },
    category: 'construction',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f5e8d9' },
        { media: '(prefers-color-scheme: dark)', color: '#3f3a2e' },
    ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get('theme')?.value as 'light' | 'dark' | undefined;
    const initialTheme = themeCookie ?? 'light';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: 'Moliora Construction',
        url: 'https://moliora.us',
        telephone: phoneE164,
        email,
        areaServed: ['Minneapolis', 'St. Paul', 'Anoka', 'Ramsey', 'Minnesota'],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Minneapolis',
            addressRegion: 'MN',
            addressCountry: 'US',
        },
        openingHours: 'Mo-Fr 08:00-18:00, Sa 09:00-14:00',
        image: 'https://moliora.us/icon.svg',
        makesOffer: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Window Installation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Door Installation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Deck Repair' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'LVP Flooring Installation' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Exterior Remodeling' } },
        ],
    };

    return (
        <html lang="en" className={initialTheme} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} id="top">
                <GoogleAnalytics />
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
                />
                <Providers>
                    <ThemeProvider>
                        <Menu />
                        {children}
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
