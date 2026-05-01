const SibApiV3Sdk = require('sib-api-v3-sdk');

// Setup Brevo API
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.EMAIL_PASS;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ================= ADMIN EMAIL HTML =================
const generateAdminEmailHTML = (order, settings) => {
  const items = order.items.map(item => `
    <tr>
      <td style="padding:10px">${item.productName}</td>
      <td style="padding:10px">${item.size}/${item.color}</td>
      <td style="padding:10px">${item.quantity}</td>
      <td style="padding:10px">${(item.price * item.quantity).toFixed(0)} DT</td>
    </tr>
  `).join('');

  return `
  <h2>🛒 Nouvelle commande</h2>
  <p><b>Commande:</b> ${order.orderNumber}</p>
  <p><b>Client:</b> ${order.customerInfo.name}</p>
  <p><b>Total:</b> ${order.totalPrice} DT</p>
  <hr/>
  <table border="1" cellpadding="5">
    ${items}
  </table>
  `;
};

// ================= CUSTOMER EMAIL HTML =================
const generateCustomerEmailHTML = (order, settings) => {
  return `
  <h2>✅ Commande confirmée</h2>
  <p>Bonjour ${order.customerInfo.name},</p>
  <p>Merci pour votre commande ❤️</p>
  <p><b>Commande:</b> ${order.orderNumber}</p>
  <p><b>Total:</b> ${order.totalPrice} DT</p>
  `;
};

// ================= SEND ADMIN =================
const sendAdminNotification = async (order, settings) => {
  try {
    console.log("📤 Sending admin email...");

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: process.env.EMAIL_USER }],
      subject: `Nouvelle commande ${order.orderNumber}`,
      htmlContent: generateAdminEmailHTML(order, settings)
    });

    console.log("✅ Admin email sent");
  } catch (err) {
    console.error("❌ Admin email error:", err.response?.text || err.message);
  }
};

// ================= SEND CUSTOMER =================
const sendCustomerConfirmation = async (order, settings) => {
  try {
    if (!order.customerInfo?.email) return;

    console.log("📤 Sending customer email...");

    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL_USER },
      to: [{ email: order.customerInfo.email }],
      subject: `Confirmation commande ${order.orderNumber}`,
      htmlContent: generateCustomerEmailHTML(order, settings)
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