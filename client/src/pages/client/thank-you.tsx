import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import ClientHeader from "@/components/client-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift, CreditCard, Handshake, ArrowRight, Star } from "lucide-react";

export default function ThankYou() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [paymentType, setPaymentType] = useState<'contract' | 'tokens' | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type');
  const contractId = urlParams.get('contractId');
  const amount = urlParams.get('amount');
  const reference = urlParams.get('reference');

  useEffect(() => {
    if (type === 'contract') {
      setPaymentType('contract');
      setPaymentDetails({
        contractId,
        amount,
        reference
      });
    } else if (type === 'tokens') {
      setPaymentType('tokens');
      setPaymentDetails({
        reference
      });
    }
  }, [type, contractId, amount, reference]);

  if (!user || user.role !== 'client') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to view this page.</p>
            <Button onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ClientHeader currentPage={paymentType === 'contract' ? 'contracts' : 'tokens'} />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-4 h-4 text-yellow-700" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Thank You!
            </CardTitle>
            
            <CardDescription className="text-lg text-gray-600">
              {paymentType === 'contract' 
                ? 'Your contract payment has been processed successfully'
                : 'Your token purchase has been completed successfully'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Payment Success Message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {paymentType === 'contract' ? (
                    <Handshake className="w-8 h-8 text-green-600" />
                  ) : (
                    <Gift className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 text-lg mb-2">
                    {paymentType === 'contract' 
                      ? 'Contract Funded Successfully!'
                      : 'Tokens Added to Your Account!'
                    }
                  </h3>
                  <p className="text-green-700">
                    {paymentType === 'contract' 
                      ? 'Your contract is now fully funded and work can begin. The finder has been notified and will start working on your request.'
                      : 'Your new tokens have been added to your account and are ready to use for posting new job requests.'
                    }
                  </p>
                  
                  {paymentDetails?.amount && (
                    <div className="mt-3 flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Amount: ₦{parseInt(paymentDetails.amount).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 text-lg mb-3 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                What's Next?
              </h3>
              <div className="space-y-3 text-blue-700">
                {paymentType === 'contract' ? (
                  <>
                    <p>• The finder will be notified and can now start working on your request</p>
                    <p>• You can track progress in your contracts dashboard</p>
                    <p>• You'll receive updates as work progresses</p>
                    <p>• Funds will be released to the finder upon completion</p>
                  </>
                ) : (
                  <>
                    <p>• Your tokens are now available in your account</p>
                    <p>• Use them to post new job requests</p>
                    <p>• Each job posting costs 1 token</p>
                    <p>• View your token balance in your dashboard</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              {paymentType === 'contract' && paymentDetails?.contractId && (
                <Button 
                  onClick={() => navigate(`/client/contracts/${paymentDetails.contractId}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  data-testid="button-view-contract"
                >
                  View Contract Details
                </Button>
              )}
              
              {paymentType === 'tokens' && (
                <Button 
                  onClick={() => navigate('/client/tokens')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  data-testid="button-view-tokens"
                >
                  View Token Balance
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/client/dashboard')}
                className="py-3 text-lg"
                data-testid="button-dashboard"
              >
                Back to Dashboard
              </Button>
            </div>
            
            {/* Reference Number */}
            {paymentDetails?.reference && (
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Transaction Reference: <span className="font-mono">{paymentDetails.reference}</span>
                </p>
              </div>
            )}

            {/* Thank You Message */}
            <div className="text-center pt-2">
              <p className="text-gray-600 italic">
                Thank you for choosing FinderMeister. We appreciate your business!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}