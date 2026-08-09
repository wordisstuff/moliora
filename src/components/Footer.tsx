import Link from 'next/link';
import ContactsInfo from './ContactsInfo';

const services = [
    'Window Installation',
    'Door Installation',
    'Deck Repair',
    'Remodeling',
    'Exterior Services',
    'Handyman Services',
];

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#080909] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
                <div>
                    <div className="text-3xl font-semibold tracking-[0.3em]">
                        MOLIORA
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.45em] text-[#d6ad63]">
                        Construction
                    </div>

                    <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                        Building quality homes and lasting relationships across
                        Minnesota.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.25em] text-[#d6ad63]">
                        Services
                    </h4>

                    <ul className="mt-5 space-y-3 text-sm text-white/65">
                        {services.map(service => (
                            <li key={service}>{service}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.25em] text-[#d6ad63]">
                        Company
                    </h4>

                    <ul className="mt-5 space-y-3 text-sm text-white/65">
                        <li>
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-white">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-white">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <a href="#projects" className="hover:text-white">
                                Projects
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.25em] text-[#d6ad63]">
                        Contact
                    </h4>

                    <div className="mt-5 text-sm text-white/65">
                        <ContactsInfo />
                    </div>

                    <p className="mt-5 text-sm text-white/50">
                        Proudly serving Minneapolis–St. Paul and surrounding
                        areas.
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} Moliora Construction. All
                        rights reserved.
                    </p>

                    <div className="flex gap-5">
                        <Link href="/policy" className="hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-white">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
