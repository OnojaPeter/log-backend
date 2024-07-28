const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587, //587 for TLS
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

app.post('/contact', async (req, res) => {
    const { name, email, company, message } = req.body;

    try {
        const mailToUser = {
            from: '"LogDigital Ltd." <info@logdigitalltd.com>', // Sender address
            to: email, // Receiver address from contact form
            subject: 'Thank you for reaching out to LogDigital Ltd.', // Subject line
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 5px; background-color: #ffffff;">
                <h2 style="color: #555555;">Thank you for reaching out to LogDigital Ltd.</h2>
                <p>We have received your message and one of our team members will get back to you as soon as possible.</p>
                <p>If your inquiry is urgent, please use the phone number listed below to talk to one of our staff members. Otherwise, we will respond to your email within 24-48 hours.</p>
                <p>In the meantime, feel free to browse our website and social media handles for more information about our services.</p>
                <p>Best regards,</p>
                <p><strong>LogDigital Ltd.</strong></p>
                <p>
                    <strong>Phone:</strong> [Your Phone Number]<br>
                    <strong>Email:</strong> <a href="mailto:info@logdigitalltd.com" style="color: #1a73e8; text-decoration: none;">info@logdigitalltd.com</a><br>
                    <strong>Website:</strong> <a href="https://www.logdigitalltd.com" style="color: #1a73e8; text-decoration: none;">www.logdigitalltd.com</a><br>
                    <strong>Follow us:</strong>
                    <a href="https://www.facebook.com/profile.php?id=61558437026463&mibextid=ZbWKwL" style="color: #1a73e8; text-decoration: none;">Facebook</a> |
                    <a href="https://x.com/LogDigitalL" style="color: #1a73e8; text-decoration: none;">Twitter</a> |
                    <a href="https://www.instagram.com/logdigital_limited?igsh=MW9qNWoyZzU1N3p6cw==" style="color: #1a73e8; text-decoration: none;">Instagram</a>|
                    <a href="https://www.linkedin.com/company/logdigital-limited" style="color: #1a73e8; text-decoration: none;">Linkedin</a>
                </p>
                </div>
            </body>
            </html>
            `,
        };
          
        const mailToLog = {
            from: '"LogDigital Ltd." <info@logdigitalltd.com>', // Sender address
            to: process.env.EMAIL, // Log address from contact form
            subject: 'Inquiry received', // Subject line
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 5px; background-color: #ffffff;">
                <h2 style="color: #555555;">You have received an inquiry via your website. Here are the details:</h2>
                
                <strong>Name:</strong> ${name} <br>
                <strong>Email:</strong> ${email}<br>
                ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                <strong>Message:</strong> ${message}<br>

                <p>Please follow up with the individual at your earliest convenience..</p>
                
                </div>
            </body>
            </html>
            `,
        };
       
        const sendToUser = await transporter.sendMail(mailToUser);
        const sendToLog = await transporter.sendMail(mailToLog);

        res.status(200).send('Message sent successfully!');
    } catch (error) {
        // console.log('error:',error)
        res.status(500).send('Failed to send email. Please try again later.');
    }  
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
