# 📧 Quick EmailJS Setup (5 minutes)

## Get Started in 3 Steps:

### 1️⃣ Create Account
- Go to [emailjs.com](https://www.emailjs.com/)
- Sign up (free - 200 emails/month)

### 2️⃣ Get Your Credentials
1. **Add Email Service**: Connect Gmail/Outlook → Copy **Service ID**
2. **Create Template**: Use the template from `EMAILJS_SETUP.md` → Copy **Template ID**
3. **Get Public Key**: Account → General → Copy **Public Key**

### 3️⃣ Configure App
Create `client/.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**That's it!** 🎉 Password reset emails will now be sent to real inboxes.

---

**Without EmailJS:**
- OTP codes are still logged to server console
- System works perfectly for development/testing

**With EmailJS:**
- Real emails delivered to users
- Professional HTML email templates
- No backend email configuration needed

📖 **Detailed Guide**: See `EMAILJS_SETUP.md` for complete instructions with screenshots.
