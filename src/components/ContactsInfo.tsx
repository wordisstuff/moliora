import { email, phoneDisplay, phoneHref, serviceArea } from '@/config/company';

const ContactsInfo = () => {
    return (
        <ul className="space-y-3">
            <li>
                <span className="text-white/40">Phone:</span>{' '}
                <a
                    className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                    href={phoneHref}
                >
                    {phoneDisplay}
                </a>
            </li>

            <li>
                <span className="text-white/40">Email:</span>{' '}
                <a
                    className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                    href={`mailto:${email}`}
                >
                    {email}
                </a>
            </li>

            <li>
                <span className="text-white/40">Service area:</span>{' '}
                {serviceArea}
            </li>
        </ul>
    );
};

export default ContactsInfo;
