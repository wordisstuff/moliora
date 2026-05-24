import { Schema, model, models, Document } from 'mongoose';

type ServiceStatus = 'new' | 'in-progress' | 'done';

interface ServiceEntry {
    type: string;
    note?: string;
    budgets: string[];
    date: Date;
    status: ServiceStatus;
    photos: string[];
}

export interface UserDoc extends Document {
    name: string;
    phone: string;
    email: string;
    address: string | null;
    note: string | null;
    photo: string | null;
    activeTime: number;
    verifyByEmail: boolean;
    token: string | null;
    verifyToken: string | null;
    service: ServiceEntry[];
    budgets: string[];
    privacy: {
        consent: boolean;
        consentAt?: Date;
        ip?: string;
        userAgent?: string;
        version?: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema = new Schema<ServiceEntry>(
    {
        type: { type: String, required: true },
        note: { type: String, default: '' },
        budgets: { type: [String], default: [] },
        date: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['new', 'in-progress', 'done'],
            default: 'new',
        },
        photos: { type: [String], default: [] },
    },
    { _id: false },
);

const userSchema = new Schema<UserDoc>(
    {
        name: { type: String, default: 'User' },
        phone: { type: String, default: '' },
        email: { type: String, unique: true, required: true },
        service: { type: [ServiceSchema], default: [] },
        address: { type: String, default: null },
        note: { type: String, default: null },
        photo: { type: String, default: null },
        activeTime: { type: Number, default: 0 },
        verifyByEmail: { type: Boolean, default: false },
        token: { type: String, default: null },
        verifyToken: { type: String, default: null },
        budgets: { type: [String], default: [] },
        privacy: {
            consent: { type: Boolean, default: false },
            consentAt: { type: Date },
            ip: { type: String },
            userAgent: { type: String },
            version: { type: String },
        },
    },
    { timestamps: true, versionKey: false },
);

export const serializeUser = (u: UserDoc) => ({
    name: u.name,
    phone: u.phone,
    email: u.email,
    address: u.address,
    service: u.service,
    budgets: u.budgets,
    note: u.note,
    photo: u.photo,
    activeTime: u.activeTime,
    verifyByEmail: u.verifyByEmail,
    privacy: u.privacy,
});

const User = models.users || model<UserDoc>('users', userSchema);
export default User;
