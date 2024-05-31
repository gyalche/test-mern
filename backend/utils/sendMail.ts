import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

export const sendMail = async (options: any) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'smtp',
            auth: {
                user: 'fupulamu01@gmail.com',
                pass: 'dawadawa0101',
            }
        })

        const { email, subject, template, data } = options;

        const emailTemplate = path.join(__dirname, '../view', template);
        const htmlFile = ejs.renderFile(emailTemplate, data);
        console.log("🚀 ~ sendMail ~ htmlFile:", htmlFile)

        let mailOption = {
            from: 'fupulamu01@gmail.com',
            to: email,
            subject,
            html: htmlFile
        } as any

        await transporter.sendMail(mailOption)
    }

    catch (err) {

    }

}