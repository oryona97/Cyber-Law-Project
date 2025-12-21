const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'ethereal_user', // Generate these for real use
        pass: process.env.EMAIL_PASS || 'ethereal_pass'
      }
    });
  }

  /**
   * Send an assignment notification to a lawyer.
   * @param {string} toEmail - Lawyer's email
   * @param {object} leadDetails - Lead info (summary, user contact)
   */
  async sendAssignmentEmail(toEmail, leadDetails) {
    if (!toEmail) {
      console.warn('Cannot send email: Lawyer has no email address.');
      return;
    }

    const subject = `New Lead Assigned: ${leadDetails.topic}`;
    const html = `
      <h3>You have been assigned a new lead</h3>
      <p><strong>Topic:</strong> ${leadDetails.topic}</p>
      <p><strong>Urgency:</strong> ${leadDetails.urgency}</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #3498db;">
        <strong>Summary:</strong><br/>
        ${leadDetails.summary}
      </div>

      <p><strong>Client Contact:</strong><br/>
      Name: ${leadDetails.userName}<br/>
      WhatsApp: ${leadDetails.userPhone}</p>

      <p>Please contact the client as soon as possible.</p>
    `;

    try {
      const info = await this.transporter.sendMail({
        from: '"CyberLaw System" <system@cyberlaw.com>',
        to: toEmail,
        subject: subject,
        html: html
      });
      console.log(`Email sent: ${info.messageId}`);
      // For Ethereal (Development):
      if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = new EmailService();
