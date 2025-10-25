import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ClientHeader from "@/components/client-header";
import { FileUploader } from "@/components/FileUploader";
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  AlertTriangle, 
  Shield,
  ExternalLink,
  Zap
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  isActive: boolean; // Assuming this property exists based on usage
}

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

export default function CreateRequest() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    minBudget: "",
    maxBudget: "",
    timeframe: "",
    location: "",
    requirements: "",
    boostAmount: "" // Initialize boostAmount
  });

  // Check verification status
  const { data: verificationStatus, isLoading: verificationLoading } = useQuery<VerificationStatus>({
    queryKey: ['/api/verification/status'],
    enabled: !!user
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const createFindMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = localStorage.getItem('findermeister_token') || localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/client/finds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const error = await response.json();

        // Handle token expiration
        if (response.status === 401 || response.status === 403) {
          // Clear both possible token locations
          localStorage.removeItem('token');
          localStorage.removeItem('findermeister_token');
          localStorage.removeItem('user');

          // Create a more specific error based on the response
          if (error.code === 'TOKEN_EXPIRED') {
            throw new Error('Your session has expired. Please log in again.');
          } else if (error.code === 'TOKEN_INVALID') {
            throw new Error('Invalid session. Please log in again.');
          } else {
            throw new Error('Session expired. Please log in again.');
          }
        }

        throw error;
      }

      return response.json();
    },
    onSuccess: (responseData: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/client/finds'] });

      let toastTitle = "Find Posted Successfully!";
      let toastDescription = "Your find is now live and visible to finders.";
      let redirectPath = "/client/dashboard";

      if (responseData.status === 'under_review') {
        toastTitle = "Find Submitted for Review";
        toastDescription = responseData.message;
        redirectPath = "/client/finds/pending"; // Redirect to pending finds page
      } else {
        toast({
          title: toastTitle,
          description: toastDescription,
        });
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        minBudget: "",
        maxBudget: "",
        timeframe: "",
        location: "",
        requirements: "",
        boostAmount: "" // Reset boostAmount
      });

      setSelectedFiles([]);
      setStep(1);

      // Navigate after a delay
      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    },
    onError: (error: any) => {
      // Check if this is an authentication error
      if (error.message?.includes("Session expired") || error.message?.includes("Authentication required")) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to continue.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate("/login");
              }}
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Login
            </Button>
          ),
        });
      } else if (error.verificationRequired || error.message?.includes("verification required")) {
        toast({
          variant: "destructive",
          title: "Account Verification Required",
          description: error.message || "You must verify your account before posting finds.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate("/verification");
              }}
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Verify Account
            </Button>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error posting find",
          description: error.message || "Something went wrong. Please try again.",
        });
      }
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: File[]) => {
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return formData.title.trim() !== '' && 
               formData.description.trim() !== '' && 
               formData.category !== '';
      case 2:
        return formData.minBudget !== '' && 
               formData.maxBudget !== '' && 
               formData.timeframe !== '';
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill in all required fields before continuing.",
      });
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2)) {
      toast({
        variant: "destructive",
        title: "Required fields missing",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('category', formData.category);
    formDataToSubmit.append('budgetMin', formData.minBudget);
    formDataToSubmit.append('budgetMax', formData.maxBudget);
    formDataToSubmit.append('timeframe', formData.timeframe);

    if (formData.location) {
      formDataToSubmit.append('location', formData.location);
    }
    if (formData.requirements) {
      formDataToSubmit.append('requirements', formData.requirements);
    }

    // Add boost data
    if (formData.boostAmount && parseInt(formData.boostAmount) > 0) {
      formDataToSubmit.append('boostAmount', formData.boostAmount);
    }

    // Append files
    selectedFiles.forEach((file) => {
      formDataToSubmit.append('attachments', file);
    });

    createFindMutation.mutate(formDataToSubmit);
  };

  // Show loading state while checking verification
  if (verificationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <ClientHeader currentPage="create-find" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Checking verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if verification is required and user is not verified
  // Trust the user table status for already verified users
  const needsVerification = verificationStatus?.isRequired && !user?.isVerified;

  if (needsVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <ClientHeader currentPage="create-find" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Shield className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <CardTitle className="text-xl text-yellow-800">Account Verification Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-yellow-300 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  You must verify your account before you can post finds. This helps maintain trust and security in our community.
                </AlertDescription>
              </Alert>

              {verificationStatus.verification && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">Current Status:</span>
                    <Badge 
                      variant={
                        verificationStatus.verification.status === 'pending' ? 'secondary' :
                        verificationStatus.verification.status === 'rejected' ? 'destructive' : 'default'
                      }
                    >
                      {verificationStatus.verification.status.charAt(0).toUpperCase() + 
                       verificationStatus.verification.status.slice(1)}
                    </Badge>
                  </div>
                  {verificationStatus.verification.status === 'pending' && (
                    <p className="text-sm text-gray-600">
                      Your verification is under review. You'll be able to post finds once it's approved.
                    </p>
                  )}
                  {verificationStatus.verification.status === 'rejected' && (
                    <p className="text-sm text-gray-600">
                      Your verification was rejected. Please submit a new verification with the correct documents.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">What you need to do:</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Complete the identity verification process
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Upload clear photos of your ID document
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Take a selfie for identity confirmation
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate("/verification")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {verificationStatus.verification ? 'Update Verification' : 'Start Verification'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/client/dashboard")}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <ClientHeader currentPage="create-find" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`h-1 w-16 sm:w-24 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Budget & Time</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 1 && "What are you looking for?"}
              {step === 2 && "Budget and Timeline"}
              {step === 3 && "Additional Details"}
              {step === 4 && "Review and Post"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">
                    Find Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Looking for a vintage leather jacket"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-base font-medium">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat.isActive).map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Provide detailed information about what you're looking for, including specifications, preferred brands, condition requirements, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-2 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Budget and Timeline */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Budget Range (₦) <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minBudget" className="text-sm">Minimum</Label>
                      <Input
                        id="minBudget"
                        type="number"
                        placeholder="5,000"
                        value={formData.minBudget}
                        onChange={(e) => handleInputChange('minBudget', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxBudget" className="text-sm">Maximum</Label>
                      <Input
                        id="maxBudget"
                        type="number"
                        placeholder="20,000"
                        value={formData.maxBudget}
                        onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeframe" className="text-base font-medium">
                    When do you need this? <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP (1-2 days)</SelectItem>
                      <SelectItem value="week">Within a week</SelectItem>
                      <SelectItem value="two_weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="month">Within a month</SelectItem>
                      <SelectItem value="no_rush">No rush</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="location" className="text-base font-medium">
                    Preferred Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Lagos, Abuja, Online"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-base font-medium">
                    Special Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    placeholder="Any specific requirements, conditions, or notes for finders..."
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    className="mt-2 resize-none"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Label htmlFor="boostAmount" className="text-base font-medium text-blue-900 flex items-center mb-2">
                    <Zap className="w-4 h-4 mr-2" />
                    Boost Your Find (Optional)
                  </Label>
                  <p className="text-sm text-blue-700 mb-3">
                    Boost your find to appear at the top of the list. Average boost amount is 10 Findertokens.
                  </p>
                  <Select value={formData.boostAmount} onValueChange={(value) => handleInputChange('boostAmount', value)}>
                    <SelectTrigger className="mt-2 bg-white">
                      <SelectValue placeholder="Select boost amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Boost (Free)</SelectItem>
                      <SelectItem value="5">5 Findertokens - Standard Boost</SelectItem>
                      <SelectItem value="10">10 Findertokens - Priority Boost</SelectItem>
                      <SelectItem value="20">20 Findertokens - Premium Boost</SelectItem>
                      <SelectItem value="50">50 Findertokens - VIP Boost</SelectItem>
                    </SelectContent>
                  </Select>
                  {parseInt(formData.boostAmount) > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      Your find will be boosted for 7 days and appear above non-boosted finds.
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Attachments (Optional)
                  </Label>
                  <FileUploader
                    onFilesSelected={handleFileUpload}
                    maxFiles={5}
                    acceptedTypes={['image/*', '.pdf', '.doc', '.docx']}
                    maxSize={10}
                  />

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">Selected Files:</Label>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Review Your Find</h3>

                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <p className="text-gray-900">{formData.title}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-900">{formData.category}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>
                      <p className="text-gray-900">₦{formData.minBudget} - ₦{formData.maxBudget}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Timeframe:</span>
                      <p className="text-gray-900">{formData.timeframe}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="text-gray-900">{formData.description}</p>
                    </div>

                    {formData.location && (
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-900">{formData.location}</p>
                      </div>
                    )}

                    {formData.requirements && (
                      <div>
                        <span className="font-medium text-gray-700">Requirements:</span>
                        <p className="text-gray-900">{formData.requirements}</p>
                      </div>
                    )}

                    {formData.boostAmount && parseInt(formData.boostAmount) > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Boost Amount:</span>
                        <p className="text-gray-900">{formData.boostAmount} Findertokens</p>
                      </div>
                    )}

                    {selectedFiles.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Attachments:</span>
                        <p className="text-gray-900">{selectedFiles.length} file(s) selected</p>
                      </div>
                    )}
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Once posted, your find will be visible to all finders. Make sure all information is accurate.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => navigate("/client/dashboard") : handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? "Cancel" : "Previous"}
              </Button>

              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(step)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createFindMutation.isPending}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  {createFindMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Post Find
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}