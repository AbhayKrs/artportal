import React from 'react'

export const Privacy = (props) => {
    return (
        <div className='flex flex-col gap-3 col-span-3 p-2 text-neutral-700 dark:text-gray-300'>
            <h1 className="text-2xl font-medium tracking-wide">artportal Privacy Policy</h1>
            <p className="text-lg tracking-wide">Last updated: July 14, 2025</p>
            <p className="text-lg tracking-wide">We are committed to protecting your personal information. This Privacy Policy applies to www.artstation.com. Contact us at <a href="mailto:privacy@artstation.com" class="text-blue-600 hover:underline">privacy@artstation.com</a> with questions.</p>

            <div class="space-y-6">
                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">1. Scope</h2>
                    <p className="text-lg tracking-wide pl-5">This policy covers personal information of individuals, not corporate entities, and does not limit collection of exempted information like business contact or publicly available data.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">2. Changes</h2>
                    <p className="text-lg tracking-wide pl-5">We may update this policy by posting changes on our website. Check regularly for updates.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">3. Purposes</h2>
                    <p className="text-lg tracking-wide pl-5">We collect personal information (e.g., name, email, payment details, IP address) to:</p>
                    <ul className='list-disc pl-7'>
                        <li>Communicate with you and process orders.</li>
                        <li>Customize ads, content, and user experience.</li>
                        <li>Administer services, contests, and newsletters.</li>
                        <li>Prevent fraud, comply with laws, and improve services.</li>
                    </ul>
                    <p className="text-lg tracking-wide pl-5">New purposes will be disclosed, and consent sought unless permitted by law.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">4. Basis for Processing</h2>
                    <p className="text-lg tracking-wide pl-5">We process data based on:</p>
                    <ul className='list-disc pl-7'>
                        <li><strong>Contractual Necessity:</strong> To provide services (e.g., account setup, purchases).</li>
                        <li><strong>Legitimate Interests:</strong> To improve services, personalize experiences, and prevent fraud.</li>
                        <li><strong>Legal Obligations:</strong> To comply with legal requests.</li>
                        <li><strong>Consent:</strong> When you explicitly agree, which you may withdraw.</li>
                    </ul>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">5. Data Transfers</h2>
                    <p className="text-lg tracking-wide pl-5">Your data may be processed globally, including in the U.S., under safeguards like Standard Contractual Clauses for EU data. We share data with business partners, service providers, and authorities as needed.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">6. Cookies</h2>
                    <p className="text-lg tracking-wide pl-5">We use cookies to enhance your experience. You can manage cookie settings in your browser, though this may limit site functionality.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">7. Consent</h2>
                    <p className="text-lg tracking-wide pl-5">We won’t sell or rent your data without consent, except where legally permitted (e.g., public data, legal advice). You may withdraw consent with notice, which may affect service availability.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">8. Data Limits</h2>
                    <p className="text-lg tracking-wide pl-5">We collect only necessary data, retain decision-related data for one year, and securely destroy unneeded data.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">9. Accuracy</h2>
                    <p className="text-lg tracking-wide pl-5">We strive to keep data accurate. You can update your information or request corrections, which we’ll share with relevant third parties if needed.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">10. Safeguards</h2>
                    <p className="text-lg tracking-wide pl-7">We use reasonable security measures to protect your data, but electronic transmission is not fully secure. Service providers are contractually obligated to maintain confidentiality.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">11. Access & Deletion</h2>
                    <p className="text-lg tracking-wide pl-7">Request access to or deletion of your data via account settings or email. We’ll respond within 30 days, but may refuse access for legal reasons, notifying you in writing.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">12. Third-Party Links</h2>
                    <p className="text-lg tracking-wide pl-7">We're not responsible for the privacy practices of linked third-party websites.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">13. Google Sign-In</h2>
                    <p className="text-lg tracking-wide pl-7">Using Google Sign-In shares your name, email, and profile picture with us. You can remove access via Google settings; deleting your artportal account removes Google access.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">14. Governing Law</h2>
                    <p className="text-lg tracking-wide pl-7">Disputes are governed by the laws and venue in section 43 of the <a href="https://www.artstation.com/tos" class="text-blue-600 hover:underline">Terms of Service</a>.</p>
                </section>

                <section className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">15. Complaints</h2>
                    <p className="text-lg tracking-wide pl-7">Contact us first at <a href="mailto:privacy@artstation.com" class="text-blue-600 hover:underline">privacy@artstation.com</a>. You may also reach your local Data Protection Authority: <a href="https://edpb.europa.eu/about-edpb/board/members_en" class="text-blue-600 hover:underline">EEA</a>, <a href="https://ico.org.uk/global/contact-us/" class="text-blue-600 hover:underline">UK</a>, <a href="https://www.edoeb.admin.ch/edoeb/en/home/the-fdpic/contact.html" class="text-blue-600 hover:underline">Switzerland</a>.</p>
                </section>
            </div>
        </div>
    )
}

export default Privacy