export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || "TrustHire",
          email: process.env.BREVO_SENDER_EMAIL
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
