export type FlooringProduct = {
    id: string;
    brand: string;
    collection: string;
    name: string;
    tone: 'Light' | 'Natural' | 'Warm' | 'Dark';
    construction: string;
    waterproof: boolean;
    status: 'sample' | 'planned';
};

// Catalog foundation only. Product imagery/specifications should be added from
// manufacturer-authorized assets after Moliora receives supplier permission.
export const flooringProducts: FlooringProduct[] = [
    { id: 'msi-everlife-light', brand: 'MSI', collection: 'Everlife', name: 'Light Oak Options', tone: 'Light', construction: 'Luxury vinyl plank', waterproof: true, status: 'planned' },
    { id: 'msi-everlife-natural', brand: 'MSI', collection: 'Everlife', name: 'Natural Oak Options', tone: 'Natural', construction: 'Luxury vinyl plank', waterproof: true, status: 'planned' },
    { id: 'msi-everlife-warm', brand: 'MSI', collection: 'Everlife', name: 'Warm Wood Options', tone: 'Warm', construction: 'Luxury vinyl plank', waterproof: true, status: 'planned' },
    { id: 'coretec-premium', brand: 'COREtec', collection: 'Premium LVP', name: 'Premium Wood Looks', tone: 'Natural', construction: 'Luxury vinyl plank', waterproof: true, status: 'planned' },
    { id: 'lifeproof-value', brand: 'LifeProof', collection: 'LVP', name: 'Value & Customer-Supplied Options', tone: 'Natural', construction: 'Luxury vinyl plank', waterproof: true, status: 'planned' },
];
