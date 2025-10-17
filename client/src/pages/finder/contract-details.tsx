import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FinderHeader } from "@/components/finder-header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileDisplay } from "@/components/file-display";
import { FileUpload } from "@/components/file-upload";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  User, 
  Calendar,
  FileText,
  Upload,
  Eye,
  Download,
  Calculator,
  Minus,
  Plus,
  ArrowLeft,
  Briefcase,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { ContractDisputeModal } from "@/components/ContractDisputeModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Helper function to format currency
const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numAmount).replace(/NGN/g, '₦');
  } catch (error) {
    // Fallback if locale is not supported
    return `₦${numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
};

interface ContractDetails {
  id: string;
  requestId: string;
  proposalId: string;
  amount: string;
  escrowStatus: string;
  isCompleted: boolean;
  hasSubmission: boolean;
  createdAt: string;
  completedAt?: string;
  request?: {
    title: string;
    description: string;
  };
  orderSubmission?: {
    id: string;
    submissionText?: string;
    attachmentPaths: string[];
    status: string;
    submittedAt: string;
    autoReleaseDate?: string;
  };
}

export default function FinderContractDetails() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [match, params] = useRoute("/finder/contracts/:contractId");
  const contractId = params?.contractId;

  // Dispute modal state
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const { data: contract, isLoading } = useQuery<ContractDetails>({
    queryKey: [`/api/finder/contracts/${contractId}`],
    enabled: !!user && !!contractId
  });

  // Get admin settings for fee calculations
  const { data: adminSettings } = useQuery({
    queryKey: ['/api/admin/settings'],
    enabled: !!contract
  });

  // Calculate platform fees and net earnings
  const calculateEarnings = (contractAmount: string) => {
    const grossAmount = parseFloat(contractAmount);

    if (!adminSettings) {
      return {
        grossAmount,
        platformFeePercentage: 5, // Default fallback
        platformFeeAmount: grossAmount * 0.05,
        netEarnings: grossAmount * 0.95,
        availableBalance: grossAmount * 0.95 // Amount credited to withdrawable balance
      };
    }

    const feePercentage = parseFloat(adminSettings.finderEarningsChargePercentage || '5');
    const platformFeeAmount = grossAmount * (feePercentage / 100);
    const netEarnings = grossAmount - platformFeeAmount;

    return {
      grossAmount,
      platformFeePercentage: feePercentage,
      platformFeeAmount,
      netEarnings,
      availableBalance: netEarnings // This is what gets credited to withdrawable balance
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FinderHeader />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading contract details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FinderHeader />
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('contract.contract_not_found')}</h1>
            <p className="text-gray-600 mb-6">{t('contract.contract_not_found_desc')}</p>
            <Link href="/finder/contracts">
              <Button>{t('navigation.contracts')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (contract: ContractDetails) => {
    if (contract.isCompleted) {
      return <Badge className="bg-green-100 text-green-800">{t('contract.completed')}</Badge>;
    }
    if (contract.escrowStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Hired, Awaiting Funding</Badge>;
    }
    if (contract.hasSubmission) {
      return <Badge className="bg-yellow-100 text-yellow-800">{t('contract.under_review')}</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">{t('contract.in_progress')}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FinderHeader />

      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/finder/contracts">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back')} {t('navigation.contracts')}
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {contract.request?.title || t('contract.contract_details')}
              </h1>
              <p className="text-gray-600">
                {t('contract.contract_id')}: {contract.id}
              </p>
            </div>
            {getStatusBadge(contract)}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Contract Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                {t('contract.contract_overview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Contract Value</p>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(contract.amount)}</p>
                  </div>

                  {/* Platform Fee Breakdown */}
                  {adminSettings && (
                    <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                      <h4 className="font-semibold text-orange-800 flex items-center">
                        <Calculator className="w-4 h-4 mr-2" />
                        Earnings Calculation
                      </h4>
                      
                      {/* Platform Fee */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-orange-600">
                          <Minus className="w-3 h-3 mr-1" />
                          Platform Fee ({calculateEarnings(contract.amount).platformFeePercentage}%):
                        </span>
                        <span className="font-semibold text-orange-600">
                          -{formatCurrency(calculateEarnings(contract.amount).platformFeeAmount)}
                        </span>
                      </div>

                      {/* Your Earnings */}
                      <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                        <span className="flex items-center font-semibold text-green-700">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Your Earnings:
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(calculateEarnings(contract.amount).availableBalance)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-1">
                        {contract.isCompleted 
                          ? "✓ This amount has been credited to your available balance"
                          : "This amount will be credited to your available balance upon completion"
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('contract.started')}</p>
                      <p className="font-medium">{formatDate(contract.createdAt)}</p>
                    </div>
                  </div>

                  {contract.completedAt && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">{t('contract.completed')}</p>
                        <p className="font-medium">{formatDate(contract.completedAt)}</p>
                        {contract.orderSubmission?.autoReleaseDate && (
                          <p className="text-xs text-gray-500">
                            Funds release: {formatDate(contract.orderSubmission.autoReleaseDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Escrow and Contract Status */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Escrow Status:</span>
                      <Badge 
                        className={
                          contract.escrowStatus === 'held' ? 'bg-yellow-100 text-yellow-800' :
                          contract.escrowStatus === 'released' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {contract.escrowStatus}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={contract.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {contract.isCompleted ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
                <p className="text-gray-600 leading-relaxed">
                  {contract.request?.description || 'No description available.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Funding Warning */}
          {contract.escrowStatus === 'pending' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Contract Awaiting Funding</h3>
                    <p className="text-sm text-yellow-800 mt-1">
                      You have been hired for this project! However, work cannot begin until the client funds the contract escrow. 
                      You will be notified once the contract is funded and ready to start.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submission Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Work Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contract.escrowStatus === 'pending' ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-yellow-600">
                    <Clock className="w-6 h-6" />
                    <div>
                      <p className="font-medium">Awaiting Contract Funding</p>
                      <p className="text-sm text-gray-600">
                        Work submission is disabled until the client funds the contract escrow.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Work (Disabled)
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Work submission will be enabled once contract is funded
                    </p>
                  </div>
                </div>
              ) : contract.isCompleted ? (
                <div className="flex items-center space-x-3 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p className="font-medium">Work Completed</p>
                    <p className="text-sm text-gray-600">This contract has been successfully completed.</p>
                  </div>
                </div>
              ) : contract.hasSubmission ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-yellow-600">
                    <Clock className="w-6 h-6" />
                    <div>
                      <p className="font-medium">Under Review</p>
                      <p className="text-sm text-gray-600">
                        Your work has been submitted and is being reviewed by the client.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href={`/orders/submit/${contract.id}`}>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        View Submission Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-blue-600">
                    <Upload className="w-6 h-6" />
                    <div>
                      <p className="font-medium">Ready for Submission</p>
                      <p className="text-sm text-gray-600">
                        Complete your work and submit it for client review.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href={`/orders/submit/${contract.id}`}>
                      <Button className="bg-finder-red hover:bg-finder-red-dark text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Work
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">₦</span>
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Contract Value */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contract Value:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(contract.amount)}
                  </span>
                </div>

                {/* Platform Fee Breakdown */}
                {adminSettings && (
                  <>
                    <Separator />
                    <div className="bg-orange-50 p-4 rounded-lg space-y-2">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Calculator className="w-4 h-4 mr-2" />
                        Earnings Calculation
                      </h4>

                      {/* Platform Fee */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-orange-600">
                          <Minus className="w-3 h-3 mr-1" />
                          Platform Fee ({calculateEarnings(contract.amount).platformFeePercentage}%):
                        </span>
                        <span className="font-medium text-orange-600">
                          -{formatCurrency(calculateEarnings(contract.amount).platformFeeAmount)}
                        </span>
                      </div>

                      {/* Net Earnings */}
                      <div className="flex justify-between items-center text-lg border-t pt-2">
                        <span className="flex items-center font-semibold text-green-700">
                          <Plus className="w-4 h-4 mr-1" />
                          Your Earnings:
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(calculateEarnings(contract.amount).availableBalance)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2">
                        {contract.isCompleted 
                          ? "✓ This amount has been credited to your available balance"
                          : "This amount will be credited to your available balance upon completion"
                        }
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Contract Status */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Escrow Status:</span>
                  <Badge 
                    className={
                      contract.escrowStatus === 'held' ? 'bg-yellow-100 text-yellow-800' :
                      contract.escrowStatus === 'released' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {contract.escrowStatus}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={contract.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {contract.isCompleted ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escrow Information */}
          <Card>
            <CardHeader>
              <CardTitle>Escrow Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  contract.escrowStatus === 'held' ? 'bg-yellow-500' :
                  contract.escrowStatus === 'in_progress' ? 'bg-yellow-500' :
                  contract.escrowStatus === 'completed' ? 'bg-blue-500' :
                  contract.escrowStatus === 'released' ? 'bg-green-500' :
                  'bg-gray-500'
                }`}></div>
                <div>
                  <p className="font-medium capitalize">
                    {contract.escrowStatus?.replace('_', ' ') || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {contract.escrowStatus === 'held' && 'Payment is securely held in escrow'}
                    {contract.escrowStatus === 'in_progress' && 'Work is in progress, payment held in escrow'}
                    {contract.escrowStatus === 'completed' && 'Work completed, payment ready for release'}
                    {contract.escrowStatus === 'released' && 'Payment has been released to you'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => setIsDisputeModalOpen(true)}
                  variant="outline" 
                  className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                  data-testid="button-dispute-contract"
                >
                  <AlertTriangle className="w-4 h-4 mr-3" />
                  {t('dispute.report_issue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dispute Modal */}
      <ContractDisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        contractId={contractId || ''}
        contractTitle={contract?.request?.title}
      />
    </div>
  );
}