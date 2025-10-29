// app/actions/contactForm.ts
'use server';

import nodemailer from 'nodemailer';
// КРАЩЕ: без розширення або .ts, щоб TS не бурчав
// import { htmlTemplate } from '../constants';
import { htmlTemplate } from '../constants/index.js';

/** ───── helpers ───── */
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
function nl2br(s: string) { return s.replace(/\n/g, '<br>'); }
function render<T extends Record<string, string>>(tpl: string, vars: T) {
  return tpl.replace(/{{(\w+)}}/g, (_, k) => (vars[k] ?? ''));
}

/** ───── SMTP (Brevo) ───── */
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

/** ───── main action ───── */
export async function submitContactForm(formData: FormData) {
  // 1) read fields
  const name     = String(formData.get('name')      ?? '');
  const email    = String(formData.get('email')     ?? '');
  const phone    = String(formData.get('phone')     ?? '');
  const location = String(formData.get('location')  ?? '');
  const service  = String(formData.get('service')   ?? '');
  const budget   = String(formData.get('budget')    ?? '');
  const message  = String(formData.get('message')   ?? '');

  // 2) validate
  if (!name || !email || !message) {
    return { success: false as const, error: 'Required fields missing' };
  }

  // 3) template vars
  const vars = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    location: escapeHtml(location),
    service: escapeHtml(service),
    budget: escapeHtml(budget),
    message: nl2br(escapeHtml(message)),
    year: String(new Date().getFullYear()),
  };

  const htmlAdmin  = render(htmlTemplate.admin.html,  vars);
  const textAdmin  = render(htmlTemplate.admin.text,  { ...vars, message });
  const htmlClient = render(htmlTemplate.client, vars);

  // 4) send
  try {
    const transporter = makeTransport();

    // адреси адміну (фільтруємо порожні)
    const adminRecipients = [process.env.ADMIN_TO, process.env.ADMIN_TO1, process.env.ADMIN_TO2]
      .filter((v): v is string => Boolean(v && v.trim()))
      .join(', ') || 'wordisstuff@gmail.com';

    // лист адміну
    await transporter.sendMail({
      from:    `"mOliora Contact" <${process.env.MAIL_FROM ?? process.env.SMTP_USER}>`,
      to:      adminRecipients,
      replyTo: email || undefined,
      subject: `New request from ${name} • ${service || 'Home Services'}`,
      text:    textAdmin,
      html:    htmlAdmin,
    });

    // підтвердження клієнту
    await transporter.sendMail({
      from:    `"mOliora Home Services" <${process.env.MAIL_FROM ?? process.env.SMTP_USER}>`,
      to:      email,
      subject: 'We received your request',
      html:    htmlClient,
    });

    return { success: true as const };
  } catch (err: unknown) {
    // безпечний розбір помилки — без any
    let msg = 'Failed to send email. Please try again later.';
    if (err instanceof Error) {
      msg = err.message;
      console.error('Mail send error:', err.message);
    } else {
      console.error('Mail send error (unknown):', err);
    }
    return { success: false as const, error: msg };
  }
}