import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';
import { emailOption } from '../../@types/user';

dotenv.config();

export const sendMail = async (options: emailOption) => {
    try {
        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })
        const { email, subject, template, data } = options;

        const emailTemplate = path.join(__dirname, '../../view', template);

        const html = await ejs.renderFile(emailTemplate, data);

        console.log("html", html)
        let mailOption = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject,
            html
        } as any

        await transporter.sendMail(mailOption);

    } catch (error: any) {
        return new Error(error.message)
    }



}


