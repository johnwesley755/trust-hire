import React from 'react';
import { AuthHeader } from '../../auth/components/AuthHeader';
import { AuthFooter } from '../../auth/components/AuthFooter';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
    return (
        <div className="bg-[#F8FAFC] text-[#0A1931] font-body min-h-screen flex flex-col antialiased">
            <AuthHeader />
            
            <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-headline font-black mb-8 tracking-tight">Privacy Policy</h1>
                    <p className="text-sm font-bold text-[#0A1931]/60 uppercase tracking-widest mb-12">Last Updated: May 2, 2026</p>
                    
                    <div className="space-y-12 max-w-none">
                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">1. Introduction</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                Welcome to TrustHire. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">2. The Data We Collect</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 mb-6 text-lg">
                                Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[#0A1931]/80">
                                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data</strong> includes IP network address, your login data, browser type and version, and operating system and platform.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">3. How We Use Your Data</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 mb-6 text-lg">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[#0A1931]/80">
                                <li>To register you as a new user.</li>
                                <li>To provide and manage our services.</li>
                                <li>To manage our relationship with you.</li>
                                <li>To improve our website, services, and user experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">4. Data Security</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">5. Your Legal Rights</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access to your personal data, request correction of your personal data, request erasure of your personal data, and the right to withdraw consent.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            
            <AuthFooter />
        </div>
    );
};

export default PrivacyPage;
