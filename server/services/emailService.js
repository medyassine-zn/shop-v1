const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async () => {
  try {
    console.log("📤 Sending email...");

    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: "yasssinezayane11@gmail.com" }],
      subject: "TEST FINAL",
      htmlContent: "<h1>🔥 FINAL TEST</h1>"
    });

    console.log("✅ Email sent");
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};

module.exports = sendEmail;