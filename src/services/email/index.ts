import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { createEmailhistory } from '../../helpers/emailhistory';
import { generateCustomJwtToken, getRandomOtp } from '../../helpers/utils';
import { setToRedis } from '../../services/redis';

const from = process.env.GSUITE_EMAIL_ADDRESS;
const mailClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: from,
    pass: process.env.GSUITE_EMAIL_PASSWORD,
  },
});

export const sendGSuiteEmail = async (
    email: string,
    subject: string,
    html: string,
    text?: string,
   
    htmlTemplate? : {
        filename: string,
        replacements: string,}
        
) => {
    try {
        email = process.env.NODE_ENV == "production" 
        ? email : "emon.ostad@gmail.com";
    console.log(`Sending email to ${email}. Subject: ${subject}`);

    if (htmlTemplate && htmlTemplate.filename) {
        const htmlFile = fs.readFileSync(
            path.join(__dirname, "templates", htmlTemplate.filename),
            {encoding: "utf-8"}
        );
        const handlebarsTemplate = handlebars.compile(htmlFile);
        html = handlebarsTemplate(htmlTemplate.replacements || {});
    
    }
    const details = {
        from: `Visage <${from}>`,
        to: email,
        subject,
        text,
        html,
    }

    const response = await mailClient.sendMail(details);
     /** used require(...), otherwise it will cause circular dependency */

     createEmailhistory({
        email_subject: subject,
        email_body: html || text,
        to: email,
        from,
        email_status: response.accepted.length ? "sent" : "failed",
        raw_response: response,
        is_html: !!html
     });

    } catch (error) {
        createEmailhistory({
            email_subject: subject,
            email_body: html || text,
            to: email,
            from,
            email_status: "failed",
            raw_response: error,
            is_html: !!html
         });
        console.log(`Failed during email sending ${email}`);
        console.log("ERROR sendGSuiteEmail", error);
    }
}


export const sendVerificationEmail = async (_id: string, email: string, fixed_otp?: string) => {
    const expireHours = 48;
    const verificationToken = generateCustomJwtToken(
        { _id,  email},
        60 * 60 * expireHours
    );

    const verificationLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
    let otp = fixed_otp || getRandomOtp(email);
    await setToRedis(email, otp, 60* 10);

    sendGSuiteEmail(
        email,
        "Visage OTP CODE",
        `<div>Your verification code for Visage: <b>${otp}</b?</div>`,
    );
    return process.env.NODE_ENV != "production"
    ? { verificationToken, verificationLink }
    : undefined;
} 