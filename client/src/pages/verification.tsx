
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ClientHeader from "@/components/client-header";
import { FinderHeader } from "@/components/finder-header";
import {
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Camera,
  FileImage,
  AlertTriangle,
  Shield,
  Users,
  Eye
} from "lucide-react";

interface VerificationStatus {
  isRequired: boolean;
  verification: {
    id: string;
    status: string;
    documentType: string;
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
  } | null;
}

const documentTypes = [
  { value: "national_id", label: "National ID Card" },
  { value: "passport", label: "International Passport" },
  { value: "voters_card", label: "Voter's Card" }
];

export default function Verification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentFrontRef = useRef<HTMLInputElement>(null);
  const documentBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const { data: verificationStatus, isLoading } = useQuery<VerificationStatus>({
    queryKey: ['/api/verification/status'],
    enabled: !!user
  });

  const submitVerification = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findermeister_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit verification');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      toast({ 
        title: "Verification submitted successfully", 
        description: "Your documents are now under review." 
      });
      // Reset form
      setSelectedDocumentType("");
      setDocumentFront(null);
      setDocumentBack(null);
      setSelfie(null);
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      console.error('Verification submission error:', error);
      toast({ 
        title: "Error submitting verification", 
        description: error.message || "Please try again", 
        variant: "destructive" 
      });
      setIsSubmitting(false);
    }
  });

  const handleFileSelect = (type: 'documentFront' | 'documentBack' | 'selfie', file: File) => {
    if (type === 'documentFront') setDocumentFront(file);
    else if (type === 'documentBack') setDocumentBack(file);
    else if (type === 'selfie') setSelfie(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDocumentType || !documentFront || !selfie) {
      toast({ 
        title: "Missing required fields", 
        description: "Please select document type, upload document front, and take a selfie.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('documentType', selectedDocumentType);
    formData.append('documentFront', documentFront);
    if (documentBack) formData.append('documentBack', documentBack);
    formData.append('selfie', selfie);

    try {
      await submitVerification.mutateAsync(formData);
    } catch (error) {
      // Error handling is done in the mutation onError callback
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {user?.role === 'client' && <ClientHeader currentPage="verification" />}
        {user?.role === 'finder' && <FinderHeader currentPage="verification" />}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!verificationStatus?.isRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {user?.role === 'client' && <ClientHeader currentPage="verification" />}
        {user?.role === 'finder' && <FinderHeader currentPage="verification" />}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Not Required</h3>
              <p className="text-gray-600">
                Identity verification is currently not required for this platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const verification = verificationStatus.verification;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {user?.role === 'client' && <ClientHeader currentPage="verification" />}
      {user?.role === 'finder' && <FinderHeader currentPage="verification" />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Shield className="mr-3 h-8 w-8 text-blue-600" />
            Identity Verification
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Verify your identity to access all FinderMeister features. This helps maintain trust and security in our community.
          </p>
        </div>

        {/* Current Status */}
        {verification && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Verification Status
                {getStatusBadge(verification.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Document Type:</span> {documentTypes.find(d => d.value === verification.documentType)?.label}
                </div>
                <div>
                  <span className="font-medium">Submitted:</span> {new Date(verification.submittedAt).toLocaleDateString()}
                </div>
                {verification.reviewedAt && (
                  <div>
                    <span className="font-medium">Reviewed:</span> {new Date(verification.reviewedAt).toLocaleDateString()}
                  </div>
                )}
                {verification.rejectionReason && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Rejection Reason:</strong> {verification.rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Why Verify Your Identity?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium mb-2">Trust & Safety</h3>
                <p className="text-sm text-gray-600">Build trust with other verified users</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium mb-2">Full Access</h3>
                <p className="text-sm text-gray-600">Access all platform features</p>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-medium mb-2">Priority Support</h3>
                <p className="text-sm text-gray-600">Get faster customer support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Form */}
        {(!verification || verification.status === 'rejected') && (
          <Card>
            <CardHeader>
              <CardTitle>Submit Verification Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Document Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="documentType">Select Document Type</Label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your ID document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(doc => (
                        <SelectItem key={doc.value} value={doc.value}>{doc.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Front Upload */}
                <div className="space-y-2">
                  <Label>Document Front Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={documentFrontRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect('documentFront', e.target.files[0])}
                    />
                    {documentFront ? (
                      <div className="space-y-2">
                        <FileImage className="w-8 h-8 text-green-600 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">{documentFront.name}</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => documentFrontRef.current?.click()}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">Upload front side of your ID document</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => documentFrontRef.current?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Back Upload */}
                <div className="space-y-2">
                  <Label>Document Back Image (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={documentBackRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect('documentBack', e.target.files[0])}
                    />
                    {documentBack ? (
                      <div className="space-y-2">
                        <FileImage className="w-8 h-8 text-green-600 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">{documentBack.name}</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => documentBackRef.current?.click()}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">Upload back side of your ID document (if applicable)</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => documentBackRef.current?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selfie Upload */}
                <div className="space-y-2">
                  <Label>Selfie Photo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={selfieRef}
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect('selfie', e.target.files[0])}
                    />
                    {selfie ? (
                      <div className="space-y-2">
                        <Camera className="w-8 h-8 text-green-600 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">{selfie.name}</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => selfieRef.current?.click()}
                        >
                          Retake Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">Take a clear selfie photo</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => selfieRef.current?.click()}
                        >
                          Take Selfie
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full" 
                  disabled={isSubmitting || !selectedDocumentType || !documentFront || !selfie}
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </form>

              {/* Guidelines */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important Guidelines:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Ensure all images are clear and well-lit</li>
                    <li>• All text on documents must be readable</li>
                    <li>• Your face in the selfie should match the ID photo</li>
                    <li>• Documents must be valid and not expired</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
