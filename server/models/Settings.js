const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'MYZshop'
  },
  phone: {
    type: String,
    default: '+216 XX XXX XXX'
  },
  email: {
    type: String,
    default: 'contact@myzshop.tn'
  },
  address: {
    type: String,
    default: 'Tunis, Tunisie'
  },
  whatsapp: {
    type: String,
    default: ''
  },
  notificationEmail: {
    type: String,
    default: ''
  },
  facebookUrl: {
    type: String,
    default: ''
  },
  instagramUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
