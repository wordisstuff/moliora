import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const base = 'https://moliora.us';

    return [
        { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
        { url: `${base}/flooring/lvp`, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${base}/flooring/catalog`, changeFrequency: 'monthly', priority: 0.75 },
        { url: `${base}/flooring/design`, changeFrequency: 'monthly', priority: 0.65 },
        { url: `${base}/services`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    ];
}
