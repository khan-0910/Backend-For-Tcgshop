# 🚀 Complete Deployment Guide - Step by Step

This guide will walk you through deploying your backend to **Render.com** (100% FREE).

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Razorpay account with live keys
- [ ] Your backend code ready

---

## Part 1: Set Up MongoDB Atlas (Database)

### Step 1: Create MongoDB Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Click "Sign up" and create account
3. Choose "Free" tier (M0 Sandbox)
4. Select cloud provider: **AWS**
5. Select region: **Mumbai (ap-south-1)** (closest to India)
6. Click "Create Cluster"

### Step 2: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `froakie_admin`
5. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Whitelist IP Addresses

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP Address: `0.0.0.0/0`
5. Click "Confirm"

### Step 4: Get Connection String

1. Go back to "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://froakie_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Replace `<password>` with the password you saved earlier
7. Add database name at the end: `/froakie_tcg`
   
   Final string should look like:
   ```
   mongodb+srv://froakie_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/froakie_tcg?retryWrites=true&w=majority
   ```

8. **SAVE THIS CONNECTION STRING** - You'll need it later!

---

## Part 2: Prepare Your Code for Deployment

### Step 1: Create GitHub Repository

1. Go to: https://github.com
2. Click "+" → "New repository"
3. Repository name: `Froakie_TCG_Backend`
4. Description: "Backend server for Froakie TCG Store"
5. Choose "Public"
6. Click "Create repository"

### Step 2: Upload Backend Code

**Option A: Using GitHub Website (Easier)**

1. In your new repository, click "uploading an existing file"
2. Drag and drop these files from `Froakie_TCG_Backend` folder:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `README.md`
   - `.env.example`
3. Click "Commit changes"

**Option B: Using Git Command Line**

```bash
cd Froakie_TCG_Backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Froakie_TCG_Backend.git
git push -u origin main
```

---

## Part 3: Deploy to Render.com

### Step 1: Create Render Account

1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect" next to your `Froakie_TCG_Backend` repository
4. If you don't see it, click "Configure account" and grant access

### Step 3: Configure Service

Fill in these details:

**Basic Settings:**
- **Name**: `froakie-tcg-backend`
- **Region**: Singapore (closest to India)
- **Branch**: `main`
- **Root Directory**: Leave empty (or `.` if needed)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select: **Free** (0$/month)

### Step 4: Add Environment Variables

Scroll down to "Environment Variables" section and add these:

Click "Add Environment Variable" for each:

1. **MONGODB_URI**
   - Value: Your MongoDB connection string from Part 1, Step 4
   - Example: `mongodb+srv://froakie_admin:password123@cluster0.xxxxx.mongodb.net/froakie_tcg?retryWrites=true&w=majority`

2. **RAZORPAY_KEY_ID**
   - Value: `rzp_live_Rn3w5m3jxnc59J`

3. **RAZORPAY_KEY_SECRET**
   - Value: Your NEW regenerated secret key
   - Get it from: https://dashboard.razorpay.com/app/keys
   - Click "Regenerate Key Secret" first!

