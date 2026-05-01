const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendAdminNotification = async (order) => {
  try {
    console.log("📤 Sending email...");

    const defaultClient = SibApiV3Sdk.ApiClient.instance;

    // 🔥 هذا هو التعديل المهم
    defaultClient.authentications['api-key'].apiKey = process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: process.env.EMAIL_USER }],
      subject: "Test Email",
      htmlContent: "<h1>🔥 Email Works</h1>"
    });

    console.log("✅ Email sent");
  } catch (err) {
    console.error("❌ Email error:", err.response?.text || err.message);
  }
};

module.exports = {
  sendAdminNotification
};