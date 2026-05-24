'use client';

import React, { useEffect, useState } from 'react';

const ContactsInfo = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        setEmail('support@moliora.us');
        setPhone('(612) 468-3176');
    }, []);

    return (
        <ul className="space-y-3">
            <li>
                <span className="text-white/40">Phone:</span>{' '}
                <a
                    className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                    href="tel:+16124683176"
                >
                    {phone}
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
                Minneapolis–St. Paul, MN
            </li>
        </ul>
    );
};

export default ContactsInfo;
