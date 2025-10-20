
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import ClientHeader from "@/components/client-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentSuccess() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get('reference') || urlParams.get('tx_ref');
  const paymentType = urlParams.get('type');
  const contractId = urlParams.get('contractId');
  const status = urlParams.get('status');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        console.error('No payment reference found');
        setVerificationStatus('failed');
        return;
      }

      try {
        console.log('Client payment verification: Starting verification for reference:', reference);
        console.log('Client payment verification: Payment type:', paymentType);
        console.log('Client payment verification: Contract ID:', contractId);
        console.log('Client payment verification: Current URL:', window.location.href);
        
        if (paymentType === 'contract' && contractId) {
          // Verify contract payment
          console.log('Client payment verification: Verifying contract payment...');
          const result = await apiRequest(`/api/contracts/${contractId}/verify-payment/${reference}`);
          console.log('Client payment verification: Contract payment result:', result);
          
          if (result.status === 'success') {
            setPaymentDetails({
              type: 'contract',
              contractId: contractId,
              amount: result.contract?.amount,
              message: result.message || 'Contract payment verified successfully'
            });
            setVerificationStatus('success');
          } else {
            console.error('Contract payment verification failed:', result);
            setVerificationStatus('failed');
          }
        } else {
          // Verify token payment
          console.log('Verifying token payment...');
          const result = await apiRequest(`/api/client/tokens/flutterwave/verify/${reference}`);
          console.log('Token payment verification result:', result);
          
          if (result.status === 'success') {
            setPaymentDetails({
              type: 'tokens',
              message: 'Tokens added to your account successfully'
            });
            setVerificationStatus('success');
          } else {
            console.error('Token payment verification failed:', result);
            setVerificationStatus('failed');
          }
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        console.error('Error details:', error.message);
        setVerificationStatus('failed');
      }
    };

    // Add a delay to ensure the payment has been processed by Flutterwave
    const timer = setTimeout(verifyPayment, 3000); // Increased delay
    return () => clearTimeout(timer);
  }, [reference, paymentType, contractId]);

  // Allow access without authentication for payment callbacks
  // if (!user || user.role !== 'client') {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardContent className="p-6 text-center">
  //           <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
  //           <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
  //           <p className="text-gray-600 mb-4">Please log in to view payment results.</p>
  //           <Button onClick={() => navigate("/login")}>
  //             Sign In
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ClientHeader currentPage="contracts" />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {verificationStatus === 'pending' && (
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              )}
              {verificationStatus === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-500" />
              )}
              {verificationStatus === 'failed' && (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            
            <CardTitle className="text-2xl">
              {verificationStatus === 'pending' && 'Processing Payment...'}
              {verificationStatus === 'success' && 'Payment Successful!'}
              {verificationStatus === 'failed' && 'Payment Failed'}
            </CardTitle>
            
            <CardDescription>
              {verificationStatus === 'pending' && 'Please wait while we verify your payment'}
              {verificationStatus === 'success' && 'Your payment has been processed successfully'}
              {verificationStatus === 'failed' && 'We could not process your payment'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {verificationStatus === 'success' && paymentDetails && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    {paymentDetails.message}
                  </span>
                </div>
                
                {paymentDetails.type === 'contract' && paymentDetails.amount && (
                  <p className="text-green-700 mt-2">
                    Amount: ₦{parseInt(paymentDetails.amount).toLocaleString()}
                  </p>
                )}
              </div>
            )}
            
            {verificationStatus === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  Payment verification failed. If money was deducted from your account, 
                  please contact support with reference: {reference}
                </p>
              </div>
            )}
            
            <div className="flex flex-col space-y-3">
              {verificationStatus === 'success' && paymentDetails?.type === 'contract' && (
                <Button 
                  onClick={() => navigate(`/client/contracts/${paymentDetails.contractId}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Contract
                </Button>
              )}
              
              {verificationStatus === 'success' && paymentDetails?.type === 'tokens' && (
                <Button 
                  onClick={() => navigate('/client/tokens')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Token Balance
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/client/dashboard')}
              >
                Back to Dashboard
              </Button>
              
              {verificationStatus === 'failed' && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/support/contact')}
                >
                  Contact Support
                </Button>
              )}
            </div>
            
            {reference && (
              <div className="text-center text-sm text-gray-500">
                Reference: {reference}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
