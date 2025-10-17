import crypto from 'crypto';

export interface FlutterwaveTokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number; // in NGN (Nigerian Naira)
  popular?: boolean;
}

export const FLUTTERWAVE_TOKEN_PACKAGES: FlutterwaveTokenPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 10,
    price: 5000, // ₦5,000
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    tokens: 25,
    price: 10000, // ₦10,000
    popular: true
  },
  {
    id: 'business',
    name: 'Business Pack',
    tokens: 50,
    price: 18000, // ₦18,000
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    tokens: 100,
    price: 30000, // ₦30,000
  }
];

export function getTokensFromAmount(amount: number): number {
  const packageMapping: { [key: number]: number } = {
    5000: 10,   // Starter Pack
    10000: 25,  // Professional Pack
    18000: 50,  // Business Pack
    30000: 100  // Enterprise Pack
  };
  return packageMapping[amount] || 0;
}

export interface FlutterwaveTransaction {
  status: 'success' | 'failed';
  amount: number;
  currency: string;
  tx_ref: string;
  id: string;
  metadata?: any;
}

export class FlutterwaveService {
  private secretKey: string;
  private publicKey: string;
  private baseUrl = 'https://api.flutterwave.com/v3';

  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';
    this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY || '';

    if (!this.secretKey || !this.publicKey) {
      console.warn('Flutterwave API keys not configured');
    }
  }

  isConfigured(): boolean {
    return !!(this.secretKey && this.publicKey);
  }

  generateTransactionReference(userId: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FLW_${userId.substring(0, 8).toUpperCase()}_${timestamp}_${randomSuffix}`;
  }

  getBaseUrl(): string {
    // Get the correct base URL for redirects
    if (process.env.NODE_ENV === 'production') {
      return process.env.REPLIT_DOMAINS ? 
        `https://${process.env.REPLIT_DOMAINS}` : 
        process.env.FRONTEND_URL || 
        process.env.BASE_URL || 
        'https://your-production-domain.com';
    } else {
      return process.env.REPLIT_DOMAINS ? 
        `https://${process.env.REPLIT_DOMAINS}` : 
        'http://localhost:5000';
    }
  }

  async initializePayment(options: {
    email: string;
    amount: number;
    reference: string;
    metadata: any;
    redirectUrl: string;
  }): Promise<{ authorization_url: string; reference: string }> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave service is not properly configured');
    }

    try {
      const payload = {
        tx_ref: options.reference,
        amount: options.amount,
        currency: 'NGN',
        redirect_url: options.redirectUrl,
        customer: {
          email: options.email,
          name: options.metadata.customerName || 'FinderMeister User'
        },
        customizations: {
          title: options.metadata.type === 'contract_payment' ? 'Contract Payment' : 'Token Purchase',
          description: options.metadata.description || 'FinderMeister Payment',
          logo: 'https://your-logo-url.com/logo.png'
        },
        meta: options.metadata
      };

      console.log('Flutterwave payment payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Flutterwave payment response:', JSON.stringify(data, null, 2));

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to initialize payment');
      }

      return {
        authorization_url: data.data.link,
        reference: options.reference
      };
    } catch (error) {
      console.error('Flutterwave payment initialization error:', error);
      throw error;
    }
  }

  async verifyTransaction(reference: string): Promise<FlutterwaveTransaction> {
    if (!this.isConfigured()) {
      throw new Error('Flutterwave service is not properly configured');
    }

    try {
      console.log(`Verifying transaction with reference: ${reference}`);
      
      const response = await fetch(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Flutterwave verification response:', JSON.stringify(data, null, 2));

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || 'Failed to verify transaction');
      }

      return {
        status: data.data.status === 'successful' ? 'success' : 'failed',
        amount: data.data.amount,
        currency: data.data.currency,
        tx_ref: data.data.tx_ref,
        id: data.data.id,
        metadata: data.data.meta || {}
      };
    } catch (error) {
      console.error('Flutterwave verification error:', error);
      throw error;
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!signature || !process.env.FLUTTERWAVE_SECRET_HASH) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.FLUTTERWAVE_SECRET_HASH)
      .update(payload, 'utf8')
      .digest('hex');

    return expectedSignature === signature;
  }
}