await apiInstance.sendTransacEmail({
  sender: { email: process.env.EMAIL_USER },
  to: [{ email: "yasssinezayane11@gmail.com" }], // حط email آخر (موش نفسو)
  subject: "TEST FINAL",
  htmlContent: "<h1>🔥 FINAL TEST</h1>"
});
console.log("📤 Sending email...");
console.log("✅ Email sent");