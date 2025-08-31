import React from 'react'

export const TOS = (props) => {
    return (
        <div className='flex flex-col gap-3 col-span-3 p-2 text-neutral-700 dark:text-gray-300'>
            <h1 className="text-3xl font-medium tracking-wide">artportal Terms of Service</h1>
            <p className="text-lg tracking-wide">Last updated: July 14, 2025</p>
            <p className="text-lg tracking-wide">By using artportal.com ("Site"), you agree to these Terms of Use. Please also review our <a href="/privacy-policy">Privacy Policy</a>. Your agreement is with Epic Games, Inc. (U.S. residents) or Epic Games Commerce GmbH (non-U.S. residents).</p>

            <div className="flex flex-col gap-2 pl-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">1. Membership</h2>
                    <p className="text-lg tracking-wide pl-5">Non-members can view some content but must comply with conduct standards. Members receive additional benefits, which may change. Services include artportal Learning, Marketplace, and more, provided by Epic or third parties.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">2. Eligibility</h2>
                    <p className="text-lg tracking-wide pl-5">You must be 18 or older and able to form legally binding contracts. Minors are not allowed to use artportal.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">3. Account & Security</h2>
                    <p className="text-lg tracking-wide pl-5">Choose a non-offensive username and keep your password secure. You are responsible for all account activity and must provide accurate, current information.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">4. Use of Services</h2>
                    <p className="text-lg tracking-wide pl-5">Use Services only through the Site’s interface for personal purposes. Do not resell or transfer Services.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">5. Payment</h2>
                    <p className="text-lg tracking-wide pl-5">Pay posted prices plus taxes for premium services or products in advance. Use approved payment methods and resolve disputes with third-party processors directly. Overdue amounts accrue 18% annual interest.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">6. artportal Learning</h2>
                    <p className="text-lg tracking-wide pl-5">Eligible members can access instructional videos and digital resources. You may not copy, modify, or distribute Learning Resources except for personal use. Restrictions apply to prevent misuse.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">7. artportal Marketplace (Content Providers)</h2>
                    <p className="text-lg tracking-wide pl-5">Commercialize Digital Products (e.g., tutorials, assets) or Hard Products (e.g., prints) through the Marketplace. Set prices and license terms for Digital Products; Epic retains a commission. For Hard Products, set mark-ups; Epic or suppliers manufacture them. Ensure accurate descriptions and legal rights for Your Content. You’re responsible for taxes and customer disputes.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">8. artportal Marketplace (Content Acquirers)</h2>
                    <p className="text-lg tracking-wide pl-5">Purchase Digital or Hard Products under provider-specified license terms. Epic is not responsible for content issues or delivery delays. Pay listed prices plus taxes and shipping. Refunds follow our policies.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">9. Content Rules</h2>
                    <p className="text-lg tracking-wide pl-5">Comply with laws, Epic's policies, and privacy regulations. Your Content remains yours; Epic owns Site content and tools. Grant Epic a worldwide, royalty-free license to use Your Content for Services and Safety/Discovery Tools. Tag AI-generated Digital Products with “CreatedWithAI.” Do not use “NoAI” tagged content for AI purposes.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">10. Prohibited Actions</h2>
                    <ul className='list-disc pl-7'>
                        <li>Reverse engineer or hack the Site or Services.</li>
                        <li>Post defamatory, illegal, or harmful content.</li>
                        <li>Upload viruses or harmful components.</li>
                        <li>Engage in spam, unauthorized access, or data scraping.</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">11. Termination</h2>
                    <p className="text-lg tracking-wide pl-7">Epic may suspend/terminate accounts for non-payment, breaches, or inactivity (365+ days). You may terminate your account anytime. Upon termination, you lose access, forfeit credits, and must pay outstanding amounts.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">12. Liability & Indemnity</h2>
                    <p className="text-lg tracking-wide pl-7">Outside EU: Services are “as is”; Epic’s liability is limited to $500. EU: Statutory warranties apply; liability for slight negligence is limited to foreseeable damages. You indemnify Epic against claims related to Your Content or breaches.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">13. Governing Law</h2>
                    <p className="text-lg tracking-wide pl-7">Content Providers or non-EU Content Acquirers: North Carolina law applies; disputes go to Wake County courts. EU Content Acquirers: Your country’s laws apply.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium tracking-wide">14. Miscellaneous</h2>
                    <p className="text-lg tracking-wide pl-7">Epic may modify this Agreement with notice. You cannot assign this Agreement without Epic’s consent. Epic is not liable for delays beyond its control. EU users: Statutory withdrawal rights apply.</p>
                </div>
            </div>


            <p className="text-lg tracking-wide pl-5"><strong>EU Monthly Active Users (Feb 14, 2025):</strong> Estimated 1.1M average over the past six months.</p>
        </div>
    )
}

export default TOS