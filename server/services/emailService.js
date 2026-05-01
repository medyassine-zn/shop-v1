const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendAdminNotification = async (order) => {
  try {
    console.log("📤 Sending admin email...");

    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: process.env.EMAIL_USER }],
      subject: `Nouvelle commande ${order.orderNumber}`,
      htmlContent: `<h1>Nouvelle commande 🔥</h1>`
    });

    console.log("✅ Admin email sent");
  } catch (err) {
    console.error("❌ Admin email error:", err.response?.text || err.message);
  }
};

const sendCustomerConfirmation = async (order) => {
  try {
    if (!order.customerInfo?.email) return;

    console.log("📤 Sending customer email...");

    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: order.customerInfo.email }],
      subject: "Confirmation commande",
      htmlContent: `<h2>Merci pour votre commande ❤️</h2>`
    });

    console.log("✅ Customer email sent");
  } catch (err) {
    console.error("❌ Customer email error:", err.response?.text || err.message);
  }
};

module.exports = {
  sendAdminNotification,
  sendCustomerConfirmation
};