'use client';
import React, { useEffect, useState } from 'react';

const ContactsInfo = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const emailUser = 'support';
        const emailDomain = 'moliora.us';
        setEmail(`${emailUser}@${emailDomain}`);

        const phoneCode = '+1';
        const phoneNumber = '(612) 468-3176';
        setPhone(`${phoneCode} ${phoneNumber}`);
    }, []);

    return (
        <ul className="mt-3 space-y-2">
            <li>
                <span className="opacity-70">Phone:</span>{' '}
                <a
                    className="underline-offset-2 hover:underline"
                    href={`tel:${phone}`}
                >
                    {phone}
                </a>
            </li>
            <li>
                <span className="opacity-70">Email:</span>{' '}
                <a
                    className="underline-offset-2 hover:underline"
                    href={`mailto:${email}`}
                >
                    {email}
                </a>
            </li>
            <li>
                <span className="opacity-70">Service area:</span>{' '}
                Minneapolis–St. Paul, MN
            </li>
        </ul>
    );
};

export default ContactsInfo;
