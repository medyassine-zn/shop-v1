const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendEmail = async () => {
  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications['api-key'];

  apiKey.apiKey = process.env.EMAIL_PASS;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: { email: process.env.EMAIL_USER },
    to: [{ email: "medyassinezn11@gmail.com" }], // بدلها بإيميلك
    subject: "Test Brevo API",
    htmlContent: "<h1>خدم 🔥</h1>"
  });

  console.log("✅ Email sent");
};

module.exports = sendEmail;