4. **RAZORPAY_WEBHOOK_SECRET**
   - Value: Leave empty for now (we'll add later)

5. **PORT**
   - Value: `3000`

6. **NODE_ENV**
   - Value: `production`

### Step 5: Deploy!

1. Click "Create Web Service" button at bottom
2. Wait for deployment (5-10 minutes)
3. Watch the logs for any errors
4. When you see "Server running on port 3000" - SUCCESS! ✅

### Step 6: Get Your Backend URL

1. At the top of the page, you'll see your URL:
   ```
   https://froakie-tcg-backend.onrender.com
   ```
2. **SAVE THIS URL** - You'll need it for frontend!

### Step 7: Test Your Backend

1. Open your backend URL in browser:
   ```
   https://froakie-tcg-backend.onrender.com
   ```
   
2. You should see:
   ```json
   {
     "status": "ok",
     "message": "Froakie_TCG Backend Server Running",
     "timestamp": "2025-01-12T..."
   }
   ```

3. Test products endpoint:
   ```
   https://froakie-tcg-backend.onrender.com/api/products
   ```
   
4. Initialize sample products (do this once):
   ```
   https://froakie-tcg-backend.onrender.com/api/initialize
   ```
   Use Postman or cURL:
   ```bash
   curl -X POST https://froakie-tcg-backend.onrender.com/api/initialize
   ```

---

## Part 4: Connect Frontend to Backend

Now update your frontend to use the backend:

### Step 1: Create API Configuration File

Create new file: `Froakie_TCG/js/api-config.js`

```javascript
// API Configuration
const API_CONFIG = {
    baseURL: 'https://froakie-tcg-backend.onrender.com/api',
    timeout: 30000 // 30 seconds
};

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_CONFIG.baseURL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Product API
const ProductAPI = {
    getAll: () => apiRequest('/products'),
    getById: (id) => apiRequest(`/products/${id}`),
    create: (product) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(product)
    }),
    update: (id, product) => apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
    }),
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    })
};

// Order API
const OrderAPI = {
    create: (orderData) => apiRequest('/create-order', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),
    verify: (paymentData) => apiRequest('/verify-payment', {
        method: 'POST',
        body: JSON.stringify(paymentData)
    }),
    getAll: () => apiRequest('/orders'),
    getById: (id) => apiRequest(`/orders/${id}`)
};
```

### Step 2: Update HTML Files

Add this line to ALL HTML files (before other script tags):

```html
<script src="js/api-config.js"></script>
```

In `index.html`, `cart.html`, `checkout.html`, `admin.html`:
```html
<!-- Add this line -->
<script src="js/api-config.js"></script>
<script src="js/data.js"></script>
<script src="js/store.js"></script>
```

### Step 3: Update data.js to Use Backend

Replace the `initializeData()` function in `data.js`:

```javascript
async initializeData() {
    try {
        // Try to load from backend
        const response = await ProductAPI.getAll();
        if (response.success && response.products.length > 0) {
            localStorage.setItem('products', JSON.stringify(response.products));
            return;
        }
    } catch (error) {
        console.log('Loading from localStorage (backend unavailable)');
    }
    
    // Fallback to localStorage
    if (!localStorage.getItem('products')) {
        // ... existing sample products code ...
    }
}
```

---

## Part 5: Set Up Razorpay Webhooks

### Step 1: Configure Webhook in Razorpay

1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click "Add New Webhook"
3. Webhook URL: `https://froakie-tcg-backend.onrender.com/api/webhook`
4. Secret: Click "Generate Secret" (SAVE THIS!)
5. Active Events: Select these:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
6. Click "Create Webhook"

### Step 2: Add Webhook Secret to Render

1. Go back to Render dashboard
2. Click on your service
3. Go to "Environment" tab
4. Find `RAZORPAY_WEBHOOK_SECRET`
5. Paste the webhook secret you just generated
6. Click "Save Changes"
7. Service will auto-redeploy

---

## Part 6: Final Testing

### Test 1: Products Load from Backend

1. Open your frontend website
2. Open browser console (F12)
3. Check if products load
4. Should see API requests to your backend

### Test 2: Admin Panel

1. Go to admin page
2. Try adding a new product
3. Check if it appears on main store page
4. Check MongoDB Atlas to see if product was saved

### Test 3: Complete Purchase Flow

1. Add product to cart
2. Go to checkout
3. Fill in details
4. Complete payment (use test card if in test mode)
5. Check Razorpay dashboard for payment
6. Check MongoDB for order record

---

## 🎉 Deployment Complete!

Your backend is now:
- ✅ Deployed on Render.com (FREE)
- ✅ Connected to MongoDB Atlas
- ✅ Integrated with Razorpay
- ✅ Handling payments securely
- ✅ Syncing data across all devices

### Your URLs:
- **Backend API**: `https://froakie-tcg-backend.onrender.com`
- **Frontend**: `https://YOUR_USERNAME.github.io/FroakieTCG`
- **MongoDB**: MongoDB Atlas Dashboard
- **Razorpay**: https://dashboard.razorpay.com

---

## 🐛 Troubleshooting

### Backend Shows "Application Error"
1. Check Render logs for errors
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Ensure IP whitelist includes 0.0.0.0/0

### Products Don't Load
1. Check browser console for errors
2. Verify API_CONFIG.baseURL is correct
3. Test backend URL directly in browser
4. Check CORS is enabled in server.js

### Payments Fail
1. Verify Razorpay keys are correct
2. Check payment verification logic
3. Look at Razorpay dashboard for error details
4. Check backend logs in Render

### MongoDB Connection Fails
1. Verify connection string format
2. Check password doesn't have special characters
3. Ensure IP whitelist is set to 0.0.0.0/0
4. Test connection in MongoDB Compass

---

## 📞 Need Help?

- **Render Support**: https://render.com/docs
- **MongoDB Support**: https://www.mongodb.com/docs
- **Razorpay Support**: https://razorpay.com/docs

---

**🎊 Congratulations! Your complete e-commerce backend is live!**
