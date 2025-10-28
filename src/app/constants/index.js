export const EMAIL_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>New Contact Request</title> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#f5e8d9;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5e8d9;">
      <tr>
        <td align="center" style="padding:24px;">
          <!-- container -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9dac8;">
            <!-- header -->
            <tr>
              <td style="background:#f5e8d9;padding:24px 24px 16px 24px;text-align:center;border-bottom:1px solid #e9dac8;">
                <!-- Якщо є лого з CID або URL, вставь <img> тут -->
                <div style="font-family:Georgia, 'Times New Roman', serif;font-size:28px;line-height:1;color:#3f3a2e;">
                  <span style="font-weight:600;">m</span><span style="font-weight:700;">O</span>liora
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#3f3a2e;opacity:.8;font-size:12px;margin-top:6px;">
                  Home Services
                </div>
              </td>
            </tr>

            <!-- title -->
            <tr>
              <td style="padding:24px 24px 8px 24px;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#3f3a2e;">
                  New Contact Request
                </h1>
                <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.8;font-size:14px;">
                  A new message came in from your website contact form.
                </p>
              </td>
            </tr>

            <!-- details box -->
            <tr>
              <td style="padding:8px 24px 16px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fbf6ee;border:1px solid #e9dac8;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;font-size:14px;">
                      <strong style="display:inline-block;width:110px;">Name:</strong> {{name}}<br>
                      <strong style="display:inline-block;width:110px;">Email:</strong> {{email}}<br>
                      <strong style="display:inline-block;width:110px;">Phone:</strong> {{phone}}<br>
                      <strong style="display:inline-block;width:110px;">City / ZIP:</strong> {{location}}<br>
                      <strong style="display:inline-block;width:110px;">Service:</strong> {{service}}<br>
                      <strong style="display:inline-block;width:110px;">Budget:</strong> {{budget}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- message -->
            <tr>
              <td style="padding:0 24px 8px 24px;">
                <h2 style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#3f3a2e;">Message</h2>
                <div style="font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;background:#ffffff;border:1px solid #e9dac8;border-radius:10px;padding:14px;font-size:14px;line-height:1.6;">
                  {{message}}
                </div>
              </td>
            </tr>

            <!-- cta -->
            <tr>
              <td style="padding:16px 24px 24px 24px;text-align:center;">
                <a href="mailto:{{email}}" style="display:inline-block;background:#3f3a2e;color:#f5e8d9;text-decoration:none;padding:12px 18px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;">
                  Reply to {{name}}
                </a>
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td style="background:#f5e8d9;padding:14px 24px;text-align:center;border-top:1px solid #e9dac8;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#3f3a2e;opacity:.7;font-size:12px;">
                  © {{year}} mOliora Home Services • Minneapolis–St. Paul, MN
                </p>
              </td>
            </tr>
          </table>
          <!-- /container -->
        </td>
      </tr>
    </table>
  </body>
</html>`;
