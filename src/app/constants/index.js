import { env } from '../utils/env.js';
import { VARS } from './consts.js';

export const FIFTEEN_MINUTES = 900000;
export const TWO_HOURS = 7200000;
export const ONE_DAY = 86400000;

export const authDb = {
    // port: env(VARS.PORT, 3000),
    // secret: env('MY_SYCRET'),
    user: env(VARS.USER),
    pwd: env(VARS.PASSWORD),
    url: env(VARS.URL),
    db: env(VARS.DB),
    mac: [process.env['MAC_1'], process.env['MAC_2']],
};

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
              <strong style="display:inline-block;width:110px;color:#9a6b17;">Phone:</strong> <strong>{{phone}}</strong><br>
              {{emailRow}}
              <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}<br>
              <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 24px 8px 24px;">
          <h2 style="margin:0 0 6px 0;font-family:Georgia,serif;font-size:18px;color:#3f3a2e;">Message</h2>
          <div style="font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;background:#fff;border:1px solid #e9dac8;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;">{{message}}</div>
        </td></tr>
        <tr><td style="padding:16px 24px 24px 24px;text-align:center;">
          {{replyAction}}
        </td></tr>
        <tr><td style="background:#f5e8d9;padding:14px 24px;text-align:center;border-top:1px solid #e9dac8;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">© {{year}} mOliora Home Services • Minneapolis–St. Paul, MN</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const ADMIN_TEXT = `
New Contact Request

Name: {{name}}
Phone: {{phone}}
{{emailText}}
City / ZIP: {{location}}
Service: {{service}}

Message:
{{message}}
`.trim();

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
            We will review the project details and contact you within one business day.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fbf6ee;border:1px solid #e9dac8;border-radius:10px;">
            <tr><td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;font-size:14px;">
              <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}<br>
              <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}
            </td></tr>
          </table>
          <p style="margin-top:32px;text-align:center;">
            <a href="mailto:${
                process.env.ADMIN_TO ?? 'wordisstuff@gmail.com'
            }" style="background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 22px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">Contact mOliora Support</a>
          </p>
        </td></tr>
        <tr><td style="background:#f5e8d9;padding:14px;text-align:center;border-top:1px solid #e9dac8;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">© {{year}} mOliora Home Services • Minneapolis–St. Paul, MN</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

export const htmlTemplate = {
    admin: { html: ADMIN_HTML, text: ADMIN_TEXT },
    client: CLIENT_HTML,
};
