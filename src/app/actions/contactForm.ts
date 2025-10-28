// app/actions/contactForm.ts
'use server';

import nodemailer from 'nodemailer';

/** Допоміжне: безпечні підстановки у шаблон */
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] as string));
}
function nl2br(s: string) { return s.replace(/\n/g, '<br>'); }
function render(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/{{(\w+)}}/g, (_, k) => vars[k] ?? '');
}

/** Транспортер (Gmail через App Password) */
function makeTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function submitContactForm(formData: FormData) {
  // 1) Зчитуємо поля
  const name     = String(formData.get('name')      ?? '');
  const email    = String(formData.get('email')     ?? '');
  const phone    = String(formData.get('phone')     ?? '');
  const location = String(formData.get('location')  ?? '');
  const service  = String(formData.get('service')   ?? '');
  const budget   = String(formData.get('budget')    ?? '');
  const message  = String(formData.get('message')   ?? '');

  // 2) Базова валідація
  if (!name || !email || !message) {
    return { success: false, error: 'Required fields missing' };
  }

  // 3) Підготовка змінних для шаблонів
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

  const htmlAdmin  = render(ADMIN_HTML,  vars);
  const textAdmin  = render(ADMIN_TEXT,  { ...vars, message: message }); // у тексті — без <br>
  const htmlClient = render(CLIENT_HTML, vars);

  // 4) Відправка
  const transporter = makeTransport();

  // тобі (адміну)
  await transporter.sendMail({
    from:    `"mOliora Contact" <${process.env.SMTP_USER}>`,
    to:      'wordisstuff@gmail.com',
    replyTo: email || undefined,
    subject: `New request from ${name} • ${service || 'Home Services'}`,
    text:    textAdmin,
    html:    htmlAdmin,
  });

  // клієнту (підтвердження)
  await transporter.sendMail({
    from:    `"mOliora Home Services" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: 'We received your request',
    html:    htmlClient, // 👈 ВАЖЛИВО: параметр називається html, НЕ htmlClient
  });

  return { success: true };
}

/* ================== ШАБЛОНИ ================== */

/** Лист тобі (адміну), HTML */
const ADMIN_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>New Contact Request</title></head>
<body style="margin:0;padding:0;background:#f5e8d9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5e8d9;">
    <tr><td align="center" style="padding:24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e9dac8;">
        <tr><td style="background:#f5e8d9;padding:24px;text-align:center;border-bottom:1px solid #e9dac8;">
          <div style="font-family:Georgia,serif;font-size:28px;color:#3f3a2e;">
            <span style="font-weight:600;">m</span><span style="font-weight:700;">O</span>liora
          </div>
          <div style="font-family:Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#3f3a2e;opacity:.8;font-size:12px;margin-top:6px;">Home Services</div>
        </td></tr>
        <tr><td style="padding:24px 24px 8px 24px;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;color:#3f3a2e;">New Contact Request</h1>
          <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.8;font-size:14px;">A new message came in from your website contact form.</p>
        </td></tr>
        <tr><td style="padding:8px 24px 16px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf6ee;border:1px solid #e9dac8;border-radius:10px;">
            <tr><td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;font-size:14px;">
              <strong style="display:inline-block;width:110px;">Name:</strong> {{name}}<br>
              <strong style="display:inline-block;width:110px;">Email:</strong> {{email}}<br>
              <strong style="display:inline-block;width:110px;">Phone:</strong> {{phone}}<br>
              <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}<br>
              <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}<br>
              <strong style="display:inline-block;width:110px;">Budget:</strong> {{budget}}
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 24px 8px 24px;">
          <h2 style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:18px;color:#3f3a2e;">Message</h2>
          <div style="font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;background:#fff;border:1px solid #e9dac8;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;">{{message}}</div>
        </td></tr>
        <tr><td style="padding:16px 24px 24px 24px;text-align:center;">
          <a href="mailto:{{email}}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Reply to {{name}}</a>
        </td></tr>
        <tr><td style="background:#f5e8d9;padding:14px 24px;text-align:center;border-top:1px solid #e9dac8;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">© {{year}} mOliora Home Services • Minneapolis–St. Paul, MN</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

/** Лист тобі (адміну), текстова версія (fallback) */
const ADMIN_TEXT = `
New Contact Request

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
City / ZIP: {{location}}
Service: {{service}}
Budget: {{budget}}

Message:
{{message}}
`.trim();

/** Лист клієнту (підтвердження), HTML */
const CLIENT_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thank you from mOliora</title></head>
<body style="margin:0;padding:0;background:#f5e8d9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5e8d9;">
    <tr><td align="center" style="padding:24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e9dac8;">
        <tr><td style="background:#f5e8d9;padding:24px;text-align:center;border-bottom:1px solid #e9dac8;">
          <div style="font-family:Georgia,serif;font-size:28px;color:#3f3a2e;">
            <span style="font-weight:600;">m</span><span style="font-weight:700;">O</span>liora
          </div>
          <div style="font-family:Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#3f3a2e;opacity:.8;font-size:12px;margin-top:6px;">Home Services</div>
        </td></tr>
        <tr><td style="padding:24px;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;color:#3f3a2e;">Thank you, {{name}}!</h1>
          <p style="margin:12px 0 20px 0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.9;font-size:15px;line-height:1.6;">
            We’ve received your message and our team will get back to you within one business day.
            Below is a copy of your request for your records.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf6ee;border:1px solid #e9dac8;border-radius:10px;">
            <tr><td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;font-size:14px;">
              <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}<br>
              <strong style="display:inline-block;width:110px;">Budget:</strong> {{budget}}<br>
              <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}<br>
              <strong style="display:inline-block;width:110px;">Phone:</strong> {{phone}}
            </td></tr>
          </table>
          <h2 style="margin:24px 0 8px 0;font-family:Georgia,serif;font-size:18px;color:#3f3a2e;">Your Message</h2>
          <div style="font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;border:1px solid #e9dac8;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;">{{message}}</div>
          <p style="margin-top:32px;text-align:center;">
            <a href="mailto:wordisstuff@gmail.com" style="background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 22px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Contact mOliora Support</a>
          </p>
        </td></tr>
        <tr><td style="background:#f5e8d9;padding:14px;text-align:center;border-top:1px solid #e9dac8;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">© {{year}} mOliora Home Services • Minneapolis–St. Paul, MN</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;





// 'use server';
// import nodemailer from 'nodemailer';

// export async function submitContactForm(formData: FormData) {
//   const name = String(formData.get('name') || '');
//   const email = String(formData.get('email') || '');
//   const phone = String(formData.get('phone') || '');
//   const location = String(formData.get('location') || '');
//   const service = String(formData.get('service') || '');
//   const budget = String(formData.get('budget') || '');
//   const message = String(formData.get('message') || '');

//   if (!name || !email || !message) {
//     return { success: false, error: 'Required fields missing' };
//   }

//   const htmlClient = EMAIL_HTML
//     .replaceAll('{{name}}', escapeHtml(name))
//     .replaceAll('{{email}}', escapeHtml(email))
//     .replaceAll('{{phone}}', escapeHtml(phone))
//     .replaceAll('{{location}}', escapeHtml(location))
//     .replaceAll('{{service}}', escapeHtml(service))
//     .replaceAll('{{budget}}', escapeHtml(budget))
//     .replaceAll('{{message}}', nl2br(escapeHtml(message)))
//     .replaceAll('{{year}}', new Date().getFullYear().toString());
  
//   const html = EMAIL_HTML
//     .replaceAll('{{name}}', escapeHtml(name))
//     .replaceAll('{{email}}', escapeHtml(email))
//     .replaceAll('{{phone}}', escapeHtml(phone))
//     .replaceAll('{{location}}', escapeHtml(location))
//     .replaceAll('{{service}}', escapeHtml(service))
//     .replaceAll('{{budget}}', escapeHtml(budget))
//     .replaceAll('{{message}}', nl2br(escapeHtml(message)))
//     .replaceAll('{{year}}', new Date().getFullYear().toString());


//   const text = `
// New Contact Request

// Name: ${name}
// Email: ${email}
// Phone: ${phone}
// City / ZIP: ${location}
// Service: ${service}
// Budget: ${budget}

// Message:
// ${message}
// `.trim();

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//   });

//   await transporter.sendMail({
//     from: `"mOliora Contact" <${process.env.SMTP_USER}>`,
//     to: 'wordisstuff@gmail.com',             // куди отримувати
//     replyTo: email || undefined,             // відповідь піде клієнту
//     subject: `New request from ${name} • ${service || 'Home Services'}`,
//     text,
//     html,
//   });

//   // ✉️ Надсилаємо клієнту підтвердження
// await transporter.sendMail({
//   from: `"mOliora Home Services" <${process.env.SMTP_USER}>`,
//   to: email, // <- клієнтська адреса
//   subject: 'We received your request',
//   htmlClient: `
//     <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8">
//     <title>Thank you from mOliora</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   </head>
//   <body style="margin:0;padding:0;background:#f5e8d9;">
//     <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5e8d9;">
//       <tr>
//         <td align="center" style="padding:24px;">
//           <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9dac8;">
//             <tr>
//               <td style="background:#f5e8d9;padding:24px;text-align:center;border-bottom:1px solid #e9dac8;">
//                 <div style="font-family:Georgia, 'Times New Roman', serif;font-size:28px;color:#3f3a2e;">
//                   <span style="font-weight:600;">m</span><span style="font-weight:700;">O</span>liora
//                 </div>
//                 <div style="font-family:Arial,Helvetica,sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#3f3a2e;opacity:.8;font-size:12px;margin-top:6px;">
//                   Home Services
//                 </div>
//               </td>
//             </tr>

//             <tr>
//               <td style="padding:24px;">
//                 <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#3f3a2e;">
//                   Thank you, {{name}}!
//                 </h1>
//                 <p style="margin:12px 0 20px 0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.9;font-size:15px;line-height:1.6;">
//                   We’ve received your message and our team will get back to you within one business day.  
//                   Below is a copy of your request for your records.
//                 </p>

//                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ee;border:1px solid #e9dac8;border-radius:10px;">
//                   <tr>
//                     <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;font-size:14px;">
//                       <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}<br>
//                       <strong style="display:inline-block;width:110px;">Budget:</strong> {{budget}}<br>
//                       <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}<br>
//                       <strong style="display:inline-block;width:110px;">Phone:</strong> {{phone}}
//                     </td>
//                   </tr>
//                 </table>

//                 <h2 style="margin:24px 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#3f3a2e;">Your Message</h2>
//                 <div style="font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;border:1px solid #e9dac8;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;">
//                   {{message}}
//                 </div>

//                 <p style="margin-top:32px;text-align:center;">
//                   <a href="mailto:wordisstuff@gmail.com" style="background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 22px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">
//                     Contact mOliora Support
//                   </a>
//                 </p>
//               </td>
//             </tr>

//             <tr>
//               <td style="background:#f5e8d9;padding:14px;text-align:center;border-top:1px solid #e9dac8;">
//                 <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">
//                   © {{year}} mOliora Home Services • Minneapolis–St. Paul, MN
//                 </p>
//               </td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
//   `,
// });

//   return { success: true };
// }


// /* --- допоміжні --- */
// const EMAIL_HTML = `<!-- Moliora Contact Email -->
// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8">
//     <title>New Contact Request</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   </head>
//   <body style="margin:0;padding:0;background:#f5e8d9;">
//     <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5e8d9;">
//       <tr>
//         <td align="center" style="padding:24px;">
//           <!-- container -->
//           <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9dac8;">
//             <!-- header -->
//             <tr>
//               <td style="background:#f5e8d9;padding:24px 24px 16px 24px;text-align:center;border-bottom:1px solid #e9dac8;">
//                 <!-- Якщо є лого з CID або URL, вставь <img> тут -->
//                 <div style="font-family:Georgia, 'Times New Roman', serif;font-size:28px;line-height:1;color:#3f3a2e;">
//                   <span style="font-weight:600;">m</span><span style="font-weight:700;">O</span>liora
//                 </div>
//                 <div style="font-family:Arial,Helvetica,sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#3f3a2e;opacity:.8;font-size:12px;margin-top:6px;">
//                   Home Services
//                 </div>
//               </td>
//             </tr>

//             <!-- title -->
//             <tr>
//               <td style="padding:24px 24px 8px 24px;">
//                 <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#3f3a2e;">
//                   New Contact Request
//                 </h1>
//                 <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.8;font-size:14px;">
//                   A new message came in from your website contact form.
//                 </p>
//               </td>
//             </tr>

//             <!-- details box -->
//             <tr>
//               <td style="padding:8px 24px 16px 24px;">
//                 <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fbf6ee;border:1px solid #e9dac8;border-radius:10px;">
//                   <tr>
//                     <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;font-size:14px;">
//                       <strong style="display:inline-block;width:110px;">Name:</strong> {{name}}<br>
//                       <strong style="display:inline-block;width:110px;">Email:</strong> {{email}}<br>
//                       <strong style="display:inline-block;width:110px;">Phone:</strong> {{phone}}<br>
//                       <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}<br>
//                       <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}<br>
//                       <strong style="display:inline-block;width:110px;">Budget:</strong> {{budget}}
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- message -->
//             <tr>
//               <td style="padding:0 24px 8px 24px;">
//                 <h2 style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#3f3a2e;">Message</h2>
//                 <div style="font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;background:#ffffff;border:1px solid #e9dac8;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;">
//                   {{message}}
//                 </div>
//               </td>
//             </tr>

//             <!-- cta -->
//             <tr>
//               <td style="padding:16px 24px 24px 24px;text-align:center;">
//                 <a href="mailto:{{email}}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">
//                   Reply to {{name}}
//                 </a>
//               </td>
//             </tr>

//             <!-- footer -->
//             <tr>
//               <td style="background:#f5e8d9;padding:14px 24px;text-align:center;border-top:1px solid #e9dac8;">
//                 <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">
//                   © {{year}} mOliora Home Services • Minneapolis–St. Paul, MN
//                 </p>
//               </td>
//             </tr>
//           </table>
//           <!-- /container -->
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>`;
// function escapeHtml(s: string) {
//   return s.replace(/[&<>"']/g, c =>
//     ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] as string));
// }
// function nl2br(s: string) {
//   return s.replace(/\n/g, '<br>');
// }