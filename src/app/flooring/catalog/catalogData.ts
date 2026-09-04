export type FlooringTextureAsset = {
    src: string;
    label?: string;
};

export type FlooringProduct = {
    id: string;
    brand: string;
    collection: string;
    name: string;
    tone: 'Light' | 'Natural' | 'Warm' | 'Dark';
    construction: string;
    waterproof: boolean;
    model: string;
    thickness: string;
    wearLayer: string;
    plankSize: string;
    sourceUrl: string;
    sourceLabel: string;
    textureAssets: FlooringTextureAsset[];
};

// Verified against current manufacturer/retailer product pages in September 2026.
// Manufacturer photography is not copied into Moliora. textureAssets stays empty
// until Moliora has owned, licensed, dealer-provided or otherwise approved imagery.
export const flooringProducts: FlooringProduct[] = [
    {
        id: 'msi-cyrus2-brookings',
        brand: 'MSI',
        collection: 'Everlife • Cyrus 2.0',
        name: 'Brookings',
        tone: 'Light',
        construction: 'Rigid-core LVP',
        waterproof: true,
        model: 'VTRBROKIN7X48-5MM-20MIL',
        thickness: '5 mm',
        wearLayer: '20 MIL',
        plankSize: '7 × 48 in.',
        sourceUrl: 'https://www.msisurfaces.com/luxury-vinyl-planks/cyrus-2/brookings/',
        sourceLabel: 'MSI product page',
        textureAssets: [],
    },
    {
        id: 'msi-cyrus2-finely',
        brand: 'MSI',
        collection: 'Everlife • Cyrus 2.0',
        name: 'Finely',
        tone: 'Natural',
        construction: 'Rigid-core LVP',
        waterproof: true,
        model: 'VTRFINELY7X48-5MM-20MIL',
        thickness: '5 mm',
        wearLayer: '20 MIL',
        plankSize: '7 × 48 in.',
        sourceUrl: 'https://www.msisurfaces.com/luxury-vinyl-planks/cyrus-2/finely/',
        sourceLabel: 'MSI product page',
        textureAssets: [],
    },
    {
        id: 'msi-cyrus2-fauna',
        brand: 'MSI',
        collection: 'Everlife • Cyrus 2.0',
        name: 'Fauna',
        tone: 'Warm',
        construction: 'Rigid-core LVP',
        waterproof: true,
        model: 'VTRFAUNA7X48-5MM-20MIL',
        thickness: '5 mm',
        wearLayer: '20 MIL',
        plankSize: '7 × 48 in.',
        sourceUrl: 'https://www.msisurfaces.com/luxury-vinyl-planks/cyrus-2/fauna/',
        sourceLabel: 'MSI product page',
        textureAssets: [],
    },
    {
        id: 'lifeproof-sterling-oak',
        brand: 'LifeProof',
        collection: 'Luxury Vinyl Plank',
        name: 'Sterling Oak',
        tone: 'Natural',
        construction: 'Click-lock LVP',
        waterproof: true,
        model: 'I966106LP',
        thickness: 'Retailer-listed product',
        wearLayer: '22 MIL',
        plankSize: '8.7 × 48 in.',
        sourceUrl: 'https://www.homedepot.com/b/Flooring-Vinyl-Flooring-Vinyl-Plank-Flooring/Lifeproof/Vinyl-Plank/N-5yc1vZbzjzZnv7Z1z0w3du',
        sourceLabel: 'The Home Depot listing',
        textureAssets: [],
    },
    {
        id: 'lifeproof-dusk-cherry',
        brand: 'LifeProof',
        collection: 'Luxury Vinyl Plank',
        name: 'Dusk Cherry',
        tone: 'Dark',
        construction: 'Click-lock LVP',
        waterproof: true,
        model: 'I06204LP',
        thickness: 'Retailer-listed product',
        wearLayer: '22 MIL',
        plankSize: '8.7 × 48 in.',
        sourceUrl: 'https://www.homedepot.com/b/Flooring-Vinyl-Flooring-Vinyl-Plank-Flooring/Lifeproof/Vinyl-Plank/N-5yc1vZbzjzZnv7Z1z0w3du',
        sourceLabel: 'The Home Depot listing',
        textureAssets: [],
    },
    {
        id: 'lifeproof-pinecrest-place-oak',
        brand: 'LifeProof',
        collection: 'Luxury Vinyl Plank',
        name: 'Pinecrest Place Oak',
        tone: 'Warm',
        construction: 'Click-lock LVP',
        waterproof: true,
        model: 'I233111L',
        thickness: 'Retailer-listed product',
        wearLayer: '22 MIL',
        plankSize: '8.7 × 48 in.',
        sourceUrl: 'https://www.homedepot.com/b/Flooring-Vinyl-Flooring-Vinyl-Plank-Flooring/Lifeproof/N-5yc1vZbzjzZnv7',
        sourceLabel: 'The Home Depot listing',
        textureAssets: [],
    },
];
