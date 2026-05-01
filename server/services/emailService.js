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
      <td style="padding:10px;border-bottom:1px solid #eee;">${item.productName}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;">${item.size}/${item.color}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${(item.price * item.quantity).toFixed(0)} DT</td>
    </tr>
  `).join('');

  return `
  <div style="background:#f4f6f8;padding:20px;font-family:Arial;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#0f172a;color:#fff;padding:20px;text-align:center;">
        <h2 style="margin:0;">🛒 Nouvelle commande</h2>
        <p style="margin:5px 0;color:#38bdf8;">${settings.storeName || 'My Shop'}</p>
      </div>

      <!-- Info -->
      <div style="padding:20px;">
        <p><b>Commande:</b> ${order.orderNumber}</p>
        <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><b>Client:</b> ${order.customerInfo.name}</p>
        <p><b>Téléphone:</b> ${order.customerInfo.phone}</p>
        <p><b>Ville:</b> ${order.customerInfo.city}</p>
      </div>

      <!-- Table -->
      <div style="padding:0 20px 20px;">
        <table width="100%" style="border-collapse:collapse;">
          <thead>
            <tr style="background:#0f172a;color:#fff;">
              <th style="padding:10px;text-align:left;">Produit</th>
              <th style="padding:10px;">Variante</th>
              <th style="padding:10px;">Qté</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>

        <!-- Total -->
        <div style="margin-top:15px;text-align:right;">
          <p>Sous-total: ${order.subtotal} DT</p>
          <p>Livraison: ${order.deliveryPrice} DT</p>
          <h3 style="color:#e11d48;">TOTAL: ${order.totalPrice} DT</h3>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#0f172a;color:#aaa;text-align:center;padding:15px;font-size:12px;">
        © ${new Date().getFullYear()} ${settings.storeName || 'Shop'}
      </div>

    </div>
  </div>
  `;
};

// ================= CUSTOMER EMAIL HTML =================
const generateCustomerEmailHTML = (order, settings) => {
  return `
  <div style="background:#f4f6f8;padding:20px;font-family:Arial;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:#16a34a;color:#fff;padding:20px;text-align:center;">
        <h2 style="margin:0;">✅ Commande confirmée</h2>
        <p style="margin:5px 0;">${settings.storeName || 'My Shop'}</p>
      </div>

      <!-- Content -->
      <div style="padding:20px;">
        <p>Bonjour <b>${order.customerInfo.name}</b>,</p>
        <p>Merci pour votre commande ❤️</p>

        <div style="background:#f1f5f9;padding:15px;border-radius:8px;margin:15px 0;">
          <p><b>N°:</b> ${order.orderNumber}</p>
          <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><b>Total:</b> <span style="color:#e11d48;font-weight:bold;">${order.totalPrice} DT</span></p>
        </div>

        <p>Nous vous contacterons bientôt pour la livraison.</p>
      </div>

      <!-- Footer -->
      <div style="background:#0f172a;color:#aaa;text-align:center;padding:15px;font-size:12px;">
        Merci pour votre confiance 🙏
      </div>

    </div>
  </div>
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