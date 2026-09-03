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
    leadSource?: unknown;
    approximateArea?: unknown;
    existingFlooring?: unknown;
    demolition?: unknown;
    materialSupply?: unknown;
    utmSource?: unknown;
    utmMedium?: unknown;
    utmCampaign?: unknown;
    utmTerm?: unknown;
    utmContent?: unknown;
    gclid?: unknown;
    landingPage?: unknown;
};

const LIMITS = {
    name: 120,
    phone: 30,
    email: 254,
    location: 120,
    service: 80,
    message: 4_000,
    leadSource: 120,
    approximateArea: 80,
    existingFlooring: 80,
    demolition: 40,
    materialSupply: 120,
    utmSource: 120,
    utmMedium: 120,
    utmCampaign: 200,
    utmTerm: 200,
    utmContent: 200,
    gclid: 300,
    landingPage: 500,
} as const;

function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
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
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: true },
        connectionTimeout: 20_000,
        socketTimeout: 30_000,
    });
}

function invalid(error: string) {
    return NextResponse.json({ success: false, error }, { status: 400 });
}

type SafeFailureDetails = Record<string, string | number | readonly string[]>;

function duplicateKeyIndexName(error: mongo.MongoServerError) {
    const message = typeof error.message === 'string' ? error.message : '';
    return message.match(/\bindex:\s+([^\s]+)\s+dup key\b/)?.[1];
}

