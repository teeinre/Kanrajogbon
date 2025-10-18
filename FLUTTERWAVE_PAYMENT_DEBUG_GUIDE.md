# Flutterwave Payment Debug Guide

## 🔍 Current Issue Identified

**Error**: `Invalid authorization key`

**Root Cause**: The Flutterwave test keys being used are not valid. Flutterwave requires proper API keys from your Flutterwave dashboard.

## 🛠️ Step-by-Step Solution

### 1. Get Valid Flutterwave API Keys

1. **Log into your Flutterwave dashboard**: https://dashboard.flutterwave.com
2. **Navigate to Settings > API**
3. **Copy your Test Keys** (for development):
   - Public Key: `FLWPUBK_TEST-...`
   - Secret Key: `FLWSECK_TEST-...`
4. **For Production**: Switch to Live keys when ready

### 2. Update Environment Configuration

Replace the placeholder keys in `.env`:

```env
# Flutterwave Configuration - Use your actual keys
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-811fbeaf13302885fea3437b7f9456b9-X
FLUTTERWAVE_SECRET_KEY=FLWSECK-dc00a39d0220ed55bbca419dfc1e7474-199f6909234vt-X
FLUTTERWAVE_SECRET_HASH=FM-FinderMeister-Webhook-Secret
FRONTEND_URL=https://findermeister.com
BASE_URL=https://findermeister.com
```

### 3. Verify Configuration

Test the configuration endpoint:
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/payments/flutterwave/config
```

Expected response:
```json
{
  "isConfigured": true,
  "hasSecretKey": true,
  "hasPublicKey": true
}
```

### 4. Test Payment Flows

#### Token Purchase Test
```bash
# Initialize token purchase
curl -X POST http://localhost:5000/api/tokens/purchase \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"packageId": "YOUR_PACKAGE_ID"}'
```

#### Contract Payment Test
```bash
# Initialize contract payment
curl -X POST http://localhost:5000/api/contracts/CONTRACT_ID/payment \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Enhanced Debugging Features Added

### 1. Webhook Signature Verification (Development Mode)
- **Development**: Webhooks work without signature verification
- **Production**: Requires proper `FLUTTERWAVE_SECRET_HASH`

### 2. Domain Configuration Fixed
- **Production**: Redirects now point to `https://findermeister.com`
- **Development**: Uses `http://localhost:5000`
- **Payment Success**: Redirects to your actual domain

### 3. Detailed Logging
All payment operations now include detailed logging:
- Payment initialization requests
- Webhook payload verification
- Transaction processing steps
- Error details and stack traces

### 4. Enhanced Error Handling
- Better error messages for debugging
- Graceful failure handling
- Detailed error logging

## 📋 Common Issues & Solutions

### Issue 1: "Invalid authorization key"
**Solution**: Use valid Flutterwave API keys from your dashboard

### Issue 2: Webhook not working
**Solution**: 
- Ensure `FLUTTERWAVE_SECRET_HASH` is set
- Check webhook URL is accessible
- Verify payload parsing

### Issue 3: Payment verification fails
**Solution**:
- Check transaction reference format
- Verify metadata structure
- Ensure user roles are correct

### Issue 4: Contract funding not working
**Solution**:
- Verify contract exists and is accessible
- Check client permissions
- Ensure proper metadata (`userRole`, `contractId`)

## 🧪 Testing Checklist

- [ ] Flutterwave configuration endpoint returns `isConfigured: true`
- [ ] Token purchase initialization returns payment URL
- [ ] Contract payment initialization returns payment URL
- [ ] Webhook endpoint responds with 200 OK
- [ ] Payment verification updates user balances
- [ ] Transaction records are created

## 📊 Payment Flow Overview

### Token Purchase Flow
1. User selects token package
2. Frontend calls `/api/tokens/purchase`
3. Server initializes Flutterwave payment
4. User completes payment on Flutterwave
5. Flutterwave sends webhook to `/api/payments/flutterwave/webhook`
6. Server processes payment and adds tokens
7. User redirected to success page

### Contract Funding Flow
1. Client initiates contract payment
2. Frontend calls `/api/contracts/:id/payment`
3. Server initializes Flutterwave payment
4. Client completes payment on Flutterwave
5. Flutterwave sends webhook
6. Server updates contract escrow status
7. Client redirected to success page

## 🚀 Next Steps

1. **Replace test keys** with your actual Flutterwave keys
2. **Test payment flows** using the checklist above
3. **Monitor logs** for any errors during testing
4. **Configure webhook URL** in Flutterwave dashboard
5. **Test in production** with live keys when ready

## 🔗 Useful Links

- [Flutterwave Documentation](https://developer.flutterwave.com)
- [Flutterwave Test Cards](https://developer.flutterwave.com/docs/testing-and-debugging/test-cards)
- [Flutterwave Dashboard](https://dashboard.flutterwave.com)

## 💡 Pro Tips

1. **Always use test keys** in development
2. **Test with Flutterwave test cards** first
3. **Monitor server logs** during payment flows
4. **Test webhook locally** using tools like ngrok
5. **Keep API keys secure** and never commit them