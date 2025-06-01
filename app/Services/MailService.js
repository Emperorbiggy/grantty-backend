const nodemailer = require('nodemailer')

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',  // convert string to boolean
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })
  }

  async sendVerificationEmail(toEmail, fullName, verificationCode) {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: toEmail,
      subject: 'Email Verification Code',
      html: `
        <p>Hello ${fullName},</p>
        <p>Thanks for registering on our platform.</p>
        <p>Your email verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>Use this code to complete your registration.</p>
        <p>Best regards,<br/>The ${process.env.MAIL_FROM_NAME} Team</p>
      `,
    }
    return this.transporter.sendMail(mailOptions)
  }

  async sendNewsletterEmail(toEmail) {
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: toEmail,
      subject: '🎉 Thanks for Subscribing!',
      html: `
        <h1>Welcome!</h1>
        <p>Thanks for subscribing to our newsletter. We'll keep you updated!</p>
      `,
    }
    return this.transporter.sendMail(mailOptions)
  }
}

module.exports = new MailService()
