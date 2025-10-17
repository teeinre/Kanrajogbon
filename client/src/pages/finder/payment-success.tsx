import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { FinderHeader } from "@/components/finder-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Coins } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentSuccess() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const queryClient = useQueryClient();

  // Get reference from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference') || urlParams.get('tx_ref'); // Flutterwave uses tx_ref
  const paymentParam = urlParams.get('payment');
  const status = urlParams.get('status');
  const transactionId = urlParams.get('transaction_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        console.error('Payment verification: No reference found');
        setVerificationStatus('failed');
        return;
      }

      console.log('Payment verification: Starting verification for reference:', reference);
      console.log('Payment verification: URL params:', { reference, paymentParam, status, transactionId });

      try {
        // Determine payment service based on reference format
        let verifyEndpoint = `/api/payments/verify/${reference}`;
        if (reference.startsWith('OPAY_')) {
          verifyEndpoint = `/api/payments/opay/verify/${reference}`;
        } else if (reference.startsWith('FLW_')) {
          verifyEndpoint = `/api/payments/flutterwave/verify/${reference}`;
        }

        console.log('Payment verification: Calling endpoint:', verifyEndpoint);

        // Verify payment with backend
        const result = await apiRequest(verifyEndpoint);
        console.log('Payment verification: Backend response:', result);
        
        if (result.status === 'success') {
          setVerificationStatus('success');
          setPaymentDetails(result.data);
          
          // Invalidate relevant queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['/api/finder/profile'] });
          queryClient.invalidateQueries({ queryKey: ['/api/finder/transactions'] });
          
          console.log('Payment verification: Success! Tokens should be credited.');
          
          // Redirect to thank you page after successful verification
          setTimeout(() => {
            const tokens = result.data?.metadata?.tokens || 'N/A';
            setLocation(`/finder/thank-you?reference=${reference}&tokens=${tokens}`);
          }, 2000);
        } else {
          console.error('Payment verification: Backend returned failed status:', result);
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('failed');
      }
    };

    // Only verify if we have a reference and the URL indicates success
    // Handle both generic payment=success and Flutterwave status=completed
    if (reference && (paymentParam === 'success' || status === 'completed')) {
      console.log('Payment verification: Conditions met, starting verification...');
      verifyPayment();
    } else {
      console.error('Payment verification: Conditions not met:', { reference, paymentParam, status });
      setVerificationStatus('failed');
    }
  }, [reference, paymentParam, status, queryClient]);

  const handleContinue = () => {
    setLocation('/finder/dashboard');
  };

  const handleRetry = () => {
    setLocation('/finder/token-purchase');
  };

  // Allow access without authentication for payment callbacks
  // if (!user) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <FinderHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              {verificationStatus === 'pending' && (
                <>
                  <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <CardTitle>Verifying Payment</CardTitle>
                  <CardDescription>
                    Please wait while we confirm your payment...
                  </CardDescription>
                </>
              )}

              {verificationStatus === 'success' && (
                <>
                  <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-600">Payment Successful!</CardTitle>
                  <CardDescription>
                    Your FinderTokens™ have been added to your account
                  </CardDescription>
                </>
              )}

              {verificationStatus === 'failed' && (
                <>
                  <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <CardTitle className="text-red-600">Payment Failed</CardTitle>
                  <CardDescription>
                    We couldn't verify your payment. Please try again.
                  </CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {verificationStatus === 'success' && paymentDetails && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <Coins className="w-5 h-5" />
                    <span className="font-semibold">
                      {paymentDetails.metadata?.tokens || 'N/A'} FinderTokens™ Added
                    </span>
                  </div>
                  <div className="text-sm text-green-600 mt-2 space-y-1">
                    <p>Transaction Reference: {reference}</p>
                    {transactionId && (
                      <p>Transaction ID: {transactionId}</p>
                    )}
                  </div>
                </div>
              )}

              {verificationStatus === 'success' && (
                <Button onClick={handleContinue} className="w-full">
                  Continue to Dashboard
                </Button>
              )}

              {verificationStatus === 'failed' && (
                <div className="space-y-2">
                  <Button onClick={handleRetry} className="w-full" variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={handleContinue} variant="secondary" className="w-full">
                    Go to Dashboard
                  </Button>
                </div>
              )}

              {verificationStatus === 'pending' && (
                <p className="text-sm text-gray-500">
                  This may take a few seconds...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}