# 🎯 SIMPLE STEP-BY-STEP GUIDE
## Complete Setup from Start to Finish

This guide will walk you through EVERYTHING - no technical knowledge needed!

---

## 📦 What You Have Now

On your Desktop, you have **TWO folders**:

1. **Froakie_TCG** - Your website (frontend)
   - This is what customers see
   - Has all the HTML, CSS, JavaScript files
   - Will be hosted on GitHub Pages (FREE)

2. **Froakie_TCG_Backend** - Your server (backend)
   - This handles payments and database
   - Stores products and orders
   - Will be hosted on Render.com (FREE)

---

## 🎬 PART 1: Set Up Accounts (15 minutes)

### Step 1: Create MongoDB Account (Database)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Click "Sign up"
3. Fill in:
   - Email: your email
   - Password: create a strong password
4. Click "Create your Atlas account"
5. Choose "FREE" tier (M0 Sandbox)
6. Cloud Provider: **AWS**
7. Region: **Mumbai (ap-south-1)**
8. Click "Create Cluster" (takes 3-5 minutes)

**✅ Done! Keep this tab open**

### Step 2: Create Render Account (Backend Hosting)

1. Go to: https://render.com
2. Click "Get Started"
3. Click "Sign up with GitHub"
4. Log in to your GitHub account
5. Click "Authorize Render"

**✅ Done! Keep this tab open**

### Step 3: Check Razorpay Account

1. Go to: https://dashboard.razorpay.com
2. Log in with your account
3. Go to Settings → API Keys
4. You should see:
   - Key ID: `rzp_live_Rn3w5m3jxnc59J`
   - Key Secret: (hidden)
5. **IMPORTANT**: Click "Regenerate Key Secret"
6. **COPY and SAVE** the new secret key somewhere safe!

**✅ Done!**

---

## 🎬 PART 2: Set Up MongoDB Database (10 minutes)

### Step 1: Create Database User