function logFailure(stage: string, error?: unknown, id?: unknown) {
    const details: SafeFailureDetails = {};
    if (error instanceof Error) details.errorType = error.name;
    if (error instanceof mongo.MongoServerError) {
        if (typeof error.code === 'number') details.code = error.code;
        if (typeof error.codeName === 'string') details.codeName = error.codeName;
        const keyPattern = error.keyPattern;
        if (keyPattern && typeof keyPattern === 'object' && !Array.isArray(keyPattern)) details.keyFields = Object.keys(keyPattern).sort();
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
        if (website) return invalid('Unable to submit request.');

        const name = text(body.name);
        const phoneInput = text(body.phone);
        const email = text(body.email).toLowerCase();
        const location = text(body.location);
        const service = text(body.service);
        const message = text(body.message);
        const leadSource = text(body.leadSource);
        const approximateArea = text(body.approximateArea);
        const existingFlooring = text(body.existingFlooring);
        const demolition = text(body.demolition);
        const materialSupply = text(body.materialSupply);
        const utmSource = text(body.utmSource);
        const utmMedium = text(body.utmMedium);
        const utmCampaign = text(body.utmCampaign);
        const utmTerm = text(body.utmTerm);
        const utmContent = text(body.utmContent);
        const gclid = text(body.gclid);
        const landingPage = text(body.landingPage);
        const consent = body.consent === true || body.consent === 'true';

        if (!name || !phoneInput || !location || !service || !message) return invalid('Please complete all required fields.');
        if (!consent) return invalid('Please agree to be contacted about your request.');

        const fields = { name, phone: phoneInput, email, location, service, message, leadSource, approximateArea, existingFlooring, demolition, materialSupply, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, gclid, landingPage };
        for (const [field, value] of Object.entries(fields)) {
            const limit = LIMITS[field as keyof typeof LIMITS];
            if (value.length > limit) return invalid(`${field} is too long.`);
        }

        if (!CONTACT_SERVICES.includes(service as (typeof CONTACT_SERVICES)[number])) return invalid('Please select a valid service.');

        const isLvp = service === 'LVP Flooring';
        if (isLvp && (!approximateArea || !existingFlooring || !demolition || !materialSupply)) return invalid('Please complete the flooring project details.');

        const phone = normalizeUsPhone(phoneInput);
        if (!phone) return invalid('Please enter a valid US phone number.');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid('Please enter a valid email address.');

        try {
            await initMongoDB();
        } catch (error) {
            logFailure('contact.mongo_init_failed', error);
            return NextResponse.json({ success: false, error: 'Failed to save your request. Please try again later.' }, { status: 500 });
        }

        const forwarded = req.headers.get('x-forwarded-for');
        const ip = (forwarded ? forwarded.split(',')[0].trim() : null) || req.headers.get('x-real-ip') || '';
        const userAgent = req.headers.get('user-agent') || '';
        const consentTimestamp = new Date();

        let doc;
        try {
            doc = await ContactRequestModel.create({
                name, phone, email, location, service, message, consent: true,
                consentTimestamp, consentVersion: CONTACT_CONSENT_VERSION,
                leadSource, approximateArea, existingFlooring, demolition, materialSupply,
                utmSource, utmMedium, utmCampaign, utmTerm, utmContent, gclid, landingPage,
                ip, userAgent,
            });
        } catch (error) {
            logFailure('contact.mongo_create_failed', error);
            return NextResponse.json({ success: false, error: 'Failed to save your request. Please try again later.' }, { status: 500 });
        }

        const attributionRows = [
            ['UTM source', utmSource], ['UTM medium', utmMedium], ['Campaign', utmCampaign],
            ['Keyword', utmTerm], ['Ad content', utmContent], ['GCLID', gclid], ['Landing page', landingPage],
        ].filter(([, value]) => value);

        const attributionText = attributionRows.length
            ? `\n\nAttribution:\n${attributionRows.map(([label, value]) => `${label}: ${value}`).join('\n')}`
            : '';
        const attributionHtml = attributionRows.length
            ? `<br><br><strong>Marketing attribution</strong><br>${attributionRows.map(([label, value]) => `<strong style="display:inline-block;width:140px;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}<br>`).join('')}`
            : '';

        const flooringText = isLvp
            ? `\nApprox. area: ${approximateArea}\nExisting flooring: ${existingFlooring}\nRemoval needed: ${demolition}\nMaterial supply: ${materialSupply}\nLead source: ${leadSource || 'LVP Flooring Landing Page'}`
            : '';
        const flooringHtml = isLvp
            ? `<br><br><strong>Flooring details</strong><br><strong style="display:inline-block;width:140px;">Approx. area:</strong> ${escapeHtml(approximateArea)}<br><strong style="display:inline-block;width:140px;">Existing floor:</strong> ${escapeHtml(existingFlooring)}<br><strong style="display:inline-block;width:140px;">Removal needed:</strong> ${escapeHtml(demolition)}<br><strong style="display:inline-block;width:140px;">Material:</strong> ${escapeHtml(materialSupply)}<br><strong style="display:inline-block;width:140px;">Lead source:</strong> ${escapeHtml(leadSource || 'LVP Flooring Landing Page')}`
            : '';

        const safe = {
            name: escapeHtml(name), email: escapeHtml(email), phone: escapeHtml(phone),
            location: escapeHtml(location), service: escapeHtml(service),
            message: nl2br(escapeHtml(message)) + flooringHtml + attributionHtml,
            year: String(new Date().getFullYear()),
        };
        const vars = {
            ...safe,
            adminTitle: isLvp ? 'New LVP Flooring Lead' : 'New Contact Request',
            adminIntro: isLvp ? 'A new flooring estimate request came in from the Moliora LVP landing page.' : 'A new message came in from your website contact form.',
            emailRow: email ? `<strong style="display:inline-block;width:110px;">Email:</strong> ${safe.email}<br>` : '',
            emailText: email ? `Email: ${email}` : '',
            replyAction: email
                ? `<a href="mailto:${safe.email}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Reply to ${safe.name}</a>`
                : `<a href="tel:${safe.phone}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Call ${safe.name}</a>`,
        };

        const transporter = makeTransport();
        try {
            await transporter.sendMail({
                from: `"mOliora Contact" <${process.env.MAIL_FROM ?? process.env.SMTP_USER}>`,
                to: [process.env.ADMIN_TO, process.env.ADMIN_TO1, process.env.ADMIN_TO2].filter(Boolean).join(',') || 'wordisstuff@gmail.com',
                ...(email ? { replyTo: email } : {}),
                subject: isLvp ? `NEW LVP LEAD • ${location} • ${approximateArea}` : `New request from ${name} • ${service}`,
                text: render(htmlTemplate.admin.text, { ...vars, message: `${message}${flooringText}${attributionText}` }),
                html: render(htmlTemplate.admin.html, vars),
            });
        } catch (error) {
            logFailure('contact.admin_email_failed', error, doc._id);
            return NextResponse.json({ success: true, id: doc._id.toString(), notificationPending: true }, { status: 202 });
        }

        if (email) {
            try {
                await transporter.sendMail({
                    from: `"mOliora Home Services" <${process.env.MAIL_FROM ?? process.env.SMTP_USER}>`,
                    to: email,
                    subject: isLvp ? 'We received your flooring request' : 'We received your request',
                    html: render(htmlTemplate.client, vars),
                });
            } catch (error) {
                logFailure('contact.customer_email_failed', error, doc._id);
            }
        }

        return NextResponse.json({ success: true, id: doc._id.toString() }, { status: 201 });
    } catch (error) {
        logFailure('contact.unexpected_failed', error);
        return NextResponse.json({ success: false, error: 'Failed to save your request. Please try again later.' }, { status: 500 });
    }
}
