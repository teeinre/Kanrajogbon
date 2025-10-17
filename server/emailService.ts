import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { EmailTemplateEngine as EmailTemplates } from './emailTemplates';

// Self-contained email configuration using various fallback methods
const createEmailTransporter = () => {
  // Try different transport methods in order of preference
  const transports = [
    // Method 1: Direct SMTP (if configured)
    () => {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }
      return null;
    },

    // Method 2: Gmail OAuth2 (self-contained)
    () => {
      if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });
      }
      return null;
    },

    // Method 3: Local mail system simulation (for development)
    () => {
      return createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    },

    // Method 4: File-based email logging (ultimate fallback)
    () => {
      return createTransport({
        jsonTransport: true,
      });
    }
  ];

  for (const createTransporter of transports) {
    try {
      const transporter = createTransporter();
      if (transporter) {
        return transporter;
      }
    } catch (error) {
      console.warn('Failed to create transporter:', error);
      continue;
    }
  }

  // Final fallback - create a test transporter
  return createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
};

const transporter = createEmailTransporter();

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static instance: EmailService;

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      // Use SMTP (Brevo)
      console.log('Using SMTP email service');
      console.log('SMTP Configuration:', {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || '587',
        user: process.env.SMTP_USER ? 'configured' : 'missing',
        pass: process.env.SMTP_PASS ? 'configured' : 'missing',
        from: process.env.FROM_EMAIL || '95bd74001@smtp-brevo.com'
      });

      // Test connection first
      await transporter.verify();
      console.log('SMTP connection verified successfully');

      const mailOptions = {
        from: process.env.FROM_EMAIL || '95bd74001@smtp-brevo.com',
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text || this.extractTextFromHtml(template.html),
      };

      console.log(`Attempting to send email to: ${template.to}`);
      const result = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${template.to}. Message ID: ${result.messageId}`);
      return true;
    } catch (error: any) {
      console.error('Failed to send email:', {
        error: error.message,
        code: error.code,
        command: error.command,
        to: template.to,
        subject: template.subject
      });
      return false;
    }
  }

  private extractTextFromHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Finder notification templates
  async notifyFinderNewMessage(finderEmail: string, clientName: string, requestTitle: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: finderEmail,
      subject: `New Message from ${clientName} - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Message Received</h2>
          <p>Hi there,</p>
          <p>You have received a new message from <strong>${clientName}</strong> regarding your proposal for:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #374151;">${requestTitle}</h3>
          </div>
          <p>Log in to your FinderMeister dashboard to view and respond to the message.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/finder/messages" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Messages
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }

  async notifyFinderHired(finderEmail: string, clientName: string, requestTitle: string, amount: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: finderEmail,
      subject: `🎉 You've been hired for "${requestTitle}"!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Congratulations! You've been hired!</h2>
          <p>Great news! <strong>${clientName}</strong> has accepted your proposal and hired you for the project:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin: 0; color: #0369a1;">${requestTitle}</h3>
          </div>
          <p><strong>Contract Amount:</strong> ₦${amount}</p>
          <p>The client will now fund the escrow, and once payment is complete, you can begin working on the project.</p>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Next Steps:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Wait for escrow funding confirmation</li>
              <li>You'll receive another notification when work can begin</li>
              <li>Start communicating with the client about project details</li>
            </ul>
          </div>
          <p>Log in to your FinderMeister dashboard to view the contract details and start messaging the client.</p>
          <p>Best of luck with your project!</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }

  async notifyFinderWorkCanBegin(finderEmail: string, clientName: string, requestTitle: string, amount: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: finderEmail,
      subject: `🚀 Escrow funded! You can now start work on "${requestTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Escrow Funded - Work Can Begin!</h2>
          <p>Excellent news! <strong>${clientName}</strong> has funded the escrow for your project:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin: 0; color: #0369a1;">${requestTitle}</h3>
          </div>
          <p><strong>Contract Amount:</strong> ₦${amount}</p>
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #065f46;"><strong>✅ Payment Secured:</strong> The full contract amount is now held in escrow and will be released to you upon successful completion of the work.</p>
          </div>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Ready to Start:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Begin working on the project immediately</li>
              <li>Communicate regularly with the client</li>
              <li>Submit your completed work through the platform</li>
              <li>Payment will be released once client approves your work</li>
            </ul>
          </div>
          <p>Log in to your FinderMeister dashboard to view the contract details and start messaging the client.</p>
          <p>Good luck with your project!</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }


  async notifyFinderSubmissionApproved(finderEmail: string, clientName: string, requestTitle: string, amount: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: finderEmail,
      subject: `Work Approved - Payment Released - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Work Approved - Payment Released!</h2>
          <p>Hi there,</p>
          <p>Excellent news! <strong>${clientName}</strong> has approved your work submission for:</p>
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="margin: 0 0 10px 0; color: #15803d;">${requestTitle}</h3>
            <p style="margin: 0; color: #374151;">Payment Released: <strong>₦${amount}</strong></p>
          </div>
          <p>The payment has been released from escrow and added to your available balance. You can now request a withdrawal.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/finder/withdrawals" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Request Withdrawal
          </a>
          <p>Thank you for your excellent work!</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }

  async notifyFinderSubmissionRejected(finderEmail: string, clientName: string, requestTitle: string, feedback: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: finderEmail,
      subject: `Work Revision Requested - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Work Revision Requested</h2>
          <p>Hi there,</p>
          <p><strong>${clientName}</strong> has requested revisions for your work submission on:</p>
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin: 0 0 10px 0; color: #dc2626;">${requestTitle}</h3>
            <h4 style="margin: 10px 0 5px 0; color: #374151;">Client Feedback:</h4>
            <p style="margin: 0; color: #6b7280; font-style: italic;">"${feedback}"</p>
          </div>
          <p>Please review the feedback and resubmit your work with the requested changes.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/finder/contracts" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Contract & Resubmit
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }

  // Client notification templates
  async notifyClientNewProposal(clientEmail: string, finderName: string, requestTitle: string, proposalPrice: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: clientEmail,
      subject: `New Proposal Received - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Proposal Received</h2>
          <p>Hi there,</p>
          <p>You have received a new proposal from <strong>${finderName}</strong> for your request:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">${requestTitle}</h3>
            <p style="margin: 0; color: #374151;">Proposed Price: <strong>₦${proposalPrice}</strong></p>
          </div>
          <p>Review the proposal details and respond to the finder if you're interested.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/client/requests" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Proposal
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }

  async notifyClientOrderSubmitted(clientEmail: string, finderName: string, contractId: string): Promise<boolean> {
    const subject = `Work Submitted - ${finderName} has completed your project`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Work Submission Received</h2>
        <p>Hello,</p>
        <p><strong>${finderName}</strong> has submitted their completed work for your project.</p>
        <p>You have 48 hours to review the submission. If no action is taken, the payment will be automatically released.</p>
        <p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/orders/review/${contractId}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Review Submission
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">This is an automated message from FinderMeister.</p>
      </div>
    `;

    return this.sendEmail({ to: clientEmail, subject, html });
  }

  async notifyClientOrderAccepted(
    finderEmail: string,
    clientName: string,
    amount: string
  ): Promise<boolean> {
    try {
      const subject = 'Your Work Has Been Accepted! 🎉';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Work Accepted - Payment Released!</h2>
          <p>Great news! Your submitted work has been accepted by ${clientName}.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Payment Details</h3>
            <p><strong>Amount Released:</strong> ₦${parseFloat(amount).toLocaleString()}</p>
            <p>The funds have been released to your account.</p>
          </div>
          <p>Continue delivering excellent work to build your reputation on FinderMeister!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/finder/dashboard" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
        </div>
      `;

      return this.sendEmail({ to: finderEmail, subject, html });
    } catch (error) {
      console.error('Failed to send order acceptance email:', error);
      return false;
    }
  }

  async notifyClientContractCancelled(
    clientEmail: string,
    clientName: string,
    contractId: string,
    amount: string
  ): Promise<boolean> {
    try {
      const subject = 'Contract Cancelled - Full Refund Issued';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Contract Cancelled</h2>
          <p>Dear ${clientName},</p>
          <p>Your contract has been cancelled by the administrator. A full refund has been issued to your account.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Refund Details</h3>
            <p><strong>Contract ID:</strong> ${contractId}</p>
            <p><strong>Refund Amount:</strong> ₦${parseFloat(amount).toLocaleString()}</p>
            <p>The tokens have been added back to your account balance.</p>
          </div>
          <p>If you have any questions, please contact our support team.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/client/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
        </div>
      `;

      return this.sendEmail({ to: clientEmail, subject, html });
    } catch (error) {
      console.error('Failed to send client contract cancellation email:', error);
      return false;
    }
  }

  async notifyFinderContractCancelled(
    finderEmail: string,
    finderName: string,
    contractId: string
  ): Promise<boolean> {
    try {
      const subject = 'Contract Cancelled by Administrator';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Contract Cancelled</h2>
          <p>Dear ${finderName},</p>
          <p>The contract you were working on has been cancelled by the administrator.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contract Details</h3>
            <p><strong>Contract ID:</strong> ${contractId}</p>
            <p>The client has received a full refund.</p>
          </div>
          <p>If you have any questions about this cancellation, please contact our support team.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/finder/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Dashboard</a>
        </div>
      `;

      return this.sendEmail({ to: finderEmail, subject, html });
    } catch (error) {
      console.error('Failed to send finder contract cancellation email:', error);
      return false;
    }
  }


  async notifyClientNewMessage(clientEmail: string, finderName: string, requestTitle: string): Promise<boolean> {
    const template: EmailTemplate = {
      to: clientEmail,
      subject: `New Message from ${finderName} - FinderMeister`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Message Received</h2>
          <p>Hi there,</p>
          <p>You have received a new message from <strong>${finderName}</strong> regarding:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #374151;">${requestTitle}</h3>
          </div>
          <p>Log in to your FinderMeister dashboard to view and respond to the message.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/client/messages" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            View Messages
          </a>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `,
    };
    return this.sendEmail(template);
  }

  // Password reset email template
  async sendPasswordResetEmail(userEmail: string, userName: string, resetLink: string): Promise<boolean> {
    try {
      const subject = 'Reset Your FinderMeister Password';
      const htmlContent = EmailTemplates.passwordReset(userName, resetLink);

      const success = await this.sendEmail({
        to: userEmail,
        subject: subject,
        html: htmlContent
      });

      if (success) {
        console.log(`Password reset email sent successfully to ${userEmail}`);
      } else {
        console.error(`Failed to send password reset email to ${userEmail}`);
      }

      return success;
    } catch (error) {
      console.error('Error in sendPasswordResetEmail:', error);
      return false;
    }
  }

  // Verification email methods
  async sendVerificationSubmitted(email: string, name: string): Promise<boolean> {
    try {
      const subject = 'Identity Verification Submitted - Under Review';
      const htmlContent = EmailTemplates.verificationSubmitted(name);

      const success = await this.sendEmail({
        to: email,
        subject: subject,
        html: htmlContent
      });

      if (success) {
        console.log(`Verification submitted email sent successfully to ${email}`);
      } else {
        console.error(`Failed to send verification submitted email to ${email}`);
      }

      return success;
    } catch (error) {
      console.error('Error in sendVerificationSubmitted:', error);
      return false;
    }
  }

  async sendVerificationApproved(email: string, name: string): Promise<boolean> {
    try {
      const subject = '🎉 Your Identity Verification is Complete!';
      const htmlContent = EmailTemplates.verificationApproved(name);

      const success = await this.sendEmail({
        to: email,
        subject: subject,
        html: htmlContent
      });

      if (success) {
        console.log(`Verification approved email sent successfully to ${email}`);
      } else {
        console.error(`Failed to send verification approved email to ${email}`);
      }

      return success;
    } catch (error) {
      console.error('Error in sendVerificationApproved:', error);
      return false;
    }
  }

  async sendVerificationRejected(email: string, name: string, reason: string): Promise<boolean> {
    try {
      const subject = 'Verification Update Required - FinderMeister';
      const htmlContent = EmailTemplates.verificationRejected(name, reason);

      const success = await this.sendEmail({
        to: email,
        subject: subject,
        html: htmlContent
      });

      if (success) {
        console.log(`Verification rejected email sent successfully to ${email}`);
      } else {
        console.error(`Failed to send verification rejected email to ${email}`);
      }

      return success;
    } catch (error) {
      console.error('Error in sendVerificationRejected:', error);
      return false;
    }
  }

  async notifyAdminNewDispute(
    adminEmail: string,
    disputeId: string,
    userName: string,
    disputeType: string,
    description: string
  ): Promise<boolean> {
    const subject = 'New Dispute Submitted - Action Required';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Dispute Requires Review</h2>
        <p>A new dispute has been submitted and requires administrative review.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Dispute ID:</strong> ${disputeId}</p>
          <p><strong>Submitted by:</strong> ${userName}</p>
          <p><strong>Type:</strong> ${disputeType}</p>
          <p><strong>Description:</strong> ${description}</p>
        </div>
        
        <p>Please log in to your admin dashboard to review and take action on this dispute.</p>
        
        <p>Best regards,<br>The FinderMeister System</p>
      </div>
    `;

    return this.sendEmail({ to: adminEmail, subject, html });
  }

  async notifyAdminContractCancellation(
    adminEmail: string,
    contractId: string,
    clientName: string,
    finderName: string,
    amount: string,
    reason: string
  ): Promise<boolean> {
    const subject = 'Contract Cancelled by Admin - Notification';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Contract Cancellation Notice</h2>
        <p>A contract has been cancelled by an administrator.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Contract ID:</strong> ${contractId}</p>
          <p><strong>Client:</strong> ${clientName}</p>
          <p><strong>Finder:</strong> ${finderName}</p>
          <p><strong>Amount:</strong> ₦${amount}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        
        <p>The client has been refunded and both parties have been notified.</p>
        
        <p>Best regards,<br>The FinderMeister System</p>
      </div>
    `;

    return this.sendEmail({ to: adminEmail, subject, html });
  }
}

export const emailService = EmailService.getInstance();