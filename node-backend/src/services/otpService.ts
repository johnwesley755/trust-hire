import { sendEmail } from './mailer';

export const generateAndSendOtp = async (email: string) => {
    // Basic OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);
    return otp;
};
