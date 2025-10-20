import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  FileText, 
  Calendar, 
  MessageCircle,
  Download,
  Eye,
  Star,
  User,
  AlertCircle,
  Briefcase,
  Shield,
  TrendingUp,
  Loader2,
  Award,
  FileCheck,
  Timer,
  CreditCard,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import ClientHeader from "@/components/client-header";
import { ContractDisputeModal } from "@/components/ContractDisputeModal";

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
    category?: string;
    timeframe?: string;
  };
  finder?: {
    name: string;
    email?: string;
    rating?: string;
  };
  orderSubmission?: {
    id: string;
    submissionText?: string;
    attachmentPaths: string[];
    status: string;
    submittedAt: string;
  };
}

export default function ContractDetails() {
  const { contractId } = useParams<{ contractId: string }>();
  const [, navigate] = useLocation(); // Changed from useLocation() to just useLocation to match the example and for consistency
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    contractId?: string;
    amount?: number;
    paymentUrl?: string;
    reference?: string;
    findTitle?: string;
    finderName?: string;
  }>({ isOpen: false });

  // Dispute modal state
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  const { data: contract, isLoading } = useQuery<ContractDetails>({
    queryKey: ["/api/client/contracts", contractId],
    enabled: !!contractId,
  });

  const createConversation = useMutation({
    mutationFn: async (proposalId: string) => {
      console.log('Creating conversation with proposalId:', proposalId);
      return apiRequest("/api/messages/conversations", {
        method: "POST",
        body: JSON.stringify({ proposalId }),
      });
    },
    onSuccess: (data) => {
      console.log('Conversation created successfully:', data);
      navigate(`/messages/${data.id}`);
      toast({
        title: "Success!",
        description: "Conversation started successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Conversation creation error:', error);
      toast({
        variant: "destructive",
        title: "Unable to Start Conversation",
        description: error?.message || "Please try again later.",
      });
    }
  });

  // Payment initialization mutation
  const initializePaymentMutation = useMutation({
    mutationFn: async (contractId: string) => {
      return apiRequest(`/api/contracts/${contractId}/payment`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      if (data.authorization_url) {
        // Redirect to Flutterwave payment page
        window.location.href = data.authorization_url;
      } else {
        toast({
          variant: "destructive",
          title: "Payment Setup Failed",
          description: "Payment service is currently unavailable. Please contact support.",
        });
      }
    },
    onError: (error: any) => {
      console.error('Payment initialization error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Unable to initialize payment. Please try again or contact support.",
      });
    },
  });

  // Payment verification mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: async (reference: string) => {
      return apiRequest(`/api/contracts/${contractId}/payment/verify/${reference}`);
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast({
          title: "Payment Successful!",
          description: "Your contract has been funded and work can now begin.",
        });
        // Refresh contract data
        queryClient.invalidateQueries({ queryKey: ["/api/client/contracts", contractId] });
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "Payment was not successful. Please try again.",
        });
      }
    },
    onError: (error: any) => {
      console.error('Payment verification error:', error);
      toast({
        variant: "destructive",
        title: "Payment Verification Failed",
        description: "Unable to verify payment. Please contact support if money was deducted.",
      });
    },
  });

  // Auto-open payment modal if accessed via fund-contract route
  useEffect(() => {
    if (location.pathname.includes('/fund-contract/') && contract && contract.escrowStatus === 'pending') {
      setPaymentModal({
        isOpen: true,
        contractId: contractId,
        amount: parseFloat(contract.amount), // Ensure amount is a number
        paymentUrl: '', // Payment URL will be fetched upon modal open or handled differently
        reference: '', // Reference will be fetched upon modal open or handled differently
        findTitle: contract?.request?.title || 'Find Request',
        finderName: contract?.finder?.name || 'Finder',
      });
    }
  }, [location.pathname, contract, contractId]);


  const handleMessageFinder = () => {
    if (contract?.proposalId) {
      console.log('Starting conversation with proposal ID:', contract.proposalId);
      createConversation.mutate(contract.proposalId);
    } else {
      console.error('No proposal ID found in contract:', contract);
      toast({
        variant: "destructive",
        title: "Unable to Start Conversation",
        description: "Contract proposal information is missing.",
      });
    }
  };

  const handleInitiatePayment = () => {
    if (contractId) {
      initializePaymentMutation.mutate(contractId);
    }
  };

  // Redirect if not authenticated or not client
  if (!user || user.role !== 'client') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-6">This contract is only accessible by clients.</p>
          <Button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <ClientHeader currentPage="contracts" />

        <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
              <div className="h-32 bg-slate-200 rounded-lg mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-20 bg-slate-200 rounded-lg"></div>
                <div className="h-20 bg-slate-200 rounded-lg"></div>
                <div className="h-20 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="h-48 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">Contract Not Found</h3>
          <p className="text-slate-600 mb-6">The contract you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate("/client/contracts")}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contracts
          </Button>
        </div>
      </div>
    );
  }

  // Calculate progress based on status
  const getContractProgress = () => {
    if (contract.isCompleted) return 100;
    if (contract.hasSubmission) return 75;
    if (contract.escrowStatus === 'funded') return 50;
    return 25;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
      case 'funded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'submitted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ClientHeader currentPage="contracts" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Contract Header */}
        <div className="mb-8">
          <div className="text-center sm:text-left mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Contract Details
            </h1>
            {contract.request?.title && (
              <div className="mb-3">
                <p className="text-sm font-medium text-slate-600 mb-1">Find Title:</p>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                  {contract.request.title}
                </h2>
              </div>
            )}
            <p className="text-sm sm:text-lg text-slate-600 mb-4">
              Working with {contract.finder?.name || "Professional Finder"}
            </p>
          </div>

          {/* Progress Tracker */}
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Contract Progress</h3>
                  <p className="text-sm text-slate-600">Working with {contract.finder?.name || "Professional Finder"}</p>
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {getContractProgress()}% Complete
                </span>
              </div>
              <Progress value={getContractProgress()} className="h-2 mb-4" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex flex-col items-center p-2 rounded-lg bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600 mb-1" />
                  <span className="text-green-700 font-medium">Contract</span>
                  <span className="text-green-600">Signed</span>
                </div>

                <div className={`flex flex-col items-center p-2 rounded-lg ${
                  contract.escrowStatus === 'funded' || contract.escrowStatus === 'held' ? 'bg-green-50' : 'bg-slate-50'
                }`}>
                  <Shield className={`w-4 h-4 mb-1 ${
                    contract.escrowStatus === 'funded' || contract.escrowStatus === 'held' ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <span className={`font-medium ${
                    contract.escrowStatus === 'funded' || contract.escrowStatus === 'held' ? 'text-green-700' : 'text-slate-500'
                  }`}>Payment</span>
                  <span className={contract.escrowStatus === 'funded' || contract.escrowStatus === 'held' ? 'text-green-600' : 'text-slate-400'}>
                    {contract.escrowStatus === 'funded' || contract.escrowStatus === 'held' ? 'Secured' : 'Pending'}
                  </span>
                </div>

                <div className={`flex flex-col items-center p-2 rounded-lg ${
                  contract.hasSubmission ? 'bg-green-50' : 'bg-slate-50'
                }`}>
                  <FileCheck className={`w-4 h-4 mb-1 ${
                    contract.hasSubmission ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <span className={`font-medium ${
                    contract.hasSubmission ? 'text-green-700' : 'text-slate-500'
                  }`}>Work</span>
                  <span className={contract.hasSubmission ? 'text-green-600' : 'text-slate-400'}>
                    {contract.hasSubmission ? 'Submitted' : 'In Progress'}
                  </span>
                </div>

                <div className={`flex flex-col items-center p-2 rounded-lg ${
                  contract.isCompleted ? 'bg-green-50' : 'bg-slate-50'
                }`}>
                  <Award className={`w-4 h-4 mb-1 ${
                    contract.isCompleted ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <span className={`font-medium ${
                    contract.isCompleted ? 'text-green-700' : 'text-slate-500'
                  }`}>Complete</span>
                  <span className={contract.isCompleted ? 'text-green-600' : 'text-slate-400'}>
                    {contract.isCompleted ? 'Finished' : 'Pending'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Contract Overview */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-blue-200">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm sm:text-lg">
                        {(contract.finder?.name || "F").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
                        {contract.finder?.name || contract.finder?.email?.split('@')[0] || "Professional Finder"}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium ml-1">
                            {contract.finder?.rating && parseFloat(contract.finder.rating) > 0 
                              ? parseFloat(contract.finder.rating).toFixed(1) 
                              : 'No rating yet'}
                          </span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-600">Verified Professional</span>
                      </div>
                      {contract.finder?.email && (
                        <p className="text-sm text-slate-500">{contract.finder.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Project Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                    Project Details
                  </h4>

                  {contract.request?.description && (
                    <div className="bg-slate-50/80 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">
                        {contract.request.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {contract.request?.category && (
                      <div>
                        <Label className="text-slate-600">Category</Label>
                        <div className="font-medium text-slate-900">{contract.request.category}</div>
                      </div>
                    )}
                    {contract.request?.timeframe && (
                      <div>
                        <Label className="text-slate-600">Timeline</Label>
                        <div className="font-medium text-slate-900">{contract.request.timeframe}</div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleMessageFinder}
                    disabled={createConversation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {createConversation.isPending ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message Finder
                      </>
                    )}
                  </Button>

                  {contract.hasSubmission && (
                    <Button 
                      onClick={() => navigate(`/orders/review/${contract.id}`)}
                      variant="outline" 
                      className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Work
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Submission */}
            {contract.hasSubmission && contract.orderSubmission ? (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                      <FileCheck className="w-5 h-5 mr-2 text-green-600" />
                      Work Submission
                    </h3>
                    <Badge className={getStatusColor(contract.orderSubmission.status)}>
                      {contract.orderSubmission.status === "accepted" ? "✅ Accepted" : 
                       contract.orderSubmission.status === "submitted" ? "📋 Submitted" : 
                       "⏳ " + contract.orderSubmission.status}
                    </Badge>
                  </div>

                  <div className="bg-green-50/80 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-900">
                            Submitted on {new Date(contract.orderSubmission.submittedAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-green-700">
                            {contract.orderSubmission.attachmentPaths.length} attachment(s) included
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {contract.orderSubmission.submissionText && (
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-900 mb-3">Submission Message:</h4>
                      <div className="bg-slate-50/80 rounded-lg p-4">
                        <p className="text-slate-700 leading-relaxed">
                          {contract.orderSubmission.submissionText}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => navigate(`/orders/review/${contract.id}`)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Full Submission
                    </Button>
                    {contract.orderSubmission.attachmentPaths.length > 0 && (
                      <Button 
                        variant="outline" 
                        className="flex-1 border-slate-200 hover:bg-slate-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Files ({contract.orderSubmission.attachmentPaths.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Timer className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Work In Progress</h3>
                  <p className="text-slate-600 mb-6">
                    {contract.finder?.name || "The finder"} is currently working on your project. 
                    You'll be notified once they submit their completed work.
                  </p>
                  <Button 
                    onClick={() => navigate(`/orders/review/${contract.id}`)}
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Check Progress
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Contract Info & Stats */}
          <div className="space-y-6 sm:space-y-8">
            {/* Contract Summary */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-semibold text-slate-900 mb-6 flex items-center">
                  Contract Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50/80 rounded-lg">
                    <div>
                      <p className="text-sm text-green-700">Total Amount</p>
                      <p className="text-2xl font-bold text-green-800">
                        ₦{parseInt(contract.amount || "0").toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50/80 rounded-lg">
                    <div>
                      <p className="text-sm text-blue-700">Escrow Status</p>
                      <p className="font-semibold text-blue-800 capitalize">
                        {contract.escrowStatus === 'funded' || contract.escrowStatus === 'held' ? '🔒 Secured' : '⏳ Processing'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-700">Started On</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(contract.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>

                  {contract.completedAt && (
                    <div className="flex items-center justify-between p-4 bg-green-50/80 rounded-lg">
                      <div>
                        <p className="text-sm text-green-700">Completed On</p>
                        <p className="font-semibold text-green-800">
                          {new Date(contract.completedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {/* Payment warning for pending escrow */}
                  {contract.escrowStatus === 'pending' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Payment Required</p>
                          <p className="text-xs text-amber-700">This contract is pending payment. Work cannot begin until escrow is funded.</p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleInitiatePayment}
                        disabled={initializePaymentMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {initializePaymentMutation.isPending ? (
                          <>
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            Setting up payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Fund Contract Escrow
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  <Button 
                    onClick={() => navigate("/client/contracts")}
                    variant="outline" 
                    className="w-full justify-start border-slate-200 hover:bg-slate-50"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    View All Contracts
                  </Button>

                  <Button 
                    onClick={() => navigate("/client/dashboard")}
                    variant="outline" 
                    className="w-full justify-start border-slate-200 hover:bg-slate-50"
                  >
                    <TrendingUp className="w-4 h-4 mr-3" />
                    Dashboard
                  </Button>

                  <Button 
                    onClick={() => navigate("/client/proposals")}
                    variant="outline" 
                    className="w-full justify-start border-slate-200 hover:bg-slate-50"
                  >
                    <Briefcase className="w-4 h-4 mr-3" />
                    View Proposals
                  </Button>

                  {/* Dispute Button */}
                  <Button 
                    onClick={() => setIsDisputeModalOpen(true)}
                    variant="outline" 
                    className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                    data-testid="button-dispute-contract"
                  >
                    <AlertTriangle className="w-4 h-4 mr-3" />
                    Report Issue
                  </Button>

                  {/* Admin Controls - Only visible to admin users */}
                  {(user?.role as string) === 'admin' && (
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Admin Controls</p>
                      
                      {contract.escrowStatus === 'funded' && !contract.isCompleted && (
                        <>
                          <AdminCompleteButton contractId={contractId!} />
                          <AdminCancelButton contractId={contractId!} />
                        </>
                      )}
                      
                      {contract.isCompleted && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700">✓ Contract completed</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60 shadow-xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Have questions about your contract or need assistance?
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate("/support")}
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false })}
        contractId={paymentModal.contractId || ''}
        amount={paymentModal.amount || 0}
        paymentUrl={paymentModal.paymentUrl || ''}
        reference={paymentModal.reference || ''}
        findTitle={paymentModal.findTitle || ''}
        finderName={paymentModal.finderName || ''}
      />

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

// Helper component for labels
function Label({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={`text-xs font-medium text-slate-500 mb-1 ${className}`}>
      {children}
    </p>
  );
}

// Admin Complete Contract Button
function AdminCompleteButton({ contractId }: { contractId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/admin/contracts/${contractId}/complete`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Contract Completed",
        description: "Contract has been marked as complete and funds released to finder.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/contracts", contractId] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete contract",
      });
    }
  });

  return (
    <Button
      onClick={() => {
        if (confirm("Are you sure you want to complete this contract and release funds to the finder?")) {
          completeMutation.mutate();
        }
      }}
      disabled={completeMutation.isPending}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
      data-testid="button-admin-complete"
    >
      {completeMutation.isPending ? (
        <>
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          Completing...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Contract
        </>
      )}
    </Button>
  );
}

