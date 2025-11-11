import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({ region: process.env.AWS_REGION });

/**
 * @param phone номер в форматі +1XXXXXXXXXX
 * @param message текст
 * @param transactional true — сервісні/коди / false — реклама
 */
export async function sendSMS(
    phone: string,
    message: string,
    transactional = true,
) {
    if (!phone.startsWith('+1')) {
        throw new Error('Phone must be E.164 US format, e.g. +16124683176');
    }

    const cmd = new PublishCommand({
        PhoneNumber: phone,
        Message: message,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                DataType: 'String',
                StringValue: process.env.SMS_SENDER_ID || 'MOLIORA',
            },
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: transactional ? 'Transactional' : 'Promotional',
            },
        },
    });

    const res = await sns.send(cmd);
    return res.MessageId;
}
export function toE164US(input: string) {
    const digits = input.replace(/\D/g, '');
    // приймаємо 10 цифр як US (6124683176) -> +16124683176
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
    if (digits.startsWith('+')) return input;
    throw new Error('Invalid US phone number');
}
