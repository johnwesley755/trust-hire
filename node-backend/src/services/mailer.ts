export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const apiKey = (process.env.BREVO_API_KEY || '').trim();
    if (!apiKey) {
      console.error('BREVO_API_KEY is not configured in environment variables or Cloudflare secrets.');
      throw new Error('Email delivery is not configured: BREVO_API_KEY is missing.');
    }

    if (apiKey.startsWith('xsmtpsib-')) {
      console.error('Configuration mismatch: BREVO_API_KEY is set to an SMTP password (xsmtpsib-...) instead of a Brevo v3 REST API key (xkeysib-...).');
      throw new Error('Invalid Brevo API Key: You are using an SMTP relay key (starts with "xsmtpsib-"). The Brevo REST API requires an API key starting with "xkeysib-". Please generate a new API key in Brevo Dashboard under Settings > SMTP & API > API Keys tab.');
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'johnwesley8113@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'TrustHyre';

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API Error:', errorText);
      throw new Error(`Brevo API Error: ${errorText}`);
    }

    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error: any) {
    console.error('Error sending email: ', error);
    throw error;
  }
};
