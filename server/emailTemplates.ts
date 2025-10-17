interface EmailTemplateData {
  [key: string]: any;
}

export class EmailTemplateEngine {
  private static templates: Record<string, { subject: string; html: string; text?: string }> = {
    welcome: {
      subject: 'Welcome to FinderMeister!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Welcome to FinderMeister!</h1>
          <p>Hi {{firstName}},</p>
          <p>Welcome to FinderMeister, Nigeria's premier service marketplace!</p>
          <p>Your account has been created successfully. You can now:</p>
          <ul>
            <li>{{roleSpecificMessage}}</li>
            <li>Connect with trusted professionals</li>
            <li>Manage your projects securely</li>
          </ul>
          <p>Get started by visiting your dashboard.</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    },

    proposalNotification: {
      subject: 'New Proposal Received - {{requestTitle}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Proposal Received</h2>
          <p>Hi {{clientName}},</p>
          <p>You have received a new proposal from <strong>{{finderName}}</strong> for your request:</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1e40af;">{{requestTitle}}</h3>
            <p style="margin: 10px 0 0 0;">Proposed Price: <strong>₦{{proposalPrice}}</strong></p>
          </div>
          <p>Review the proposal and respond to the finder if you're interested.</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    },

    paymentConfirmation: {
      subject: 'Payment Confirmed - {{contractTitle}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Payment Confirmed!</h2>
          <p>Hi {{userName}},</p>
          <p>Your payment has been confirmed for the project:</p>
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #065f46;">{{contractTitle}}</h3>
            <p style="margin: 10px 0 0 0;">Amount: <strong>₦{{amount}}</strong></p>
          </div>
          <p>Work can now begin on your project.</p>
          <p>Best regards,<br>The FinderMeister Team</p>
        </div>
      `
    }
  };

  static render(templateName: string, data: EmailTemplateData): { subject: string; html: string; text?: string } {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const rendered = {
      subject: this.interpolate(template.subject, data),
      html: this.interpolate(template.html, data),
      text: template.text ? this.interpolate(template.text, data) : undefined
    };

    return rendered;
  }

  private static interpolate(template: string, data: EmailTemplateData): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  static addTemplate(name: string, template: { subject: string; html: string; text?: string }): void {
    this.templates[name] = template;
  }

  static getAvailableTemplates(): string[] {
    return Object.keys(this.templates);
  }

  static passwordReset(name: string, resetLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Hello ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            We received a request to reset your password for your FinderMeister account. 
            Click the button below to create a new password:
          </p>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Reset My Password
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons. If you didn't request a password reset, 
            you can safely ignore this email.
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <span style="color: #667eea; word-break: break-all;">${resetLink}</span>
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  static verificationSubmitted(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Identity Verification Submitted</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Hello ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Thank you for submitting your identity verification documents. Your submission is now under review by our verification team.
          </p>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Our team will review your documents within 24-48 hours</li>
              <li style="margin-bottom: 8px;">You'll receive an email notification once the review is complete</li>
              <li style="margin-bottom: 8px;">Once verified, you'll be able to access all platform features</li>
            </ul>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            If you have any questions about the verification process, please contact our support team.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  static verificationApproved(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Identity Verified!</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Congratulations ${name}!
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Your identity verification has been approved. Your account is now fully verified and you can access all FinderMeister features.
          </p>

          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #065f46; margin: 0 0 15px 0;">You can now:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Post finds and hire freelancers (if you're a client)</li>
              <li style="margin-bottom: 8px;">Apply to finds and submit proposals (if you're a finder)</li>
              <li style="margin-bottom: 8px;">Access all premium features</li>
              <li style="margin-bottom: 8px;">Build trust with other verified users</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}" 
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Start Using FinderMeister
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            Thank you for completing the verification process. Welcome to the verified FinderMeister community!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  static verificationRejected(name: string, reason: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Verification Update Required</h1>
        </div>

        <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            Hello ${name},
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 30px;">
            We've reviewed your identity verification submission, but unfortunately we need you to resubmit your documents.
          </p>

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #991b1b; margin: 0 0 15px 0;">Reason for rejection:</h3>
            <p style="color: #374151; margin: 0; font-style: italic;">"${reason}"</p>
          </div>

          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #92400e; margin: 0 0 15px 0;">Next steps:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Review the feedback above</li>
              <li style="margin-bottom: 8px;">Prepare new, clear photos of your documents</li>
              <li style="margin-bottom: 8px;">Ensure your selfie clearly shows your face</li>
              <li style="margin-bottom: 8px;">Resubmit through your profile settings</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      font-size: 16px;">
              Resubmit Verification
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #666;">
            If you have any questions about the verification process, please contact our support team.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} FinderMeister. All rights reserved.</p>
        </div>
      </div>
    `;
  }
}