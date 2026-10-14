export const getOtpTemplate = (otp: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TrustHyre Verification Code</title>
    </head>
    <body style="margin: 0; padding: 24px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 680px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(10, 25, 49, 0.08);">
            <!-- Header Bar -->
            <tr>
                <td style="padding: 24px 36px; background: linear-gradient(135deg, #0A1931 0%, #0066FF 100%); border-bottom: 2px solid #0052CC;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="left" style="vertical-align: middle;">
                                <div style="display: inline-block; vertical-align: middle;">
                                    <span style="font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">Trust<span style="color: #60A5FA;">Hyre</span></span>
                                    <span style="display: block; font-size: 10px; font-weight: 700; color: #93C5FD; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">Identity & Workforce Verification</span>
                                </div>
                            </td>
                            <td align="right" style="vertical-align: middle;">
                                <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.25);">
                                    OTP AUTH
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Content Area: Horizontal Rectangular Layout -->
            <tr>
                <td style="padding: 36px 40px;">
                    <h2 style="margin: 0 0 12px 0; color: #0A1931; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">Verify Your Email Address</h2>
                    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        Use the following one-time verification code to securely complete your TrustHyre portal registration and access verified shifts.
                    </p>

                    <!-- Verification Code Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                            <td style="background-color: #F8FAFC; border: 2px dashed #0066FF; border-radius: 12px; padding: 22px 24px; text-align: center;">
                                <div style="color: #64748B; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                                    One-Time Passcode (Valid for 15 minutes)
                                </div>
                                <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0066FF; font-family: 'Courier New', Courier, monospace;">
                                    ${otp}
                                </div>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">
                        If you did not request this verification code, please ignore this email or reach out to <a href="mailto:support@trusthire.in" style="color: #0066FF; text-decoration: none; font-weight: 600;">support@trusthire.in</a> immediately.
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 18px 40px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="left" style="color: #94A3B8; font-size: 11px; font-weight: 500;">
                                &copy; ${new Date().getFullYear()} TrustHyre. All rights reserved.
                            </td>
                            <td align="right" style="color: #94A3B8; font-size: 11px; font-weight: 600;">
                                🛡️ 256-Bit SSL Encrypted Verification
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export const getResetPasswordTemplate = (token: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TrustHyre Password Reset</title>
    </head>
    <body style="margin: 0; padding: 24px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 680px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(10, 25, 49, 0.08);">
            <!-- Header Bar -->
            <tr>
                <td style="padding: 24px 36px; background: linear-gradient(135deg, #0A1931 0%, #0066FF 100%); border-bottom: 2px solid #0052CC;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="left" style="vertical-align: middle;">
                                <div style="display: inline-block; vertical-align: middle;">
                                    <span style="font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">Trust<span style="color: #60A5FA;">Hyre</span></span>
                                    <span style="display: block; font-size: 10px; font-weight: 700; color: #93C5FD; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">Account Security</span>
                                </div>
                            </td>
                            <td align="right" style="vertical-align: middle;">
                                <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.25);">
                                    PASSWORD RESET
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Content Area: Horizontal Rectangular Layout -->
            <tr>
                <td style="padding: 36px 40px;">
                    <h2 style="margin: 0 0 12px 0; color: #0A1931; font-size: 22px; font-weight: 800; letter-spacing: -0.3px;">Reset Your Password</h2>
                    <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                        We received a request to reset your password. Use the following authorization code on the password reset screen.
                    </p>

                    <!-- Reset Code Box -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                            <td style="background-color: #F8FAFC; border: 2px dashed #0066FF; border-radius: 12px; padding: 22px 24px; text-align: center;">
                                <div style="color: #64748B; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                                    Reset Code (Valid for 1 hour)
                                </div>
                                <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #0066FF; font-family: 'Courier New', Courier, monospace;">
                                    ${token}
                                </div>
                            </td>
                        </tr>
                    </table>

                    <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 1.5;">
                        If you did not request a password reset, you can safely disregard this message. Your password remains unchanged.
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 18px 40px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="left" style="color: #94A3B8; font-size: 11px; font-weight: 500;">
                                &copy; ${new Date().getFullYear()} TrustHyre. All rights reserved.
                            </td>
                            <td align="right" style="color: #94A3B8; font-size: 11px; font-weight: 600;">
                                🛡️ 256-Bit SSL Encrypted Verification
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};
