import React from 'react';
import { AuthHeader } from '../../auth/components/AuthHeader';
import { AuthFooter } from '../../auth/components/AuthFooter';
import { motion } from 'framer-motion';

const TermsPage = () => {
    return (
        <div className="bg-[#F8FAFC] text-[#0A1931] font-body min-h-screen flex flex-col antialiased">
            <AuthHeader />
            
            <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-headline font-black mb-8 tracking-tight">Terms of Service</h1>
                    <p className="text-sm font-bold text-[#0A1931]/60 uppercase tracking-widest mb-12">Last Updated: May 2, 2026</p>
                    
                    <div className="space-y-12 max-w-none">
                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">1. Agreement to Terms</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                By accessing or using TrustHire, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">2. Use License</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 mb-6 text-lg">
                                Permission is granted to temporarily download one copy of the materials (information or software) on TrustHire's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[#0A1931]/80">
                                <li>Modify or copy the materials.</li>
                                <li>Use the materials for any commercial purpose, or for any public display.</li>
                                <li>Attempt to decompile or reverse engineer any software contained on TrustHire's website.</li>
                                <li>Remove any copyright or other proprietary notations from the materials.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">3. Disclaimer</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                The materials on TrustHire's website are provided on an 'as is' basis. TrustHire makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">4. Limitations</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                In no event shall TrustHire or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TrustHire's website, even if TrustHire or a TrustHire authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-headline font-extrabold mb-4 text-[#0A1931]">5. Governing Law</h2>
                            <p className="leading-relaxed text-[#0A1931]/80 text-lg">
                                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
            
            <AuthFooter />
        </div>
    );
};

export default TermsPage;
