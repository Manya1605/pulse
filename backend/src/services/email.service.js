const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"DevPulse" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Verify Your DevPulse Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0A0B0D; color: #E5E5E5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #00FF66; font-size: 32px; font-weight: bold; }
          .content { background: #151619; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 40px; }
          .title { color: #00FF66; font-size: 24px; margin-bottom: 20px; }
          .text { color: #A0A0A0; line-height: 1.6; margin-bottom: 30px; }
          .button { display: inline-block; background: #00FF66; color: #0A0B0D; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .code { background: #0A0B0D; border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 4px; font-family: monospace; color: #00FF66; font-size: 16px; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">&gt;_ DEVPULSE</div>
          </div>
          <div class="content">
            <h1 class="title">Welcome to DevPulse!</h1>
            <p class="text">Hi ${user.displayName || user.username},</p>
            <p class="text">
              Thanks for signing up! To complete your registration and start tracking your coding progress across multiple platforms, please verify your email address.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" class="button">VERIFY EMAIL ADDRESS</a>
            </div>
            <p class="text" style="font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <span style="color: #00D9FF; word-break: break-all;">${verificationUrl}</span>
            </p>
            <p class="text" style="font-size: 12px; color: #666;">
              This link will expire in 24 hours. If you didn't create an account with DevPulse, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 DevPulse. All rights reserved.</p>
            <p>Unified Developer Analytics Terminal</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to DevPulse!
      
      Hi ${user.displayName || user.username},
      
      Thanks for signing up! Please verify your email address by clicking the link below:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with DevPulse, you can safely ignore this email.
      
      DevPulse - Unified Developer Analytics Terminal
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, token) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"DevPulse" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Reset Your DevPulse Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0A0B0D; color: #E5E5E5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { color: #00FF66; font-size: 32px; font-weight: bold; }
          .content { background: #151619; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 40px; }
          .title { color: #FF0033; font-size: 24px; margin-bottom: 20px; }
          .text { color: #A0A0A0; line-height: 1.6; margin-bottom: 30px; }
          .button { display: inline-block; background: #FF0033; color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">&gt;_ DEVPULSE</div>
          </div>
          <div class="content">
            <h1 class="title">Password Reset Request</h1>
            <p class="text">Hi ${user.displayName || user.username},</p>
            <p class="text">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" class="button">RESET PASSWORD</a>
            </div>
            <p class="text" style="font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <span style="color: #00D9FF; word-break: break-all;">${resetUrl}</span>
            </p>
            <p class="text" style="font-size: 12px; color: #666;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 DevPulse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
