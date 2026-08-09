import mongoose from 'mongoose';

const COLLECTION = 'contactrequests';
const LEGACY_EMAIL_INDEX = 'email_1';
const shouldDropLegacyEmailIndex = process.argv.includes(
    '--drop-legacy-email-index',
);

function mongoUri() {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const host = process.env.MONGODB_URL;
    const database = process.env.MONGODB_DB;

    if (!user || !password || !host || !database) {
        throw new Error(
            'MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, and MONGODB_DB are required',
        );
    }

    return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?retryWrites=true&w=majority&appName=Cluster0`;
}

function validatorSummary(validator) {
    const jsonSchema = validator?.$jsonSchema;
    return {
        present: Boolean(validator && Object.keys(validator).length),
        requiredFields: Array.isArray(jsonSchema?.required)
            ? [...jsonSchema.required].sort()
            : [],
        schemaFields:
            jsonSchema?.properties && typeof jsonSchema.properties === 'object'
                ? Object.keys(jsonSchema.properties).sort()
                : [],
    };
}

let connected = false;
try {
    await mongoose.connect(mongoUri(), { maxPoolSize: 1 });
    connected = true;

    const database = mongoose.connection.db;
    if (!database) throw new Error('MongoDB connection has no selected database');

    const collectionInfo = await database
        .listCollections({ name: COLLECTION }, { nameOnly: false })
        .next();
    if (!collectionInfo) {
        throw new Error(`Collection ${COLLECTION} does not exist`);
    }

    const collection = database.collection(COLLECTION);
    const indexes = await collection.indexes();
    console.log(
        JSON.stringify({
            collection: COLLECTION,
            indexes: indexes.map(index => ({
                name: index.name,
                fields: Object.keys(index.key),
                unique: index.unique === true,
                sparse: index.sparse === true,
            })),
            validator: validatorSummary(collectionInfo.options?.validator),
        }),
    );

    if (shouldDropLegacyEmailIndex) {
        const legacyIndex = indexes.find(
            index => index.name === LEGACY_EMAIL_INDEX,
        );
        if (!legacyIndex) {
            console.log(`${LEGACY_EMAIL_INDEX} is already absent; no change made.`);
        } else {
            const fields = Object.keys(legacyIndex.key);
            if (
                legacyIndex.unique !== true ||
                fields.length !== 1 ||
                fields[0] !== 'email' ||
                legacyIndex.key.email !== 1
            ) {
                throw new Error(
                    `${LEGACY_EMAIL_INDEX} is not the expected unique ascending email index; refusing to drop it`,
                );
            }
            await collection.dropIndex(LEGACY_EMAIL_INDEX);
            console.log(`Dropped obsolete unique index ${LEGACY_EMAIL_INDEX}.`);
        }
    }
} finally {
    if (connected) await mongoose.disconnect();
}