// Admin Cancel Contract Button
function AdminCancelButton({ contractId }: { contractId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async (reason: string) => {
      return apiRequest(`/api/admin/contracts/${contractId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Contract Cancelled",
        description: "Contract has been cancelled and client refunded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/contracts", contractId] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to cancel contract",
      });
    }
  });

  const handleCancel = () => {
    const reason = prompt("Please provide a reason for cancelling this contract:");
    if (reason && reason.trim()) {
      cancelMutation.mutate(reason.trim());
    }
  };

  return (
    <Button
      onClick={handleCancel}
      disabled={cancelMutation.isPending}
      variant="outline"
      className="w-full border-red-200 text-red-700 hover:bg-red-50"
      data-testid="button-admin-cancel"
    >
      {cancelMutation.isPending ? (
        <>
          <Loader2 className="animate-spin w-4 h-4 mr-2" />
          Cancelling...
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Contract
        </>
      )}
    </Button>
  );
}

// Enhanced PaymentModal component with better error handling
function PaymentModal({ isOpen, onClose, contractId, amount, paymentUrl, reference, findTitle, finderName }: any) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-initialize payment when modal opens
  useEffect(() => {
    if (isOpen && contractId && !paymentUrl) {
      setStatus('loading');
      setErrorMessage('');
      
      // Initialize payment
      apiRequest(`/api/contracts/${contractId}/payment`, {
        method: "POST",
      })
      .then((data) => {
        if (data.authorization_url) {
          // Redirect to Flutterwave payment page directly
          window.location.href = data.authorization_url;
        } else {
          setStatus('error');
          setErrorMessage('Payment service is currently unavailable. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Payment initialization failed:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Payment service is currently unavailable. Please try again later or contact support.');
      });
    } else if (paymentUrl) {
      setStatus('ready');
    }
  }, [isOpen, contractId, paymentUrl, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Fund Contract</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Contract Details:</p>
          <p className="font-medium">{findTitle}</p>
          <p className="text-sm text-gray-600">with {finderName}</p>
          <p className="text-lg font-bold text-green-600 mt-2">₦{amount?.toLocaleString()}</p>
        </div>

        {status === 'loading' && (
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Preparing payment...</p>
          </div>
        )}

        {status === 'ready' && paymentUrl && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Click below to proceed with payment:</p>
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </Button>
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-medium text-red-800">Payment Unavailable</p>
              </div>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setStatus('loading');
                  setErrorMessage('');
                  // Retry payment initialization
                  apiRequest(`/api/contracts/${contractId}/payment`, {
                    method: "POST",
                  })
                  .then((data) => {
                    if (data.authorization_url) {
                      window.open(data.authorization_url, '_blank', 'width=600,height=600');
                      onClose();
                    } else {
                      setStatus('error');
                      setErrorMessage('Payment service is currently unavailable. Please try again later.');
                    }
                  })
                  .catch((error) => {
                    setStatus('error');
                    setErrorMessage(error.message || 'Payment service is currently unavailable. Please try again later or contact support.');
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}

        {status !== 'error' && (
          <Button variant="outline" onClick={onClose} className="w-full mt-3">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}