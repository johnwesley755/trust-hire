export const getOtpTemplate = (otp: string) => {
    return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; max-width: 500px; margin: 0 auto;">
            <div style="background-color: #0f172a; padding: 32px 30px; text-align: center; border-bottom: 4px solid #facc15;">
                <img src="https://res.cloudinary.com/dbhncc3db/image/upload/v1731671850/trusthyre-logo-light_v2.png" alt="TrustHyre" style="height: 40px; display: block; margin: 0 auto;" onerror="this.outerHTML='<h1 style=\\'color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\\'>Trust<span style=\\'color: #facc15;\\'>Hyre</span></h1>'" />
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 700; text-align: center;">Verify your email address</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 32px; text-align: center;">
                    Please use the following 6-digit verification code to complete your TrustHyre registration.
                </p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
                    <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Your Verification Code</p>
                    <span style="font-size: 36px; font-weight: 900; letter-spacing: 0.25em; color: #0f172a; font-family: monospace;">${otp}</span>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
                    This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.
                </p>
            </div>
            <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0; font-weight: 500;">
                    &copy; ${new Date().getFullYear()} TrustHyre Protocol. All rights reserved.<br/>
                    <span style="color: #cbd5e1;">Securely processed via 256-bit encryption</span>
                </p>
            </div>
        </div>
    </div>
    `;
};

export const getResetPasswordTemplate = (token: string) => {
    return `
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
        <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; max-width: 500px; margin: 0 auto;">
            <div style="background-color: #0f172a; padding: 32px 30px; text-align: center; border-bottom: 4px solid #facc15;">
                <img src="https://res.cloudinary.com/dbhncc3db/image/upload/v1731671850/trusthyre-logo-light_v2.png" alt="TrustHyre" style="height: 40px; display: block; margin: 0 auto;" onerror="this.outerHTML='<h1 style=\\'color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;\\'>Trust<span style=\\'color: #facc15;\\'>Hyre</span></h1>'" />
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 700; text-align: center;">Reset your password</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 32px; text-align: center;">
                    We received a request to reset your password for your TrustHyre account.
                </p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
                    <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Your Reset Code</p>
                    <span style="font-size: 36px; font-weight: 900; letter-spacing: 0.25em; color: #0f172a; font-family: monospace;">${token}</span>
                </div>
                <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
                    Enter this code on the password reset page. If you didn't request a password reset, you can safely ignore this email.
                </p>
            </div>
            <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0; font-weight: 500;">
                    &copy; ${new Date().getFullYear()} TrustHyre Protocol. All rights reserved.<br/>
                    <span style="color: #cbd5e1;">Securely processed via 256-bit encryption</span>
                </p>
            </div>
        </div>
    </div>
    `;
};
