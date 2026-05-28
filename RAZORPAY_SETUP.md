# Razorpay Payment Integration Guide

This guide will help you set up Razorpay payment gateway integration for RajGharana.

## Prerequisites

- Node.js and npm installed
- A Razorpay account (sign up at [https://razorpay.com](https://razorpay.com))

## Step 1: Create a Razorpay Account

1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up with your email and create an account
3. Complete the KYC verification (required for live payments)
4. Once verified, you'll get your API keys

## Step 2: Get Your API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings > API Keys**
3. You'll see two keys:
   - **Key ID** (Public key for frontend) - Can be exposed
   - **Key Secret** (Private key for backend) - Keep this secret!

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Razorpay keys:
   ```
   RAZORPAY_KEY_ID=your_key_id_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id_here
   RAZORPAY_KEY_SECRET=your_key_secret_here
   NEXT_PUBLIC_CURRENCY=₹
   ```

## Step 4: How It Works

### Payment Flow

1. **User initiates payment** - Customer clicks "Pay" button from the cart/order summary page
2. **Create Order** - The app calls `/api/create-order` to create an order
3. **Razorpay Checkout** - Razorpay's checkout modal opens for payment
4. **Payment Processing** - User completes payment in the modal
5. **Verify Payment** - The app verifies the payment signature using `/api/verify-payment`
6. **Order Confirmation** - User is redirected to the order confirmation page

### Components & Files

#### **RazorpayButton Component** (`/components/RazorpayButton.jsx`)
- Handles the payment flow
- Loads Razorpay script
- Creates orders and verifies payments
- Shows loading states and error handling

#### **API Routes**

**`/app/api/create-order/route.js`**
- Creates a Razorpay order
- Receives: amount in paise, currency, receipt, notes
- Returns: order_id, amount, and currency

**`/app/api/verify-payment/route.js`**
- Verifies payment signature
- Receives: razorpay_order_id, razorpay_payment_id, razorpay_signature
- Returns: success status after signature verification

#### **Updated OrderSummary** (`/components/OrderSummary.jsx`)
- Integrated Razorpay payment button
- Validates address selection before payment
- Handles payment success/failure
- Redirects to order confirmation page

## Step 5: Testing

### Test Mode (Sandbox)

Razorpay provides test credentials to test payments without real transactions.

#### Test Cards for Development:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4222 2222 2222 2222
- **CVV**: Any 3-4 digit number
- **Expiry**: Any future date

### Steps to Test:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application at `http://localhost:3000`

3. Add items to cart and proceed to checkout

4. Enter a delivery address

5. Click the payment button

6. The Razorpay modal will open

7. Use test card details:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: `12/25` (any future date)
   - CVV: `123` (any 3 digits)
   - OTP: `123456` (when prompted)

8. On successful payment, you'll be redirected to the order confirmation page

## Step 6: Going Live

Once you're ready to accept real payments:

1. Complete Razorpay KYC verification
2. Get approved for live payments
3. Switch to Live API keys in Razorpay Dashboard
4. Update your `.env.local` with live keys
5. Deploy your application

## Security Considerations

⚠️ **Important Security Guidelines:**

1. **Never commit secrets** - Add `.env.local` to `.gitignore`
2. **Use environment variables** - Always keep Key Secret safe
3. **Signature verification** - Always verify payment signatures on the backend
4. **HTTPS only** - Always use HTTPS in production
5. **Keep secrets private** - Never share your Key Secret with anyone

## Troubleshooting

### Payment Modal Doesn't Open

- Check browser console for errors
- Verify Razorpay script loads correctly
- Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Check CORS settings if issues persist

### "Invalid amount" Error

- Ensure amount is at least 100 paise
- Amount should be sent to the API in paise
- Check that cart has items

### Signature Verification Failed

- Verify `RAZORPAY_KEY_SECRET` is correct
- Ensure payment details are sent correctly
- Check server logs for detailed error messages

### Test Cards Not Working

- Make sure you're using Razorpay sandbox/test mode
- Use correct test card numbers from the table above
- Verify your account is in test mode in Razorpay Dashboard

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs)
- [Razorpay Node.js SDK](https://github.com/razorpay/razorpay-node)
- [Razorpay Integration FAQ](https://razorpay.com/support)

## Support

For any issues with Razorpay integration:
- Check [Razorpay Support](https://razorpay.com/support)
- Review the console logs for error messages
- Verify all environment variables are set correctly

---

Happy selling with RajGharana! 🎉
