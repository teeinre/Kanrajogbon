
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminHeader from "@/components/admin-header";
import {
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileImage,
  Camera,
  Calendar,
  AlertTriangle
} from "lucide-react";

interface PendingVerification {
  id: string;
  userId: string;
  documentType: string;
  documentFrontImage: string;
  documentBackImage?: string;
  selfieImage: string;
  status: string;
  submittedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface VerificationDetail extends PendingVerification {
  rejectionReason?: string;
  reviewedAt?: string;
}

const documentTypeLabels: { [key: string]: string } = {
  national_id: "National ID Card",
  passport: "International Passport",
  voters_card: "Voter's Card"
};

export default function AdminVerificationManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedVerification, setSelectedVerification] = useState<VerificationDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: pendingVerifications = [], isLoading } = useQuery<PendingVerification[]>({
    queryKey: ['/api/admin/verifications'],
    enabled: !!user && user.role === 'admin'
  });

  const { data: verificationDetail } = useQuery<VerificationDetail>({
    queryKey: ['/api/admin/verifications', selectedVerification?.id],
    enabled: !!selectedVerification?.id,
    onSuccess: (data) => {
      setSelectedVerification(data);
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (verificationId: string) => {
      return apiRequest(`/api/admin/verifications/${verificationId}/approve`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({ title: "Verification approved successfully" });
      setIsDetailModalOpen(false);
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast({ title: "Error approving verification", description: error.message, variant: "destructive" });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ verificationId, reason }: { verificationId: string; reason: string }) => {
      return apiRequest(`/api/admin/verifications/${verificationId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({ title: "Verification rejected successfully" });
      setIsRejectModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedVerification(null);
      setRejectionReason("");
    },
    onError: (error: any) => {
      toast({ title: "Error rejecting verification", description: error.message, variant: "destructive" });
    }
  });

  const handleViewDetails = async (verification: PendingVerification) => {
    setSelectedVerification(verification);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedVerification) return;
    await approveMutation.mutateAsync(selectedVerification.id);
  };

  const handleReject = async () => {
    if (!selectedVerification || !rejectionReason.trim()) {
      toast({ title: "Please provide a rejection reason", variant: "destructive" });
      return;
    }
    await rejectMutation.mutateAsync({
      verificationId: selectedVerification.id,
      reason: rejectionReason.trim()
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="verification" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading verifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <AdminHeader currentPage="verification" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600" />
            Identity Verification Management
          </h1>
          <p className="text-gray-600">Review and manage user identity verification requests</p>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Verifications ({pendingVerifications.length})</span>
              <Badge variant="outline" className="bg-yellow-50">
                <Clock className="w-4 h-4 mr-1" />
                Awaiting Review
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Verifications</h3>
                <p className="text-gray-600">All verification requests have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingVerifications.map((verification) => (
                  <div key={verification.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <User className="w-10 h-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {verification.user.firstName} {verification.user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{verification.user.email}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(verification.submittedAt).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">
                              {documentTypeLabels[verification.documentType]}
                            </span>
                            <Badge className={
                              verification.user.role === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }>
                              {verification.user.role === 'client' ? 'Client' : 'Finder'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(verification.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(verification)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Verification Review</DialogTitle>
            </DialogHeader>
            {selectedVerification && (
              <div className="space-y-6">
                {/* User Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Name</Label>
                        <p className="font-medium">{selectedVerification.user.firstName} {selectedVerification.user.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="font-medium">{selectedVerification.user.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Role</Label>
                        <Badge className={selectedVerification.user.role === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {selectedVerification.user.role === 'client' ? 'Client' : 'Finder'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Document Type</Label>
                        <p className="font-medium">{documentTypeLabels[selectedVerification.documentType]}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Submitted Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Document Front */}
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                          <FileImage className="w-4 h-4 mr-1" />
                          Document Front
                        </Label>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={selectedVerification.documentFrontImage}
                            alt="Document Front"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>

                      {/* Document Back */}
                      {selectedVerification.documentBackImage && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                            <FileImage className="w-4 h-4 mr-1" />
                            Document Back
                          </Label>
                          <div className="border rounded-lg overflow-hidden">
                            <img
                              src={selectedVerification.documentBackImage}
                              alt="Document Back"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Selfie */}
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                          <Camera className="w-4 h-4 mr-1" />
                          Selfie Photo
                        </Label>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={selectedVerification.selfieImage}
                            alt="Selfie"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Guidelines */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Verification Checklist:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Check if document images are clear and readable</li>
                      <li>• Verify that the document is valid and not expired</li>
                      <li>• Compare the face in the selfie with the photo on the ID</li>
                      <li>• Ensure all personal information is visible and matches</li>
                      <li>• Look for signs of tampering or forgery</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsRejectModalOpen(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={approveMutation.isLoading}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rejection Modal */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Verification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please provide a clear reason for rejecting this verification. This will be sent to the user.
                </AlertDescription>
              </Alert>
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Document image is blurry, faces do not match, document appears expired..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  disabled={!rejectionReason.trim() || rejectMutation.isLoading}
                >
                  {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Verification'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
