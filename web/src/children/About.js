import { Link } from 'react-router-dom'
import DefaultIcon from '../assets/images/panda.png';

export const About = (props) => {
    return (
        <div className='flex flex-col gap-3 col-span-3 p-2 text-neutral-700 dark:text-gray-300'>
            <div className="space-y-6">
                <h1 className="text-2xl italic font-medium tracking-wide">"Protecting Creativity. Empowering Community."</h1>
                <section className="flex flex-col gap-2">
                    <p className="text-base tracking-wide">Every artist begins with a blank canvas. A sketch. A vision. A moment of expression that deserves to be seen and remembered.</p>
                    <p className="text-base tracking-wide">But the digital world has changed the way art lives online. With every upload came new risks - work being copied, scraped, or lost in the noise of algorithms that valued clicks over creativity. Artists need more than a platform; they needed a safe home now more than anything.</p>
                    <p className="text-base tracking-wide">That's how artportal was born.</p>
                    <p className="text-base tracking-wide">We reimagined the digital art space, where an artist's portfolio could exist with the security it deserves, free from misuse and exploitation. A space where AI cannot strip away ownership, where every brushstroke, every design and every photograph remains firmly in the hands of its creator.</p>
                    <p className="text-base tracking-wide">But there is more to artportal than protection, it is a community driven environment for creators who believe in art's power to inspire, connect and embrace. Here, we hope you can grow connections and have those connections grow into opportunities.</p >
                </section >
                <section className='flex flex-col gap-2'>
                    <iframe className='rounded-md' width="650" height="400" src="https://www.youtube.com/embed/xvFZjo5PgG0?si=zeEqzKp1e47gMedV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </section>
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-medium tracking-wide">Our mission</h3>
                    <ul className='list-disc pl-7'>
                        <li>Create a Safe Showcase - Provide a platform where artists can confidently upload and present their work without fear of misuse.</li>
                        <li>Ensure Security in the Age of AI - Protect creativity from unauthorized scraping, copying, or exploitation.</li>
                        <li>Empower Artists with Ownership - Give creators full control over how their work is displayed, shared, and licensed.</li>
                        <li>Support Easy Upload & Storage - Make it simple and reliable to upload, organize, and archive creative work.</li>
                        <li>Enhance Visibility & Discovery - Use smart categorization, curation, and trending systems so every artist has the chance to be seen.</li>
                        <li>Enable Earnings & Opportunities - Provide pathways for artists to monetize their work, gain recognition, and access professional opportunities.</li>
                        <li>Foster a Strong Community - Build an inclusive environment where artists connect, collaborate, and inspire one another.</li>
                        <li>Promote Long Term Growth - Offer insights, tools, and resources that help artists evolve their craft and careers.</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-medium tracking-wide">Who it's for</h3>
                    <p className="text-lg tracking-wide">ArtPortal is built for everyone who believes in the power of creativity and wants a safe, professional, and supportive space to share it.</p>
                    <ul className='list-disc pl-7'>
                        <li>Artists & Creators - Painters, illustrators, digital artists, designers, and photographers who want to build a secure digital library and professional portfolio of their work.</li>
                        <li>Emerging Talent - New creators looking for their first platform to showcase art, connect with a supportive community, and grow their creative identity.</li>
                        <li>Established Professionals - Creatives seeking visibility, secure storage, and meaningful opportunities to monetize and expand their careers.</li>
                        <li>Community Builders - Those who value collaboration and want to share their work in an environment built on authenticity and respect.</li>
                        <li>Collectors & Enthusiasts - People who want to discover art, support artists, and engage with authentic creative communities.</li>
                        <li>With tools for digital safety, secure storage, community engagement, and earnings, ArtPortal is for anyone who wants their art to not only be seen—but also protected, valued, and celebrated.</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-medium tracking-wide">Key features</h3>
                    <ul className="tracking-wide" aria-hidden="false">
                        <li><strong>Art Library</strong> - A secure and organized space to upload, store, and showcase your entire body of work.</li>
                        <li><strong>Portfolio Management</strong> - Structured, visually refined project pages to present your body of work.</li>
                        <li><strong>Community & Networking</strong> - Tools to connect with peers, collaborators, and industry professionals.</li>
                        <li><strong>Engagement Insights</strong> - Actionable metrics for visibility, trends, and audience interaction.</li>
                        <li><strong>Discovery & Categories</strong> - Curated and algorithmic discovery to surface relevant work to the right audiences.</li>
                        <li><strong>Marketplace</strong> - A trusted space for buying, selling, and licensing art directly from creators.</li>
                        <li><strong>Earnings Space</strong> - Opportunities for artists to monetize their work, gain recognition, and access financial growth.</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-medium tracking-wide">The Team</h3>
                    <div className="flex flex-row gap-6">
                        {['CEO', 'CTO', 'Product Manager', 'UI/UX Lead', 'Sales & Marketing'].map(itx => (
                            <div className='flex flex-col gap-1 items-center'>
                                <img className='h-12 rounded-md' src={DefaultIcon} />
                                <p className="text-base text-center font-medium tracking-wide">Abhay ({itx})</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-500 italic tracking-wide">* It is a one man show :)</p>
                </div>
            </div>
        </div >
    )
}

export default About