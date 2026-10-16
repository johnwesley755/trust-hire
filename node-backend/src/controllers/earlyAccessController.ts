import { Context } from 'hono';
import { ApiResponse } from '../utils/ApiResponse';
import { sendEmail } from '../services/mailer';

const escapeHtml = (str: string): string => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const requestEarlyAccess = async (c: Context) => {
  try {
    const { email, name, role, companyName, phoneNumber } = (await c.req.json());
    if (!email || !email.includes('@')) {
      return c.json(ApiResponse.error("Valid email address is required"), 400 as any);
    }

    const safeName = name ? escapeHtml(name) : 'there';

    const fontStack = "'Plus Jakarta Sans', 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const htmlContent = `
      <div style="font-family: ${fontStack}; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="font-family: ${fontStack}; color: #0f172a; margin-bottom: 12px;">Welcome to TrustHyre Early Access</h2>
        <p style="font-family: ${fontStack}; color: #475569; font-size: 15px; line-height: 1.6;">Hi ${safeName},</p>
        <p style="font-family: ${fontStack}; color: #475569; font-size: 15px; line-height: 1.6;">Thank you for requesting early access to TrustHyre! We've received your request for our upcoming release and verified skilled workforce platform.</p>
        <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 20px 0; border-radius: 4px; font-family: ${fontStack};">
          <p style="font-family: ${fontStack}; margin: 0; color: #1e293b; font-weight: 600; font-size: 14px;">Your Priority Access ID: <span style="font-family: 'Plus Jakarta Sans', 'SF Mono', Consolas, monospace; color: #2563eb;">TH-${Date.now().toString(36).toUpperCase()}</span></p>
        </div>
        <p style="font-family: ${fontStack}; color: #475569; font-size: 14px;">Our onboarding team will reach out shortly with your exclusive preview credentials.</p>
        <p style="font-family: ${fontStack}; color: #94a3b8; font-size: 12px; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">© ${new Date().getFullYear()} TrustHyre Inc. Verified Blue-Collar Staffing Platform.</p>
      </div>
    `;

    await sendEmail(email, "Welcome to TrustHyre Early Access - Priority Confirmation", htmlContent).catch((e: any) => console.warn("Early access mail send notice:", e.message));

    return c.json(ApiResponse.ok("Early access requested successfully! Please check your email for confirmation.", { email, status: 'CONFIRMED' }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
