const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Format date for email
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate admin notification email HTML
const generateAdminEmailHTML = (order, settings) => {
  const items = order.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 12px; text-align: left;">${item.productName}</td>
      <td style="padding: 12px; text-align: center;">${item.size} / ${item.color}</td>
      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right;">${item.price.toFixed(0)} DT</td>
      <td style="padding: 12px; text-align: right;">${(item.price * item.quantity).toFixed(0)} DT</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle commande reçue</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🛒 Nouvelle commande reçue</h1>
              <p style="color: #e94560; margin: 10px 0 0 0; font-size: 14px;">${settings.storeName || 'Votre Boutique'}</p>
            </td>
          </tr>
          
          <!-- Order Info -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 18px;">Détails de la commande</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;">N° Commande:</td>
                  <td style="padding: 8px 0; color: #1a1a2e; font-weight: 600;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Date:</td>
                  <td style="padding: 8px 0; color: #1a1a2e;">${formatDate(order.createdAt)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Total:</td>
                  <td style="padding: 8px 0; color: #e94560; font-weight: 700; font-size: 18px;">${order.totalPrice.toFixed(0)} DT</td>
                </tr>
              </table>
              
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
              
              <!-- Customer Info -->
              <h3 style="color: #1a1a2e; margin: 0 0 15px 0; font-size: 16px;">👤 Informations client</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 15px;">
                <tr>
                  <td style="padding: 8px 15px; color: #666; width: 100px;">Nom:</td>
                  <td style="padding: 8px 15px; color: #1a1a2e; font-weight: 500;">${order.customerInfo.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; color: #666;">Téléphone:</td>
                  <td style="padding: 8px 15px; color: #1a1a2e; font-weight: 500;">${order.customerInfo.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; color: #666;">Adresse:</td>
                  <td style="padding: 8px 15px; color: #1a1a2e;">${order.customerInfo.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; color: #666;">Ville:</td>
                  <td style="padding: 8px 15px; color: #1a1a2e;">${order.customerInfo.city}</td>
                </tr>
                ${order.customerInfo.notes ? `
                <tr>
                  <td style="padding: 8px 15px; color: #666;">Notes:</td>
                  <td style="padding: 8px 15px; color: #666; font-style: italic;">${order.customerInfo.notes}</td>
                </tr>
                ` : ''}
              </table>
              
              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
              
              <!-- Products -->
              <h3 style="color: #1a1a2e; margin: 0 0 15px 0; font-size: 16px;">📦 Produits commandés</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #1a1a2e; color: #ffffff;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase;">Produit</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase;">Variante</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase;">Qté</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase;">Prix</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f9f9f9;">
                    <td colspan="4" style="padding: 12px; text-align: right; color: #666;">Sous-total:</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600;">${order.subtotal.toFixed(0)} DT</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td colspan="4" style="padding: 12px; text-align: right; color: #666;">Livraison:</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600;">${order.deliveryPrice.toFixed(0)} DT</td>
                  </tr>
                  <tr style="background-color: #e94560; color: #ffffff;">
                    <td colspan="4" style="padding: 15px; text-align: right; font-weight: 700; font-size: 16px;">TOTAL:</td>
                    <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 18px;">${order.totalPrice.toFixed(0)} DT</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 20px; text-align: center;">
              <p style="color: #888; margin: 0; font-size: 12px;">Cette commande a été passée sur ${settings.storeName || 'votre boutique'}</p>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 11px;">© ${new Date().getFullYear()} - Tous droits réservés</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Generate customer confirmation email HTML
const generateCustomerEmailHTML = (order, settings) => {
  const items = order.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 10px; text-align: left;">${item.productName}</td>
      <td style="padding: 10px; text-align: center;">${item.size} / ${item.color}</td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">${(item.price * item.quantity).toFixed(0)} DT</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de votre commande</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Commande confirmée!</h1>
              <p style="color: #e94560; margin: 10px 0 0 0; font-size: 14px;">${settings.storeName || 'Votre Boutique'}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="color: #1a1a2e; font-size: 16px; margin: 0 0 20px 0;">
                Bonjour ${order.customerInfo.name},
              </p>
              <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
                Nous avons bien reçu votre commande. Notre équipe la prépare avec soin et vous contactera prochainement pour la livraison.
              </p>
              
              <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1a1a2e; margin: 0 0 15px 0; font-size: 16px;">📋 Récapitulatif</h3>
                <p style="margin: 5px 0; color: #666;"><strong>N° Commande:</strong> <span style="color: #e94560; font-weight: 600;">${order.orderNumber}</span></p>
                <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Total:</strong> <span style="color: #e94560; font-weight: 700; font-size: 18px;">${order.totalPrice.toFixed(0)} DT</span></p>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background-color: #1a1a2e; color: #ffffff;">
                    <th style="padding: 10px; text-align: left; font-size: 12px;">Produit</th>
                    <th style="padding: 10px; text-align: center; font-size: 12px;">Variante</th>
                    <th style="padding: 10px; text-align: center; font-size: 12px;">Qté</th>
                    <th style="padding: 10px; text-align: right; font-size: 12px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items}
                </tbody>
              </table>
              
              <div style="background-color: #e94560; color: #ffffff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">Paiement à la livraison</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                Pour toute question, contactez-nous:<br>
                ${settings.phone ? `📞 ${settings.phone}<br>` : ''}
                ${settings.whatsapp ? `💬 WhatsApp: ${settings.whatsapp}<br>` : ''}
                ${settings.email ? `✉️ ${settings.email}` : ''}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 20px; text-align: center;">
              <p style="color: #888; margin: 0; font-size: 12px;">Merci pour votre confiance!</p>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 11px;">© ${new Date().getFullYear()} ${settings.storeName || ''} - Tous droits réservés</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Send admin notification email
const sendAdminNotification = async (order, settings) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials not configured, skipping admin notification');
    return;
  }

  const notificationEmail = settings.notificationEmail || process.env.EMAIL_USER;

  try {
    const info = await transporter.sendMail({
      from: `"${settings.storeName || 'Boutique'}" <${process.env.EMAIL_USER}>`,
      to: notificationEmail,
      subject: `🛒 Nouvelle commande reçue - ${order.orderNumber}`,
      html: generateAdminEmailHTML(order, settings)
    });
    console.log('✅ Admin notification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error.message);
    throw error;
  }
};

// Send customer confirmation email
const sendCustomerConfirmation = async (order, settings) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email credentials not configured, skipping customer confirmation');
    return;
  }

  // Only send if customer provided an email
  if (!order.customerInfo.email) {
    console.log('ℹ️ No customer email provided, skipping confirmation');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${settings.storeName || 'Boutique'}" <${process.env.EMAIL_USER}>`,
      to: order.customerInfo.email,
      subject: `✅ Confirmation de votre commande - ${order.orderNumber}`,
      html: generateCustomerEmailHTML(order, settings)
    });
    console.log('✅ Customer confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send customer confirmation:', error.message);
    throw error;
  }
};

module.exports = {
  sendAdminNotification,
  sendCustomerConfirmation
};
