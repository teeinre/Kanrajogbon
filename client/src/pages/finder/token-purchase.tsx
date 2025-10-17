import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { FinderHeader } from "@/components/finder-header";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Coins, CreditCard, ArrowLeft, Star, Zap, Users, Crown } from "lucide-react";
import { FlutterwavePaymentModal } from "@/components/FlutterwavePaymentModal";

interface TokenPackage {
  id: string;
  name: string;
  price: string;
  tokenCount: number;
  popular?: boolean;
}

export default function TokenPurchase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [tokenAmount, setTokenAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);

  const [flutterwaveModal, setFlutterwaveModal] = useState<{
    isOpen: boolean;
    packageId: string;
    packageName: string;
    packagePrice: number;
    tokenCount: number;
  }>({
    isOpen: false,
    packageId: '',
    packageName: '',
    packagePrice: 0,
    tokenCount: 0
  });

  // Check if user returned from payment and redirect to success page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const reference = urlParams.get('reference');

    if (payment === 'success' && reference) {
      // Redirect to payment success page immediately
      setLocation(`/finder/payment-success?payment=success&reference=${reference}`);
    }
  }, [setLocation]);

  // Fetch token packages from backend
  const { data: tokenPackages, isLoading: packagesLoading } = useQuery<TokenPackage[]>({
    queryKey: ['/api/tokens/packages'],
    enabled: !!user
  });

  // Fetch current finder profile with token balance
  const { data: finder } = useQuery({
    queryKey: ['/api/finder/profile'],
    enabled: !!user
  });

  const handlePurchase = async (pkg: TokenPackage) => {
    setSelectedPackage(pkg);
    setFlutterwaveModal({
      isOpen: true,
      packageId: pkg.id,
      packageName: pkg.name,
      packagePrice: parseFloat(pkg.price),
      tokenCount: pkg.tokenCount
    });
  };

  const handleCustomPurchase = async () => {
    if (tokenAmount <= 0) return;

    // Calculate price based on token packages or default rate
    const defaultRate = 20; // ₦20 per token as shown in the old packages
    const totalPrice = tokenAmount * defaultRate;

    const packageData: TokenPackage = {
      id: 'custom',
      name: `${tokenAmount} FinderTokens`,
      price: totalPrice.toString(),
      tokenCount: tokenAmount,
    };
    await handlePurchase(packageData);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Purchase Successful!",
      description: "Tokens have been added to your account.",
    });
    // Refresh data here if needed
  };

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTokenAmount(Math.max(1, Math.min(1000, value))); // Min 1, Max 1000 tokens
  };

  const presetAmounts = [10, 25, 50, 100];

  if (packagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FinderHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading token packages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FinderHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">Purchase Findertokens</h1>
            <p className="text-muted-foreground">
              Buy findertokens to submit proposals and grow your finder business
            </p>
          </div>

          {/* Current Balance */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
                  <p className="text-muted-foreground">Available findertokens for proposals</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-6 h-6 text-orange-500" />
                    <span className="text-3xl font-bold text-orange-600">
                      {(finder as any)?.findertokenBalance || 0}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">findertokens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Packages */}
          {tokenPackages && tokenPackages.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <CardTitle className="text-2xl">FinderToken™ Packages</CardTitle>
                </div>
                <CardDescription>
                  Choose from our available token packages
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {tokenPackages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`border-2 border-muted hover:border-blue-200 transition-colors ${
                        pkg.popular ? 'border-orange-200 bg-orange-50/50 relative' : ''
                      }`}
                    >
                      {pkg.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                          Most Popular
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{pkg.name}</CardTitle>
                          <Star className="w-5 h-5 text-blue-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center space-y-3">
                          <div className="text-3xl font-bold text-blue-600">{pkg.tokenCount}</div>
                          <div className="text-sm text-muted-foreground">FinderTokens</div>
                          <div className="text-2xl font-bold">₦{parseFloat(pkg.price).toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            ₦{(parseFloat(pkg.price) / pkg.tokenCount).toFixed(2)} per token
                          </div>
                          <div>
                            <Button
                              onClick={() => handlePurchase(pkg)}
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                              size="lg"
                              data-testid={`purchase-${pkg.id}`}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Purchase with Flutterwave
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Monthly Allocation Info */}
                <Card className="bg-blue-50/50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💎 Monthly Benefits</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>• Each verified Finder receives <strong>20 free FinderTokens</strong> monthly</p>
                      <p>• <strong>Beta Launch Bonus:</strong> First 50 verified Finders receive 70 FinderTokens + fast-track promotion opportunities</p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {/* Custom Amount Purchase Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Custom Amount Purchase</CardTitle>
              <CardDescription>
                Purchase any amount of tokens at ₦20 per token
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Token Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="tokenAmount">Number of Tokens</Label>
                <Input
                  id="tokenAmount"
                  type="number"
                  min="1"
                  max="1000"
                  value={tokenAmount}
                  onChange={handleTokenAmountChange}
                  className="text-lg"
                  placeholder="Enter token amount"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum: 1 token • Maximum: 1,000 tokens
                </p>
              </div>

              {/* Preset Amount Buttons */}
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={tokenAmount === amount ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTokenAmount(amount)}
                      className="w-full"
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tokens:</span>
                  <span>{tokenAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price per token:</span>
                  <span>₦20.00</span>
                </div>
                <div className="border-t border-muted pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Price:</span>
                    <span className="text-red-600">₦{(tokenAmount * 20).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                className="w-full text-lg py-6"
                onClick={handleCustomPurchase}
                disabled={loading || tokenAmount <= 0}
                size="lg"
              >
                {loading ? (
                  "Processing Payment..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Purchase {tokenAmount} Tokens for ₦{(tokenAmount * 20).toLocaleString()}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* FinderToken™ Usage Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>FinderToken™ Usage Overview</CardTitle>
              <CardDescription>How FinderTokens power engagement on FinderMeister</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">For Finders:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Every Find application requires 10 FinderTokens</li>
                    <li>• Boost your proposal visibility with premium features</li>
                    <li>• Access exclusive high-value find opportunities</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">For Clients:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Posting high-budget finds (₦100,000+) requires tokens</li>
                    <li>• Optional: Boost find visibility (50 FinderTokens)</li>
                    <li>• Get more serious, quality proposals</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Why FinderTokens?</h4>
                <p className="text-sm text-yellow-800">
                  FinderTokens ensure fairness, limit spam, and promote quality participation in the FinderMeister ecosystem.
                  Clients gain more visibility and serious proposals, while Finders increase their chances of winning finds with strategic token use.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How the Process Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-semibold">Purchase Tokens</h4>
                  <p className="text-sm text-muted-foreground">Buy FinderTokens using secure Flutterwave payment integration</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-semibold">Submit Proposals</h4>
                  <p className="text-sm text-muted-foreground">Use 10 tokens per proposal to apply for finds that match your expertise</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-semibold">Win Contracts & Earn</h4>
                  <p className="text-sm text-muted-foreground">Get selected by clients, complete the work, and earn the full contract amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Flutterwave Payment Modal */}
      <FlutterwavePaymentModal
        isOpen={flutterwaveModal.isOpen}
        onClose={() => setFlutterwaveModal(prev => ({ ...prev, isOpen: false }))}
        packageId={flutterwaveModal.packageId}
        packageName={flutterwaveModal.packageName}
        packagePrice={flutterwaveModal.packagePrice}
        tokenCount={flutterwaveModal.tokenCount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}