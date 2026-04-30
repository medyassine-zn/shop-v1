const router = require('express').Router();
const auth = require('../middleware/auth');
const Settings = require('../models/Settings');

// GET public settings (no auth required)
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    // Return only public fields
    res.json({
      storeName: settings.storeName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      whatsapp: settings.whatsapp,
      facebookUrl: settings.facebookUrl,
      instagramUrl: settings.instagramUrl
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all settings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update settings (admin only)
router.put('/', auth, async (req, res) => {
  try {
    const {
      storeName,
      phone,
      email,
      address,
      whatsapp,
      notificationEmail,
      facebookUrl,
      instagramUrl
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (storeName !== undefined) settings.storeName = storeName;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (address !== undefined) settings.address = address;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (notificationEmail !== undefined) settings.notificationEmail = notificationEmail;
    if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
    if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
