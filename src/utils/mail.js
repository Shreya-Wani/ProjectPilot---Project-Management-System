import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'ProjectPilot',
            link: 'https://projectpilot.com',
        },
    });

    // Generate an HTML email with the provided contents
    var emailHtml = mailGenerator.generate(options.mailGenContent);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false, // Use true for port 465, false for port 587
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: 'ProjectPilot <no-reply@projectpilot.com>',
        to: options.email,
        subject: options.subject,
        text: emailText, // Plain-text version of the message
        html: emailHtml, // HTML version of the message
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


const emailVerificationMailContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: 'Welcome to ProjectPilot! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with ProjectPilot, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const forgotPasswordMailContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: 'You have requested to reset your password.',
            action: {
                instructions: 'To get started with ProjectPilot, please click here:',
                button: {
                    color: '#2281bc', // Optional action button color
                    text: 'Reset your password',
                    link: passwordResetUrl,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

// sendMail({
//     email: user.email,
//     Subject: 'Please verify your email',
//     mailGenContent: emailVerificationMailContent(
//         username,
//         ``,
//     )
// })