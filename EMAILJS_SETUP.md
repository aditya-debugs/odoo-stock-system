# EmailJS Setup Guide

This guide will help you set up EmailJS to send real emails from your application.

## Why EmailJS?

- ✅ **Free**: 200 emails/month on free tier
- ✅ **Easy**: No backend configuration needed
- ✅ **Secure**: Emails sent from frontend without exposing credentials
- ✅ **No SMTP**: Works directly from browser
- ✅ **Quick Setup**: 5 minutes to get started

## Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** (top right)
3. Use Google, GitHub, or email to create account
4. Verify your email address

### 2. Add Email Service

1. After logging in, go to **Email Services** (left sidebar)
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook**
   - **Yahoo**
   - Or any other supported service
4. Click **"Connect Account"** and follow OAuth flow
5. Copy the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template

1. Go to **Email Templates** (left sidebar)
2. Click **"Create New Template"**
3. Set **Template Name**: `Password Reset`
4. Configure template content:

**Subject:**
```
{{subject}}
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .otp-box {
      background: white;
      border: 2px dashed #4f46e5;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: bold;
      color: #4f46e5;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 StockMaster</h1>
      <p>Inventory Management System</p>
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hello {{to_name}},</p>
      <p>{{message}}</p>
      
      {{#if otp_code}}
      <div class="otp-box">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your Verification Code</p>
        <div class="otp-code">{{otp_code}}</div>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Valid for 10 minutes</p>
      </div>
      {{/if}}
      
      <p style="color: #f59e0b; font-size: 14px;">
        ⚠️ If you didn't request this, please ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 StockMaster. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
```

5. Add template variables:
   - `to_name`
   - `to_email`
   - `subject`
   - `message`
   - `otp_code`

6. Click **"Save"**
7. Copy the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key

1. Go to **Account** → **General** (left sidebar)
2. Find your **Public Key** (e.g., `abc123xyz789`)
3. Copy this key

### 5. Configure Your Application

Create a `.env` file in the `client` folder:

```bash
# Copy from .env.example
cp .env.example .env
```

Add your EmailJS credentials:

```env
VITE_API_URL=http://localhost:5000

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123xyz789
```

**Replace with your actual values from EmailJS dashboard!**

### 6. Test the System

1. Install dependencies:
```bash
cd client
npm install
```

2. Start the application:
```bash
npm run dev
```

3. Test password reset:
   - Go to `/forgot-password`
   - Enter your email
   - Check your inbox for the OTP code
   - Use the code to reset password

## Template Variables Explained

The email template uses these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `to_name` | User's name | "John Doe" |
| `to_email` | Recipient email | "john@example.com" |
| `subject` | Email subject | "Password Reset Request" |
| `message` | Main message body | "We received a request..." |
| `otp_code` | 6-digit verification code | "123456" |

## Development vs Production

### Development (without EmailJS)
- OTP codes are logged to server console
- No actual emails sent
- Good for local testing

### Production (with EmailJS)
- Real emails sent to users
- OTP codes delivered via email
- Professional email templates

## Troubleshooting

### Emails not being sent?

1. **Check credentials**: Verify all 3 values in `.env` file
2. **Restart dev server**: Stop and restart `npm run dev`
3. **Check quota**: Free tier = 200 emails/month
4. **Verify email service**: Make sure Gmail/Outlook is connected
5. **Check spam folder**: Emails might be filtered

### Still seeing console logs?

If EmailJS is not configured, the system falls back to console logging:
```javascript
console.log("📧 EmailJS not configured. Check server console for OTP code.");
```

This is normal - just add your credentials to `.env` file.

## Free Tier Limits

EmailJS Free Plan includes:
- ✅ 200 emails per month
- ✅ 2 email services
- ✅ 2 email templates
- ✅ 50kb attachment size
- ✅ Basic support

For higher volume, upgrade to [paid plans](https://www.emailjs.com/pricing/).

## Security Notes

- ⚠️ Never commit `.env` file to Git
- ⚠️ Public key is safe to expose (it's in frontend)
- ⚠️ Service ID and Template ID are also safe
- ✅ EmailJS handles rate limiting
- ✅ No sensitive credentials in frontend code

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
- [React Integration Guide](https://www.emailjs.com/docs/examples/reactjs/)

## Need Help?

If you encounter issues:
1. Check the [FAQ](https://www.emailjs.com/docs/faq/)
2. Join [EmailJS Community](https://www.emailjs.com/docs/community/)
3. Contact support: support@emailjs.com

---

**🎉 That's it! Your password reset emails will now be delivered to real inboxes.**