1. In MongoDB Atlas, click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `froakie_admin`
5. Click "Autogenerate Secure Password"
6. **COPY and SAVE this password!** (You'll need it later)
7. Database User Privileges: "Read and write to any database"
8. Click "Add User"

### Step 2: Allow Access from Anywhere

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP Address will show: `0.0.0.0/0`
5. Click "Confirm"

### Step 3: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://froakie_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **IMPORTANT**: Replace `<password>` with the password you saved earlier
7. Add `/froakie_tcg` before the `?`
   
   Final string should look like:
   ```
   mongodb+srv://froakie_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/froakie_tcg?retryWrites=true&w=majority
   ```

8. **SAVE THIS COMPLETE STRING!**

**✅ MongoDB is ready!**

---

## 🎬 PART 3: Upload Backend to GitHub (10 minutes)

### Step 1: Create New Repository

1. Go to: https://github.com
2. Click "+" (top right) → "New repository"
3. Repository name: `Froakie_TCG_Backend`
4. Description: "Backend server for Froakie TCG Store"
5. Choose "Public"
6. Click "Create repository"

### Step 2: Upload Files

1. On the new repository page, click "uploading an existing file"
2. Open your Desktop → `Froakie_TCG_Backend` folder
3. Drag and drop these files:
   - `server.js`
   - `package.json`
   - `.gitignore`
   - `README.md`
   - `.env.example`
4. Scroll down, click "Commit changes"

**✅ Backend code is on GitHub!**

---

## 🎬 PART 4: Deploy Backend to Render (15 minutes)

### Step 1: Create Web Service

1. Go to Render dashboard: https://dashboard.render.com
2. Click "New +" (top right)
3. Select "Web Service"
4. Click "Connect" next to `Froakie_TCG_Backend` repository
   - If you don't see it, click "Configure account" and grant access
5. Fill in:
   - **Name**: `froakie-tcg-backend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Instance Type**: Select **Free**

### Step 2: Add Environment Variables

Scroll down to "Environment Variables" and add these (click "Add Environment Variable" for each):

1. **MONGODB_URI**
   - Value: Paste your MongoDB connection string from Part 2, Step 3

2. **RAZORPAY_KEY_ID**
   - Value: `rzp_live_Rn3w5m3jxnc59J`

3. **RAZORPAY_KEY_SECRET**
   - Value: Paste your NEW secret key from Part 1, Step 3

4. **PORT**
   - Value: `3000`

5. **NODE_ENV**
   - Value: `production`

### Step 3: Deploy!

1. Click "Create Web Service" (bottom of page)
2. Wait 5-10 minutes for deployment
3. Watch the logs - you should see:
   ```
   ✅ Connected to MongoDB
   🐸 Froakie_TCG Backend Server
   Server running on port 3000
   ```

4. At the top, you'll see your URL:
   ```
   https://froakie-tcg-backend.onrender.com
   ```

5. **COPY and SAVE this URL!**

### Step 4: Test Your Backend

1. Open your backend URL in browser:
   ```
   https://froakie-tcg-backend.onrender.com
   ```

2. You should see:
   ```json
   {
     "status": "ok",
     "message": "Froakie_TCG Backend Server Running"
   }
   ```

3. Initialize sample products (do this ONCE):
   - Open: `https://froakie-tcg-backend.onrender.com/api/initialize`
   - You should see: `"message": "Sample products added"`

**✅ Backend is LIVE!**

---

## 🎬 PART 5: Update Frontend to Use Backend (5 minutes)

### Step 1: Update API Configuration

1. Open `Froakie_TCG` folder on your Desktop
2. Open `js` folder
3. Open `api-config.js` file (with Notepad or any text editor)
4. Find this line:
   ```javascript
   baseURL: 'https://froakie-tcg-backend.onrender.com/api',
   ```

5. Replace with YOUR backend URL:
   ```javascript
   baseURL: 'https://YOUR-BACKEND-URL.onrender.com/api',
   ```

6. Save the file

**✅ Frontend is connected to backend!**

---

## 🎬 PART 6: Upload Frontend to GitHub (10 minutes)

### Step 1: Create New Repository

1. Go to: https://github.com
2. Click "+" → "New repository"
3. Repository name: `FroakieTCG`
4. Description: "Froakie TCG Pokemon Cards Store"
5. Choose "Public"
6. Click "Create repository"

### Step 2: Upload All Files

1. Click "uploading an existing file"
2. Open `Froakie_TCG` folder on Desktop
3. Select ALL files and folders:
   - `index.html`
   - `cart.html`
   - `checkout.html`
   - `admin.html`
   - `css` folder
   - `js` folder
   - `README.md`
   - All other files
4. Drag and drop everything
5. Click "Commit changes"

### Step 3: Enable GitHub Pages

1. Go to repository Settings
2. Click "Pages" (left sidebar)
3. Source: Select "main" branch
4. Click "Save"
5. Wait 2-3 minutes
6. Your website URL will appear:
   ```
   https://YOUR-USERNAME.github.io/FroakieTCG/
   ```

7. **SAVE THIS URL!**

**✅ Your website is LIVE!**

---

## 🎬 PART 7: Set Up Razorpay Webhooks (5 minutes)

### Step 1: Create Webhook

1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click "Add New Webhook"
3. Webhook URL: `https://YOUR-BACKEND-URL.onrender.com/api/webhook`
4. Secret: Click "Generate Secret"
5. **COPY and SAVE this secret!**
6. Active Events: Select:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
7. Click "Create Webhook"

### Step 2: Add Webhook Secret to Render

1. Go back to Render dashboard
2. Click on your `froakie-tcg-backend` service
3. Click "Environment" tab
4. Find `RAZORPAY_WEBHOOK_SECRET`
5. Paste the webhook secret you just copied
6. Click "Save Changes"
7. Service will auto-redeploy (wait 2-3 minutes)

**✅ Webhooks configured!**

---

## 🎉 YOU'RE DONE!

### Your Complete Setup:

1. **Website (Frontend)**
   - URL: `https://YOUR-USERNAME.github.io/FroakieTCG/`
   - Hosted on: GitHub Pages (FREE)
   - Shows products, cart, checkout

2. **Server (Backend)**
   - URL: `https://YOUR-BACKEND-URL.onrender.com`
   - Hosted on: Render.com (FREE)
   - Handles payments, database

3. **Database**
   - MongoDB Atlas (FREE)
   - Stores products and orders

4. **Payment Gateway**
   - Razorpay (LIVE mode)
   - Processes real payments

---

## 🧪 Test Everything

### Test 1: View Products

1. Open your website
2. You should see 3 sample products
3. Products load from backend database

### Test 2: Admin Panel

1. Go to: `https://YOUR-USERNAME.github.io/FroakieTCG/admin.html`
2. Password: `admin123`
3. Try adding a new product
4. Go back to main page - new product should appear!

### Test 3: Make a Purchase

1. Add product to cart
2. Go to checkout
3. Fill in details
4. Use test card (if in test mode):
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: Any future date
5. Complete payment
6. Check Razorpay dashboard for payment
7. Check MongoDB for order record

---

## 📞 Important URLs to Save

Write these down:

1. **Your Website**: `https://YOUR-USERNAME.github.io/FroakieTCG/`
2. **Your Backend**: `https://YOUR-BACKEND-URL.onrender.com`
3. **MongoDB Dashboard**: https://cloud.mongodb.com
4. **Render Dashboard**: https://dashboard.render.com
5. **Razorpay Dashboard**: https://dashboard.razorpay.com

---

## 🔐 Important Passwords to Save

Write these down securely:

1. MongoDB Database Password: `_______________`
2. Razorpay Key Secret: `_______________`
3. Razorpay Webhook Secret: `_______________`
4. Admin Panel Password: `admin123` (change this!)

---

## ✏️ Customize Your Store

### Change Contact Information

1. Open `Froakie_TCG` folder
2. Edit these files (find the footer section):
   - `index.html`
   - `cart.html`
   - `checkout.html`
3. Replace:
   - Email: `froakietcg@gmail.com` → Your email
   - Phone: `+91 XXXXX XXXXX` → Your phone
   - WhatsApp: `+91 XXXXX XXXXX` → Your WhatsApp
   - Instagram: `@froakie_tcg` → Your Instagram
4. Save and upload to GitHub again

### Change Admin Password

1. Open `admin.html`
2. Find line: `const ADMIN_PASSWORD = 'admin123';`
3. Change to: `const ADMIN_PASSWORD = 'your_new_password';`
4. Save and upload to GitHub

---

## 🐛 Troubleshooting

### Products Don't Load

1. Check browser console (F12)
2. Verify backend URL in `api-config.js`
3. Test backend directly: `https://YOUR-BACKEND-URL.onrender.com/api/products`

### Payment Fails

1. Check Razorpay dashboard for errors
2. Verify keys are correct in Render
3. Check backend logs in Render dashboard

### Backend Shows Error

1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for error messages
5. Check all environment variables are set correctly

---

## 🎊 Congratulations!

You now have a **COMPLETE, PROFESSIONAL e-commerce website** with:

✅ Beautiful frontend
✅ Secure backend
✅ Real payment processing
✅ Database storage
✅ Admin panel
✅ All synced across devices!

**Your store is ready to sell Pokemon cards!** 🐸🎴

---

## 📚 Next Steps

1. Add more products through admin panel
2. Test with small transactions first
3. Share your website link with customers
4. Monitor Razorpay dashboard for payments
5. Check MongoDB for orders

**Need help? Check the other documentation files in the folders!**
