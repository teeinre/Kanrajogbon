import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertCircle, Shield, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface FinderVerificationStatusProps {
  className?: string;
}

export function FinderVerificationStatus({ className }: FinderVerificationStatusProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch finder profile data including verification status
  const { data: finder, isLoading, error } = useQuery<any>({
    queryKey: ['/api/finder/profile'],
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Fetch user data for identity verification status
  const { data: userData } = useQuery<any>({
    queryKey: ['/api/user/profile'],
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-finder-red"></div>
            <span className="text-gray-600">Loading verification status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-600">Unable to load verification status</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine verification status based on both finder and user data
  const isFinderVerified = finder?.isVerified || false;
  const identityStatus = userData?.identityVerificationStatus || 'not_verified';
  
  // Get the overall verification status
  const getVerificationStatus = () => {
    if (isFinderVerified && identityStatus === 'verified') {
      return {
        status: 'verified',
        label: 'Verified',
        description: 'Your finder profile is fully verified',
        icon: CheckCircle,
        badgeVariant: 'default' as const,
        badgeClass: 'bg-green-100 text-green-800 border-green-200',
        iconClass: 'text-green-600',
        showAction: false,
        actionText: '',
        actionVariant: 'default' as const
      };
    }
    
    if (identityStatus === 'pending') {
      return {
        status: 'pending',
        label: 'Verification Pending',
        description: 'Your verification documents are being reviewed',
        icon: Clock,
        badgeVariant: 'secondary' as const,
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconClass: 'text-yellow-600',
        showAction: false,
        actionText: '',
        actionVariant: 'default' as const
      };
    }
    
    if (identityStatus === 'rejected') {
      return {
        status: 'rejected',
        label: 'Verification Rejected',
        description: 'Your verification was rejected. Please resubmit your documents.',
        icon: XCircle,
        badgeVariant: 'destructive' as const,
        badgeClass: 'bg-red-100 text-red-800 border-red-200',
        iconClass: 'text-red-600',
        showAction: true,
        actionText: 'Resubmit Documents',
        actionVariant: 'destructive' as const
      };
    }
    
    // Default: not verified
    return {
      status: 'not_verified',
      label: 'Not Verified',
      description: 'Complete your verification to build trust with clients',
      icon: Shield,
      badgeVariant: 'outline' as const,
      badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
      iconClass: 'text-gray-600',
      showAction: true,
      actionText: 'Start Verification',
      actionVariant: 'default' as const
    };
  };

  const statusConfig = getVerificationStatus();
  const StatusIcon = statusConfig.icon;

  const handleVerificationAction = () => {
    if (statusConfig.status === 'not_verified' || statusConfig.status === 'rejected') {
      // Navigate to verification page
      window.location.href = '/finder/verification';
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <StatusIcon className={`h-8 w-8 ${statusConfig.iconClass}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
                <Badge 
                  variant={statusConfig.badgeVariant}
                  className={statusConfig.badgeClass}
                >
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{statusConfig.description}</p>
              
              {/* Additional info for verified status */}
              {statusConfig.status === 'verified' && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Clients can trust your verified profile</span>
                </div>
              )}
              
              {/* Show rejection reason if available */}
              {statusConfig.status === 'rejected' && userData?.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <strong>Reason:</strong> {userData.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action button */}
          {statusConfig.showAction && (
            <div className="flex-shrink-0">
              <Button
                variant={statusConfig.actionVariant}
                size="sm"
                onClick={handleVerificationAction}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{statusConfig.actionText}</span>
              </Button>
            </div>
          )}
        </div>
        
        {/* Progress indicator for pending status */}
        {statusConfig.status === 'pending' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span>Verification Progress</span>
                  <span>Under Review</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We typically review documents within 24-48 hours
            </p>
          </div>
        )}
        
        {/* Benefits of verification */}
        {statusConfig.status === 'not_verified' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits of Verification:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Increased client trust and confidence</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Higher proposal acceptance rates</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Access to premium job opportunities</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FinderVerificationStatus;