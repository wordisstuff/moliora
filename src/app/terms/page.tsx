import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Moliora LLC',
  description: 'Terms governing use of the Moliora website, estimate tools, quote requests and communications.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0f1111] text-white">
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-6 sm:pt-36">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6ad63]">Moliora LLC</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-white/50">Last updated: September 15, 2026</p>

        <div className="mt-10 space-y-9 text-[15px] leading-7 text-white/70">
          <section><h2 className="text-xl font-semibold text-white">1. Website Use</h2><p className="mt-2">This website is provided by Moliora LLC for general information, project planning, service inquiries and estimate requests. You agree to use the website lawfully and not to interfere with its operation or attempt to misuse its forms, tools or content.</p></section>

          <section><h2 className="text-xl font-semibold text-white">2. Estimates and Project Planning Tools</h2><p className="mt-2">Any price, range, quantity or other result produced by a website calculator or planning tool is preliminary and provided for planning purposes only. It is not a binding quote, offer, construction contract or guarantee of final price. Final scope and pricing may depend on measurements, material selection, site access, existing conditions, subfloor conditions and other project-specific factors.</p></section>

          <section><h2 className="text-xl font-semibold text-white">3. Quote Requests and Contact Consent</h2><p className="mt-2">When you submit a quote request or other inquiry and provide your contact information, you authorize Moliora LLC to contact you about that specific request using the phone number and/or email address you provided. Contact may include a phone call, text message or email reasonably related to your inquiry, scheduling, estimate or requested service.</p><p className="mt-3">Submitting an inquiry does not create a contract for construction or other services and does not obligate you to hire Moliora. Consent to project-related contact is not consent to unrelated promotional or mass-marketing messages.</p></section>

          <section><h2 className="text-xl font-semibold text-white">4. Service Agreements</h2><p className="mt-2">Actual work is governed by the applicable estimate, proposal, work order or other agreement accepted for that project. If there is a conflict between these website Terms and a signed or otherwise accepted project agreement, the project agreement controls for that work.</p></section>

          <section><h2 className="text-xl font-semibold text-white">5. Information You Provide</h2><p className="mt-2">You are responsible for providing reasonably accurate information when requesting an estimate or service. We use submitted information to review and respond to your inquiry as described in our Privacy Policy.</p></section>

          <section><h2 className="text-xl font-semibold text-white">6. Website Content</h2><p className="mt-2">Photos, descriptions, examples, product references and other website content are provided for general informational purposes. Product availability, colors, specifications, pricing and service availability may change. Images and digital previews may not exactly represent materials or finished results in person.</p></section>

          <section><h2 className="text-xl font-semibold text-white">7. Third-Party Services and Links</h2><p className="mt-2">The website may use or link to third-party services, suppliers or visualization tools. Those services may be governed by their own terms and privacy practices. Moliora is not responsible for the availability or operation of third-party websites or services outside our control.</p></section>

          <section><h2 className="text-xl font-semibold text-white">8. No Warranty for Website Availability</h2><p className="mt-2">We try to keep the website and its tools accurate and available, but they are provided on an “as available” basis. We do not guarantee uninterrupted access or that every website calculation, preview or piece of information will be error-free.</p></section>

          <section><h2 className="text-xl font-semibold text-white">9. Limitation of Website Liability</h2><p className="mt-2">To the extent permitted by applicable law, Moliora LLC is not responsible for indirect or consequential losses arising solely from reliance on preliminary website estimates, visualization tools or general website content. Nothing in these Terms limits rights or obligations that cannot legally be limited.</p></section>

          <section><h2 className="text-xl font-semibold text-white">10. Changes to These Terms</h2><p className="mt-2">We may update these Terms as the website or our services change. The current version and its update date will be posted on this page.</p></section>

          <section><h2 className="text-xl font-semibold text-white">11. Contact</h2><p className="mt-2">Questions about these Terms may be sent through the contact options provided on this website.</p></section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/10 pt-7 text-sm">
          <Link href="/policy" className="rounded-lg border border-white/15 px-4 py-2.5 text-white/75 transition hover:border-[#d6ad63] hover:text-[#f0c978]">Privacy Policy</Link>
          <Link href="/" className="rounded-lg border border-white/15 px-4 py-2.5 text-white/75 transition hover:border-[#d6ad63] hover:text-[#f0c978]">Back to Moliora</Link>
        </div>
      </div>
    </main>
  );
}
