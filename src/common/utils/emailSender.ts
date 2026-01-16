import nodemailer from 'nodemailer';
import configuration from 'src/config/configuration';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: configuration().nodeMiller.email_user,
        pass: configuration().nodeMiller.email_pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const emailSender = async (
    subject: string,
    email: string,
    html: string,
) => {
    try {
        const info = await transporter.sendMail({
            from: configuration().nodeMiller.email_from,
            to: email,
            subject,
            html,
        });

        // console.log('Message sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email send failed:', error);
        throw error;
    }
};

export default emailSender;
