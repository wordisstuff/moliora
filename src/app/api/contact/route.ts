import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as ContactPayload;
        const website = text(body.website);

        if (website) return invalid('Unable to submit request.');

        const name = text(body.name);
        const phoneInput = text(body.phone);
        const email = text(body.email).toLowerCase();
        const location = text(body.location);
        const service = text(body.service);
        const message = text(body.message);
        const consent = body.consent === true || body.consent === 'true';

        if (!name || !phoneInput || !location || !service || !message) {
            return invalid('Please complete all required fields.');
        }
        if (!consent) {
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
                return invalid(`${field} is too long.`);
            }
        }

        if (
            !CONTACT_SERVICES.includes(
                service as (typeof CONTACT_SERVICES)[number],
            )
        ) {
            return invalid('Please select a valid service.');
        }

        const phone = normalizeUsPhone(phoneInput);
        if (!phone) {
            return invalid('Please enter a valid US phone number.');
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return invalid('Please enter a valid email address.');
        }

        await initMongoDB();

        const forwarded = req.headers.get('x-forwarded-for');
        const ip =
            (forwarded ? forwarded.split(',')[0].trim() : null) ||
            req.headers.get('x-real-ip') ||
            '';
        const userAgent = req.headers.get('user-agent') || '';
        const consentTimestamp = new Date();

        const doc = await ContactRequestModel.create({
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
            console.error(
                'Admin contact notification failed for stored lead:',
                doc._id,
                error,
            );
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
                console.error(
                    'Customer confirmation failed for stored lead:',
                    doc._id,
                    error,
                );
            }
        }

        return NextResponse.json(
            { success: true, id: doc._id.toString() },
            { status: 201 },
        );
    } catch (error) {
        console.error('API /api/contact error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save your request. Please try again later.',
            },
            { status: 500 },
        );
    }
}
