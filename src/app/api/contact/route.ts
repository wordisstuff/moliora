// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { initMongoDB } from '@/app/db/initDb';
import { ContactRequestModel } from '@/app/db/models/ContactRequest';
import { htmlTemplate } from '@/app/constants/index.js';

type ContactPayload = {
    name: string;
    phone?: string;
    email: string;
    location?: string;
    service?: string;
    budget?: string;
    message: string;
};

/** ---- helpers для шаблонів листів ---- */
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
            }[c as '&' | '<' | '>' | '"' | "'"] as string),
    );
}
function nl2br(s: string) {
    return s.replace(/\n/g, '<br>');
}
function render(tpl: string, vars: Record<string, string>) {
    return tpl.replace(/{{(\w+)}}/g, (_, k) => vars[k] ?? '');
}

/** ---- SMTP (Brevo) ---- */
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

export async function POST(req: NextRequest) {
    try {
        await initMongoDB();

        const body = (await req.json()) as Partial<ContactPayload>;

        // базова валідація
        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { success: false, error: 'Required fields missing' },
                { status: 400 },
            );
        }

        // ---- IP + UA без req.ip ----
        const forwarded = req.headers.get('x-forwarded-for');
        const ip =
            (forwarded ? forwarded.split(',')[0].trim() : null) ||
            req.headers.get('x-real-ip') ||
            '';
        const userAgent = req.headers.get('user-agent') || '';

        // ---- зберігаємо в Mongo ----
        const doc = await ContactRequestModel.create({
            name: body.name,
            phone: body.phone || '',
            email: body.email,
            location: body.location || '',
            service: body.service || '',
            budget: body.budget || '',
            message: body.message,
            ip,
            userAgent,
        });

        // ---- готуємо листи ----
        const vars = {
            name: escapeHtml(body.name),
            email: escapeHtml(body.email),
            phone: escapeHtml(body.phone || ''),
            location: escapeHtml(body.location || ''),
            service: escapeHtml(body.service || ''),
            budget: escapeHtml(body.budget || ''),
            message: nl2br(escapeHtml(body.message)),
            year: String(new Date().getFullYear()),
        };

        const htmlAdmin = render(htmlTemplate.admin.html, vars);
        const textAdmin = render(htmlTemplate.admin.text, {
            ...vars,
            message: body.message,
        });
        const htmlClient = render(htmlTemplate.client, vars);

        const transporter = makeTransport();

        // адміну (можна кілька адрес)
        await transporter.sendMail({
            from: `"mOliora Contact" <${
                process.env.MAIL_FROM ?? process.env.SMTP_USER
            }>`,
            to:
                [
                    process.env.ADMIN_TO,
                    process.env.ADMIN_TO1,
                    process.env.ADMIN_TO2,
                ]
                    .filter(Boolean)
                    .join(',') || 'wordisstuff@gmail.com',
            replyTo: body.email,
            subject: `New request from ${body.name} • ${
                body.service || 'Home Services'
            }`,
            text: textAdmin,
            html: htmlAdmin,
        });

        // клієнту — підтвердження
        await transporter.sendMail({
            from: `"mOliora Home Services" <${
                process.env.MAIL_FROM ?? process.env.SMTP_USER
            }>`,
            to: body.email,
            subject: 'We received your request',
            html: htmlClient,
        });

        return NextResponse.json(
            { success: true, id: doc._id.toString() },
            { status: 201 },
        );
    } catch (err) {
        console.error('API /api/contact error:', err);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save or send email. Please try again later.',
            },
            { status: 500 },
        );
    }
}
