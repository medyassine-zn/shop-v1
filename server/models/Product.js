const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  images: [{ type: String }],
  variants: [variantSchema],
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  isOnSale: { type: Boolean, default: false },
  discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

productSchema.virtual('sizes').get(function () {
  return [...new Set(this.variants.map(v => v.size))];
});

productSchema.virtual('colors').get(function () {
  return [...new Set(this.variants.map(v => v.color))];
});

productSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

// Computed final price (sale calculation)
productSchema.virtual('finalPrice').get(function () {
  if (!this.isOnSale || !this.discountPercentage) return this.basePrice;
  return this.basePrice * (1 - this.discountPercentage / 100);
});

// Ensure toJSON includes virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
