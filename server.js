const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

/* ==================== MIDDLEWARE ==================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==================== MONGODB ==================== */
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

/* ==================== RAZORPAY ==================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ==================== SCHEMAS ==================== */

// Product
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },

    // OPTIONAL market fields (fix admin page)
    marketPrice: { type: Number, default: 0 },
    marketUrl: { type: String, default: '' },
    marketSource: { type: String, default: '' },

    category: {
        type: String,
        enum: ['single-cards', 'sealed-bundles', 'booster-boxes', 'collection-boxes'],
        default: 'single-cards'
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Order
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number, // rupees
  currency: { type: String, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  deliveryType: String,
  deliveryCharge: Number,
  tax: { type: Number, default: 0 }, // GST removed
  total: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

/* ==================== ROUTES ==================== */

app.get('/', (_, res) => {
  res.json({ status: 'ok', message: 'Froakie TCG Backend Running' });
});

/* ==================== PRODUCTS ==================== */

app.get('/api/products', async (_, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false });
  res.json({ success: true, product });
});

/* ==================== CREATE ORDER (FIXED) ==================== */

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, customerInfo, items } = req.body;

    // amount MUST be paise
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount, // ✅ already paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        store: 'Froakie TCG',
        customer_name: customerInfo?.name || '',
        customer_email: customerInfo?.email || ''
      }
    });

    const order = new Order({
      orderId: `ORD_${Date.now()}`,
      razorpayOrderId: razorpayOrder.id,
      amount: amount / 100, // store rupees
      currency: currency || 'INR',
      status: 'pending',
      customer: customerInfo,
      items,
      deliveryType: customerInfo?.deliveryType,
      deliveryCharge: customerInfo?.deliveryCharge || 0,
      tax: 0,
      total: amount / 100
    });

    await order.save();

    res.json({
      success: true,
      razorpayOrder,
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ==================== VERIFY PAYMENT ==================== */

app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        updatedAt: Date.now()
      },
      { new: true }
    );

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false });
  }
});

/* ==================== SERVER ==================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🐸 Froakie TCG backend running on port ${PORT}`);
});

