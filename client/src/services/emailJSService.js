import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get these from https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send email using EmailJS
 * @param {Object} emailData - Email data from backend
 * @returns {Promise<Object>} - EmailJS response
 */
export const sendEmail = async (emailData) => {
  try {
    // Validate email data
    if (!emailData || !emailData.to_email) {
      console.error('❌ Missing recipient email:', emailData);
      return { success: false, error: 'No recipient email provided' };
    }

    // Template params for EmailJS
    const templateParams = {
      to_email: emailData.to_email,
      to_name: emailData.to_name || 'User',
      subject: emailData.subject || 'StockMaster Notification',
      message: emailData.message || '',
      otp_code: emailData.otp_code || '',
      reply_to: emailData.to_email, // Some templates use this
    };

    console.log('📧 Sending email to:', templateParams.to_email);
    console.log('📋 Template params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    console.error('Error details:', error.text || error.message);
    return { success: false, error };
  }
};

/**
 * Check if EmailJS is configured
 * @returns {boolean} - True if configured
 */
export const isEmailJSConfigured = () => {
  return (
    EMAILJS_SERVICE_ID !== 'your_service_id' &&
    EMAILJS_TEMPLATE_ID !== 'your_template_id' &&
    EMAILJS_PUBLIC_KEY !== 'your_public_key'
  );
};
