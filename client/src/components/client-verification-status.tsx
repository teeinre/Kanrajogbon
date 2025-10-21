import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import {
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Upload
} from "lucide-react";

interface ClientVerificationStatusProps {
  user?: {
    identityVerificationStatus: string;
    isVerified: boolean;
  };
  isAdminViewing?: boolean;
}

function ClientVerificationStatus({ user, isAdminViewing = false }: ClientVerificationStatusProps) {
  // Fetch detailed verification status from API
  const { data: verificationStatus, isLoading, error } = useQuery({
    queryKey: ['/api/verification/status'],
    enabled: !isAdminViewing && !!user, // Only fetch for self-viewing clients
  });

  // Log any API errors for debugging
  if (error) {
    console.error('Error fetching verification status:', error);
  }

  if (!user) {
    return null;
  }

  // Use the user's verification status directly for display
  const status = user.identityVerificationStatus || 'not_verified';
  const isVerified = user.isVerified || false;

  const getStatusConfig = (verificationStatus: string) => {
    switch (verificationStatus) {
      case 'verified':
        return {
          badge: <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>,
          title: "Identity Verified",
          description: "Your identity has been successfully verified. You have full access to all platform features.",
          color: "border-green-200 bg-green-50",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          showAction: false
        };
      case 'pending':
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>,
          title: "Verification Under Review",
          description: "Your documents are being reviewed by our team. This usually takes 24-48 hours.",
          color: "border-yellow-200 bg-yellow-50",
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          showAction: false
        };
      case 'rejected':
        return {
          badge: <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
          title: "Verification Rejected",
          description: "Your verification was rejected. Please review the feedback and resubmit your documents.",
          color: "border-red-200 bg-red-50",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          showAction: !isAdminViewing,
          actionText: "Resubmit Documents"
        };
      default: // 'not_verified'
        return {
          badge: <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200"><Shield className="w-3 h-3 mr-1" />Not Verified</Badge>,
          title: "Identity Verification Required",
          description: "Verify your identity to access all platform features and build trust with finders.",
          color: "border-blue-200 bg-blue-50",
          icon: <Shield className="w-5 h-5 text-blue-600" />,
          showAction: !isAdminViewing,
          actionText: "Start Verification"
        };
    }
  };

  const config = getStatusConfig(status);

  // Get rejection reason from detailed verification status if available
  let rejectionReason = null;
  try {
    if (verificationStatus?.verification) {
      rejectionReason = verificationStatus.verification.rejectionReason || null;
    }
  } catch (error) {
    console.error('Error accessing rejection reason:', error);
    rejectionReason = null;
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Verification status data:', verificationStatus);
    console.log('Rejection reason:', rejectionReason);
  }

  return (
    <Card className={`${config.color} border-l-4 transition-all duration-200 hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {config.icon}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-gray-900">{config.title}</h3>
                {config.badge}
              </div>
              <p className="text-sm text-gray-600">{config.description}</p>
              
              {/* Show rejection reason if available */}
              {status === 'rejected' && rejectionReason && rejectionReason !== null && rejectionReason !== undefined && rejectionReason !== '' && (
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Rejection Reason:</strong> {rejectionReason}
                  </AlertDescription>
                </Alert>
              )}

              {/* Show verification benefits for unverified users */}
              {status === 'not_verified' && !isAdminViewing && (
                <div className="mt-3 p-3 bg-blue-25 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium mb-1">Benefits of verification:</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Increased trust from finders</li>
                    <li>• Access to premium features</li>
                    <li>• Higher priority in search results</li>
                    <li>• Ability to post higher-value requests</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Action button */}
          {config.showAction && (
            <div className="ml-4">
              <Link href="/verification">
                <Button 
                  size="sm" 
                  className={`${
                    status === 'rejected' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {config.actionText}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Show loading state for detailed verification info */}
        {!isAdminViewing && isLoading && (
          <div className="mt-2 text-xs text-gray-500">
            Loading detailed verification status...
          </div>
        )}

        {/* Show error state if API call failed */}
        {!isAdminViewing && error && (
          <div className="mt-2 text-xs text-red-500">
            Unable to load detailed verification status. Please try refreshing the page.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ClientVerificationStatus };
export default ClientVerificationStatus;