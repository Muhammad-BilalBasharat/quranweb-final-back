import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../config/envConfig.js';

export const sendEmail = async (req, res) => {
    const { name, email, phone, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
    try {
        await transporter.verify();
        await transporter.sendMail({
            from: EMAIL_USER,
            to: EMAIL_USER,
            replyTo: email,
            subject: `Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        });
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('Email error:', err);
        return res.status(500).json({ error: 'Error sending email', details: err.message });
    }
};