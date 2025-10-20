import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FinderHeader } from "@/components/finder-header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Clock, AlertCircle, Wallet } from "lucide-react"; // Added Wallet icon
import type { WithdrawalRequest } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function WithdrawalSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    routingNumber: ""
  });

  const { data: withdrawalSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/finder/withdrawal-settings'],
    enabled: !!user
  });

  const { data: withdrawalHistory = [], isLoading: historyLoading } = useQuery<WithdrawalRequest[]>({
    queryKey: ['/api/finder/withdrawals'],
    enabled: !!user
  });

  const { data: finder } = useQuery({
    queryKey: ['/api/finder/profile'],
    enabled: !!user
  });

  const { data: pendingEarnings } = useQuery({
    queryKey: ['/api/finder/pending-earnings'],
    enabled: !!user
  });

  // Update form data when withdrawal settings change
  useEffect(() => {
    if (withdrawalSettings && withdrawalSettings.bankDetails) {
      setFormData({
        bankName: withdrawalSettings.bankDetails.bankName || "",
        accountNumber: withdrawalSettings.bankDetails.accountNumber || "",
        accountHolder: withdrawalSettings.bankDetails.accountHolder || "",
        routingNumber: withdrawalSettings.bankDetails.routingNumber || ""
      });
    }
  }, [withdrawalSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Updating withdrawal settings with data:', data);
      
      // Validate data structure before sending
      if (!data.bankDetails || typeof data.bankDetails !== 'object') {
        throw new Error('Invalid bank details format');
      }
      
      if (!data.bankDetails.bankName || !data.bankDetails.accountNumber || !data.bankDetails.accountHolder) {
        throw new Error('Missing required bank details');
      }
      
      return apiRequest('/api/finder/withdrawal-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/finder/withdrawal-settings'] });
      toast({
        title: "Settings updated",
        description: "Your withdrawal settings have been successfully updated.",
      });
    },
    onError: (error: any) => {
      console.error('Update settings error:', error);
      const errorMessage = error?.message || error?.toString() || "Failed to update withdrawal settings";
      toast({
        title: "Error",
        description: errorMessage.includes('function') 
          ? "A technical error occurred. Please refresh the page and try again."
          : errorMessage,
        variant: "destructive",
      });
    },
  });

  const requestWithdrawalMutation = useMutation({
    mutationFn: (data: { amount: number; paymentDetails: any }) => apiRequest('/api/finder/withdraw', {
      method: 'POST',
      body: JSON.stringify({
        amount: data.amount,
        paymentMethod: 'Bank Transfer',
        paymentDetails: data.paymentDetails
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/finder/withdrawals'] });
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request withdrawal",
        variant: "destructive",
      });
    },
  });

  const handleUpdateSettings = () => {
    try {
      // Validate form data
      if (!formData.bankName || !formData.accountNumber || !formData.accountHolder) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required bank details (Bank Name, Account Number, and Account Holder Name).",
          variant: "destructive",
        });
        return;
      }

      // Trim and validate each field
      const bankName = String(formData.bankName).trim();
      const accountNumber = String(formData.accountNumber).trim();
      const accountHolder = String(formData.accountHolder).trim();
      const routingNumber = String(formData.routingNumber || '').trim();

      if (!bankName || !accountNumber || !accountHolder) {
        toast({
          title: "Validation Error",
          description: "All required fields must have valid values.",
          variant: "destructive",
        });
        return;
      }

      const settingsData = {
        paymentMethod: "bank_transfer",
        minimumThreshold: 50,
        bankDetails: {
          bankName,
          accountNumber,
          accountHolder,
          routingNumber
        }
      };

      console.log('Submitting withdrawal settings:', settingsData);
      updateSettingsMutation.mutate(settingsData);
    } catch (error) {
      console.error('Error preparing withdrawal settings:', error);
      toast({
        title: "Error",
        description: "Failed to prepare withdrawal settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawalRequest = () => {
    // Available balance is already in naira format
    const availableBalance = Math.max(0, parseFloat(finder?.availableBalance || '0'));
    const minimumThreshold = 50;

    // Check if balance is sufficient for minimum threshold
    if (availableBalance < minimumThreshold) {
      toast({
        title: "Insufficient balance",
        description: `Minimum withdrawal amount is ₦${minimumThreshold}. Available: ₦${availableBalance.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    // Calculate withdrawal fees (5% fee)
    const feePercentage = 0.05;
    const withdrawalFee = availableBalance * feePercentage;
    const netAmount = availableBalance - withdrawalFee;

    // Double check net amount is positive
    if (netAmount <= 0) {
      toast({
        title: "Insufficient balance",
        description: `Available balance after fees would be ₦${netAmount.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    const paymentDetails = {
      accountName: formData.accountHolder,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName,
      routingNumber: formData.routingNumber
    };

    requestWithdrawalMutation.mutate({
      amount: netAmount.toFixed(2),
      paymentDetails
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-finder-red/20 text-finder-red-dark';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (settingsLoading || historyLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FinderHeader />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading withdrawal settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FinderHeader />

      <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Withdrawal Settings</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your bank account and withdrawal preferences</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Available Balance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Available Balance</h3>
                  <p className="text-3xl font-bold text-green-600">
                    ₦{Math.max(0, parseFloat(finder?.availableBalance || '0')).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Balance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Pending Balance</h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">
                    ₦{(pendingEarnings?.netAmount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {pendingEarnings?.contractCount || 0} contract{(pendingEarnings?.contractCount || 0) !== 1 ? 's' : ''} awaiting release
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6">
          {/* Bank Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bank Transfer Details */}
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                      placeholder="Enter bank name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input
                      id="accountHolder"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                      placeholder="Enter account holder name"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                      placeholder="Enter account number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                      placeholder="Enter routing number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="pt-4 border-t">
                <Button
                  onClick={handleUpdateSettings}
                  disabled={updateSettingsMutation.isPending}
                  className="bg-finder-red hover:bg-finder-red-dark w-full sm:w-auto"
                >
                  {updateSettingsMutation.isPending ? "Updating..." : "Update Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">₦</span>
                Request Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Withdrawal Information</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Minimum withdrawal amount: ₦50.00</li>
                      <li>• 5% processing fee will be deducted</li>
                      <li>• Powered by Flutterwave for secure bank transfers</li>
                      <li>• Withdrawals are processed within minutes to 24 hours</li>
                      <li>• Ensure your bank details are correct before requesting</li>
                      <li>• You'll receive instant notifications on transfer status</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Available Balance Display */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Available for Withdrawal</p>
                    <p className="text-2xl font-bold text-green-800">
                      ₦{Math.max(0, parseFloat(finder?.availableBalance || '0')).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* Withdrawal Button */}
              <div className="space-y-4">
                {(!formData.bankName || !formData.accountNumber || !formData.accountHolder) ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Please complete your bank account settings above before requesting a withdrawal.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleWithdrawalRequest}
                    disabled={requestWithdrawalMutation.isPending || (Math.max(0, parseFloat(finder?.availableBalance || '0')) < 50)}
                    className="w-full bg-finder-red hover:bg-finder-red-dark text-white py-3"
                    size="lg"
                  >
                    {requestWithdrawalMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">₦</span>
                        Request Withdrawal of Full Balance
                      </div>
                    )}
                  </Button>
                )}

                {(Math.max(0, parseFloat(finder?.availableBalance || '0')) < 50) && (
                  <p className="text-sm text-gray-600 text-center">
                    Minimum withdrawal amount is ₦50.00
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Withdrawal History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalHistory.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal history</h3>
                  <p className="text-gray-600">Your withdrawal requests will appear here once you make them.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>Processed At</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawalHistory.slice(0, 10).map((withdrawal) => ( // Limit to last 10 transactions
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {withdrawal.requestId || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>₦{parseFloat(withdrawal.amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell>{withdrawal.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(withdrawal.status)}>
                              {withdrawal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {withdrawal.requestedAt ? new Date(withdrawal.requestedAt).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {withdrawal.processedAt ? new Date(withdrawal.processedAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {withdrawal.adminNotes || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {withdrawalHistory.length > 10 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-500">
                        Showing last 10 of {withdrawalHistory.length} transactions
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}