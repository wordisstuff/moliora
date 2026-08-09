import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { mongo } from 'mongoose';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';
import { htmlTemplate } from '@/app/constants/index.js';
import { CONTACT_CONSENT_VERSION, CONTACT_SERVICES } from '@/config/contact';

type ContactPayload = {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    location?: unknown;
    service?: unknown;
    message?: unknown;
    consent?: unknown;
    website?: unknown;
};

const LIMITS = {
    name: 120,
    phone: 30,
    email: 254,
    location: 120,
    service: 80,
    message: 4_000,
} as const;

function escapeHtml(s: string) {
    return s.replace(
        /[&<>"']/g,
        c =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[c] as string,
    );
}

function nl2br(s: string) {
    return s.replace(/\n/g, '<br>');
}

function render(tpl: string, vars: Record<string, string>) {
    return tpl.replace(/{{(\w+)}}/g, (_, k) => vars[k] ?? '');
}

function text(value: unknown) {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeUsPhone(value: string) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return null;
}

function makeTransport() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: { rejectUnauthorized: true },
        connectionTimeout: 20_000,
        socketTimeout: 30_000,
    });
}

function invalid(error: string) {
    return NextResponse.json({ success: false, error }, { status: 400 });
}

type SafeFailureDetails = Record<
    string,
    string | number | readonly string[]
>;

function duplicateKeyIndexName(error: mongo.MongoServerError) {
    // The driver exposes keyPattern but not a dedicated index-name property for
    // every E11000 response. Extract only the index identifier from the server
    // message; never log the rest of that message because it contains keyValue.
    const message = typeof error.message === 'string' ? error.message : '';
    return message.match(/\bindex:\s+([^\s]+)\s+dup key\b/)?.[1];
}

function logFailure(stage: string, error?: unknown, id?: unknown) {
    const details: SafeFailureDetails = {};
    if (error instanceof Error) details.errorType = error.name;
    if (error instanceof mongo.MongoServerError) {
        if (typeof error.code === 'number') details.code = error.code;
        if (typeof error.codeName === 'string') {
            details.codeName = error.codeName;
        }

        const keyPattern = error.keyPattern;
        if (
            keyPattern &&
            typeof keyPattern === 'object' &&
            !Array.isArray(keyPattern)
        ) {
            details.keyFields = Object.keys(keyPattern).sort();
        }

        if (error.code === 11000) {
            const index = duplicateKeyIndexName(error);
            if (index) details.index = index;
        }
    }
    if (id != null) details.leadId = String(id);
    console.error(stage, details);
}

export async function POST(req: NextRequest) {
    let body: ContactPayload;
    try {
        body = (await req.json()) as ContactPayload;
    } catch (error) {
        logFailure('contact.request_parse_failed', error);
        return invalid('Unable to read the request.');
    }

    try {
        const website = text(body.website);

        if (website) {
            logFailure('contact.validation_failed');
            return invalid('Unable to submit request.');
        }

        const name = text(body.name);
        const phoneInput = text(body.phone);
        const email = text(body.email).toLowerCase();
        const location = text(body.location);
        const service = text(body.service);
        const message = text(body.message);
        const consent = body.consent === true || body.consent === 'true';

        if (!name || !phoneInput || !location || !service || !message) {
            logFailure('contact.validation_failed');
            return invalid('Please complete all required fields.');
        }
        if (!consent) {
            logFailure('contact.validation_failed');
            return invalid('Please agree to be contacted about your request.');
        }

        for (const [field, value] of Object.entries({
            name,
            phone: phoneInput,
            email,
            location,
            service,
            message,
        })) {
            const limit = LIMITS[field as keyof typeof LIMITS];
            if (value.length > limit) {
                logFailure('contact.validation_failed');
                return invalid(`${field} is too long.`);
            }
        }

        if (
            !CONTACT_SERVICES.includes(
                service as (typeof CONTACT_SERVICES)[number],
            )
        ) {
            logFailure('contact.validation_failed');
            return invalid('Please select a valid service.');
        }

        const phone = normalizeUsPhone(phoneInput);
        if (!phone) {
            logFailure('contact.validation_failed');
            return invalid('Please enter a valid US phone number.');
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            logFailure('contact.validation_failed');
            return invalid('Please enter a valid email address.');
        }

        try {
            await initMongoDB();
        } catch (error) {
            logFailure('contact.mongo_init_failed', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to save your request. Please try again later.',
                },
                { status: 500 },
            );
        }

        const forwarded = req.headers.get('x-forwarded-for');
        const ip =
            (forwarded ? forwarded.split(',')[0].trim() : null) ||
            req.headers.get('x-real-ip') ||
            '';
        const userAgent = req.headers.get('user-agent') || '';
        const consentTimestamp = new Date();

        let doc;
        try {
            doc = await ContactRequestModel.create({
                name,
                phone,
                email,
                location,
                service,
                message,
                consent: true,
                consentTimestamp,
                consentVersion: CONTACT_CONSENT_VERSION,
                ip,
                userAgent,
            });
        } catch (error) {
            logFailure('contact.mongo_create_failed', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to save your request. Please try again later.',
                },
                { status: 500 },
            );
        }

        const safe = {
            name: escapeHtml(name),
            email: escapeHtml(email),
            phone: escapeHtml(phone),
            location: escapeHtml(location),
            service: escapeHtml(service),
            message: nl2br(escapeHtml(message)),
            year: String(new Date().getFullYear()),
        };
        const vars = {
            ...safe,
            emailRow: email
                ? `<strong style="display:inline-block;width:110px;">Email:</strong> ${safe.email}<br>`
                : '',
            emailText: email ? `Email: ${email}` : '',
            replyAction: email
                ? `<a href="mailto:${safe.email}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Reply to ${safe.name}</a>`
                : `<a href="tel:${safe.phone}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Call ${safe.name}</a>`,
        };

        const transporter = makeTransport();
        try {
            await transporter.sendMail({
                from: `"mOliora Contact" <${process.env.MAIL_FROM ?? process.env.SMTP_USER}>`,
                to:
                    [
                        process.env.ADMIN_TO,
                        process.env.ADMIN_TO1,
                        process.env.ADMIN_TO2,
                    ]
                        .filter(Boolean)
                        .join(',') || 'wordisstuff@gmail.com',
                ...(email ? { replyTo: email } : {}),
                subject: `New request from ${name} • ${service}`,
                text: render(htmlTemplate.admin.text, {
                    ...vars,
                    message,
                }),
                html: render(htmlTemplate.admin.html, vars),
            });
        } catch (error) {
            logFailure('contact.admin_email_failed', error, doc._id);
            return NextResponse.json(
                {
                    success: true,
                    id: doc._id.toString(),
                    notificationPending: true,
                },
                { status: 202 },
            );
        }

        if (email) {
            try {
                await transporter.sendMail({
                    from: `"mOliora Home Services" <${process.env.MAIL_FROM ?? process.env.SMTP_USER}>`,
                    to: email,
                    subject: 'We received your request',
                    html: render(htmlTemplate.client, vars),
                });
            } catch (error) {
                logFailure('contact.customer_email_failed', error, doc._id);
            }
        }

        return NextResponse.json(
            { success: true, id: doc._id.toString() },
            { status: 201 },
        );
    } catch (error) {
        logFailure('contact.unexpected_failed', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save your request. Please try again later.',
            },
            { status: 500 },
        );
    }
}
