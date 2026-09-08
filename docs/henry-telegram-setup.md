# Henry AI Assistant → mOliora CRM → Telegram

This integration lets both website leads and Henry phone-assistant leads flow into the same MongoDB lead collection and Telegram chat.

## What is already wired

- Existing website forms continue to POST to `/api/contact` and save `ContactRequest` records.
- Every newly saved `ContactRequest` sends a fail-soft Telegram notification when Telegram env vars are configured.
- Henry can submit a completed phone intake to `POST /api/assistant/intake`.
- A call recording can arrive later through `POST /api/assistant/recording`.
- Telegram notifications include a **🎧 Get voice** inline button. When clicked, `/api/telegram/webhook` loads the lead and sends the saved recording.
- If a Twilio recording requires authentication, the server can fetch it with `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` and upload it to Telegram.

## Vercel environment variables

Add these in the production project and redeploy:

```text
TELEGRAM_BOT_TOKEN=<BotFather token>
TELEGRAM_CHAT_ID=<group/channel/chat id>
TELEGRAM_WEBHOOK_SECRET=<long random string>
ASSISTANT_WEBHOOK_SECRET=<different long random string>
TWILIO_ACCOUNT_SID=<existing Twilio account SID; only needed for protected recording URLs>
TWILIO_AUTH_TOKEN=<existing Twilio auth token; only needed for protected recording URLs>
```

Do not commit real values to GitHub.

## Telegram bot setup

1. Create a bot with `@BotFather` and keep the bot token private.
2. Add the bot to the mOliora/Henry Telegram group or channel. For a channel, grant permission to post messages.
3. Obtain the target `TELEGRAM_CHAT_ID`.
4. Register this webhook with Telegram:

```text
https://moliora.us/api/telegram/webhook
```

When calling Telegram `setWebhook`, also set `secret_token` to the same value stored as `TELEGRAM_WEBHOOK_SECRET`. Telegram will then send it in the `X-Telegram-Bot-Api-Secret-Token` header.

## Henry / realtime phone tool

The phone platform needs one server-side tool/action that submits the final intake to:

```text
POST https://moliora.us/api/assistant/intake
Authorization: Bearer <ASSISTANT_WEBHOOK_SECRET>
Content-Type: application/json
```

Suggested payload:

```json
{
  "name": "John",
  "phone": "+16125551212",
  "email": "john@example.com",
  "location": "Anoka, MN",
  "service": "LVP Flooring",
  "summary": "Customer wants LVP installed in the main level and asked for an estimate.",
  "transcript": "Full or cleaned call transcript...",
  "callSid": "CA...",
  "durationSeconds": 184,
  "leadSource": "Henry AI Phone Assistant",
  "approximateArea": "900 sq ft",
  "existingFlooring": "Carpet",
  "demolition": "Yes",
  "materialSupply": "Needs help selecting material"
}
```

The response is:

```json
{ "success": true, "leadId": "..." }
```

Use the same `callSid` for retries. The endpoint updates the existing lead instead of creating another one.

### Suggested OpenAI tool schema

Use a tool named something like `submit_phone_intake` with these fields:

- `name`
- `phone`
- `email` (optional)
- `location`
- `service`
- `summary`
- `transcript`
- `callSid`
- `durationSeconds`
- `approximateArea` (optional)
- `existingFlooring` (optional)
- `demolition` (optional)
- `materialSupply` (optional)

The tool handler should call the endpoint above. Keep the existing call-ending tool separate; submit the intake first, then end the call only after a successful response.

## Recording webhook

Twilio usually makes the recording available after the call. Update the saved lead with:

```text
POST https://moliora.us/api/assistant/recording
Authorization: Bearer <ASSISTANT_WEBHOOK_SECRET>
```

JSON or form-data are accepted. Example:

```json
{
  "callSid": "CA...",
  "recordingUrl": "https://api.twilio.com/2010-04-01/Accounts/.../Recordings/RE...",
  "recordingSid": "RE...",
  "durationSeconds": 182
}
```

Twilio-style field names (`CallSid`, `RecordingUrl`, `RecordingSid`, `RecordingDuration`) are also accepted.

Once this webhook has run, tapping **🎧 Get voice** under the Telegram lead message sends the call audio into Telegram.

## Recommended final flow

```text
Website form
  → /api/contact
  → MongoDB CRM
  → email
  → Telegram text notification

Incoming phone call
  → Henry AI assistant
  → submit_phone_intake tool
  → /api/assistant/intake
  → MongoDB CRM
  → Telegram text notification + Get voice button
  → Twilio finishes recording
  → /api/assistant/recording
  → user taps Get voice
  → Telegram bot sends recording
```

Telegram errors are intentionally fail-soft: a Telegram outage must never prevent a lead from being saved.
