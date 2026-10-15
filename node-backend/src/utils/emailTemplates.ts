export const getOtpTemplate = (otp: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TrustHyre Verification Code</title>
        <style>
            @media only screen and (max-width: 620px) {
                .email-card { width: 100% !important; border-radius: 12px !important; }
                .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
                .pad-left { padding: 24px 20px 12px 20px !important; }
                .pad-right { padding: 12px 20px 24px 20px !important; }
                .header-pad { padding: 18px 20px !important; }
                .footer-pad { padding: 14px 20px !important; }
                .footer-stack { display: block !important; width: 100% !important; text-align: center !important; margin: 4px 0 !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F8FAFC; font-family: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <!-- Main Horizontal Framed Canvas matching Landing Page Architecture -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 720px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(15, 47, 99, 0.08);">
                        
                        <!-- 1. Brand Top Bar: Deep Navy Hero Aesthetic (#0f2f63) -->
                        <tr>
                            <td class="header-pad" style="padding: 22px 36px; background-color: #0f2f63; border-bottom: 1px solid #1e3a8a;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="left" style="vertical-align: middle;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid rgba(255, 255, 255, 0.6); text-align: center; vertical-align: middle; background: rgba(255, 255, 255, 0.08);">
                                                        <span style="font-size: 13px; line-height: 1;">🛡️</span>
                                                    </td>
                                                    <td style="padding-left: 12px; vertical-align: middle;">
                                                        <span style="display: block; font-size: 17px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.18em; text-transform: uppercase;">Trust<span style="color: #60A5FA;">Hyre</span></span>
                                                        <span style="display: block; font-size: 9px; font-weight: 700; color: #93C5FD; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 1px;">Skills & Opportunities</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td align="right" style="vertical-align: middle;">
                                            <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.12); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.22); letter-spacing: 1.2px; text-transform: uppercase;">
                                                Identity Auth
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- 2. Main Body: Horizontal 2-Column Split View -->
                        <tr>
                            <td style="padding: 0; background-color: #FFFFFF;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <!-- Left Column: Context & Instructions -->
                                        <td class="stack-col pad-left" width="56%" valign="middle" style="padding: 36px 20px 36px 36px;">
                                            <div style="display: inline-block; padding: 4px 10px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px; color: #1D4ED8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                                Verification Required
                                            </div>
                                            <h1 style="margin: 0 0 10px 0; color: #0F2F63; font-size: 23px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25;">
                                                Verify Your Email
                                            </h1>
                                            <p style="margin: 0 0 16px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                                                Use this secure one-time passcode to confirm your identity and activate your verified portal access on TrustHyre.
                                            </p>
                                            <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.5;">
                                                If you did not request this verification, you can safely ignore this message. Your information remains completely protected.
                                            </p>
                                        </td>

                                        <!-- Right Column: Prominent Code Card -->
                                        <td class="stack-col pad-right" width="44%" valign="middle" style="padding: 36px 36px 36px 12px;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0F2F63; border-radius: 16px; border: 1px solid #1E3A8A; box-shadow: 0 6px 18px rgba(15, 47, 99, 0.15);">
                                                <tr>
                                                    <td style="padding: 24px 20px; text-align: center;">
                                                        <div style="color: #93C5FD; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.8px; margin-bottom: 12px;">
                                                            One-Time Passcode
                                                        </div>
                                                        <!-- Clean White Code Display Box -->
                                                        <div style="background-color: #FFFFFF; border-radius: 12px; padding: 14px 18px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                                                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0F2F63; font-family: 'Courier New', Courier, monospace; display: block; line-height: 1;">
                                                                ${otp}
                                                            </span>
                                                        </div>
                                                        <div style="color: #BFDBFE; font-size: 11px; font-weight: 600; letter-spacing: 0.3px;">
                                                            ⏱️ Valid for 15 minutes • Single Use
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- 3. Footer Bar: Minimal Clean Landing Style -->
                        <tr>
                            <td class="footer-pad" style="padding: 16px 36px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td class="footer-stack" align="left" style="color: #94A3B8; font-size: 11px; font-weight: 500;">
                                            &copy; ${new Date().getFullYear()} TrustHyre Inc. Verified Blue-Collar Staffing Platform.
                                        </td>
                                        <td class="footer-stack" align="right" style="color: #94A3B8; font-size: 11px; font-weight: 600;">
                                            🛡️ 256-Bit SSL Encrypted
                                        </td>
                                    </tr>
                                </table>
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
        <style>
            @media only screen and (max-width: 620px) {
                .email-card { width: 100% !important; border-radius: 12px !important; }
                .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
                .pad-left { padding: 24px 20px 12px 20px !important; }
                .pad-right { padding: 12px 20px 24px 20px !important; }
                .header-pad { padding: 18px 20px !important; }
                .footer-pad { padding: 14px 20px !important; }
                .footer-stack { display: block !important; width: 100% !important; text-align: center !important; margin: 4px 0 !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F8FAFC; font-family: 'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <!-- Main Horizontal Framed Canvas matching Landing Page Architecture -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 720px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(15, 47, 99, 0.08);">
                        
                        <!-- 1. Brand Top Bar: Deep Navy Hero Aesthetic (#0f2f63) -->
                        <tr>
                            <td class="header-pad" style="padding: 22px 36px; background-color: #0f2f63; border-bottom: 1px solid #1e3a8a;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="left" style="vertical-align: middle;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid rgba(255, 255, 255, 0.6); text-align: center; vertical-align: middle; background: rgba(255, 255, 255, 0.08);">
                                                        <span style="font-size: 13px; line-height: 1;">🛡️</span>
                                                    </td>
                                                    <td style="padding-left: 12px; vertical-align: middle;">
                                                        <span style="display: block; font-size: 17px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.18em; text-transform: uppercase;">Trust<span style="color: #60A5FA;">Hyre</span></span>
                                                        <span style="display: block; font-size: 9px; font-weight: 700; color: #93C5FD; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 1px;">Skills & Opportunities</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td align="right" style="vertical-align: middle;">
                                            <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.12); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.22); letter-spacing: 1.2px; text-transform: uppercase;">
                                                Password Reset
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- 2. Main Body: Horizontal 2-Column Split View -->
                        <tr>
                            <td style="padding: 0; background-color: #FFFFFF;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <!-- Left Column: Context & Instructions -->
                                        <td class="stack-col pad-left" width="56%" valign="middle" style="padding: 36px 20px 36px 36px;">
                                            <div style="display: inline-block; padding: 4px 10px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px; color: #1D4ED8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                                Account Security
                                            </div>
                                            <h1 style="margin: 0 0 10px 0; color: #0F2F63; font-size: 23px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25;">
                                                Reset Your Password
                                            </h1>
                                            <p style="margin: 0 0 16px 0; color: #475569; font-size: 14px; line-height: 1.6;">
                                                We received a request to reset your password. Use the authorization code opposite on the password recovery screen to proceed.
                                            </p>
                                            <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.5;">
                                                If you did not request a password reset, you can safely disregard this message. Your password remains unchanged.
                                            </p>
                                        </td>

                                        <!-- Right Column: Prominent Code Card -->
                                        <td class="stack-col pad-right" width="44%" valign="middle" style="padding: 36px 36px 36px 12px;">
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0F2F63; border-radius: 16px; border: 1px solid #1E3A8A; box-shadow: 0 6px 18px rgba(15, 47, 99, 0.15);">
                                                <tr>
                                                    <td style="padding: 24px 20px; text-align: center;">
                                                        <div style="color: #93C5FD; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.8px; margin-bottom: 12px;">
                                                            Authorization Code
                                                        </div>
                                                        <!-- Clean White Code Display Box -->
                                                        <div style="background-color: #FFFFFF; border-radius: 12px; padding: 14px 18px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                                                            <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0F2F63; font-family: 'Courier New', Courier, monospace; display: block; line-height: 1;">
                                                                ${token}
                                                            </span>
                                                        </div>
                                                        <div style="color: #BFDBFE; font-size: 11px; font-weight: 600; letter-spacing: 0.3px;">
                                                            ⏱️ Valid for 15 minutes • Single Use
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- 3. Footer Bar: Minimal Clean Landing Style -->
                        <tr>
                            <td class="footer-pad" style="padding: 16px 36px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td class="footer-stack" align="left" style="color: #94A3B8; font-size: 11px; font-weight: 500;">
                                            &copy; ${new Date().getFullYear()} TrustHyre Inc. Verified Blue-Collar Staffing Platform.
                                        </td>
                                        <td class="footer-stack" align="right" style="color: #94A3B8; font-size: 11px; font-weight: 600;">
                                            🛡️ 256-Bit SSL Encrypted
                                        </td>
                                    </tr>
                                </table>
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
