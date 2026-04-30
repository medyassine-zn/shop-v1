const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendAdminNotification = async (order) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: process.env.EMAIL_USER }],
      subject: `Nouvelle commande ${order.orderNumber}`,
      htmlContent: `
        <h2>Nouvelle commande 🔥</h2>
        <p>Client: ${order.customerInfo.name}</p>
        <p>Total: ${order.totalPrice} DT</p>
      `
    });

    console.log("✅ Admin email sent");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

const sendCustomerConfirmation = async (order) => {
  try {
    if (!order.customerInfo.email) return;

    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_PASS;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: order.customerInfo.email }],
      subject: "Confirmation commande",
      htmlContent: `<h2>Merci pour votre commande ❤️</h2>`
    });

    console.log("✅ Customer email sent");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

module.exports = {
  sendAdminNotification,
  sendCustomerConfirmation
};