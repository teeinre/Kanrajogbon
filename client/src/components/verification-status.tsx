
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

export default function VerificationStatusCard() {
  const { data: verificationStatus, isLoading } = useQuery<VerificationStatus>({
    queryKey: ['/api/verification/status']
  });

  if (isLoading || !verificationStatus?.isRequired) {
    return null;
  }

  const verification = verificationStatus.verification;

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'verified':
        return {
          badge: <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>,
          title: "Identity Verified",
          description: "Your identity has been successfully verified. You have full access to all platform features.",
          color: "border-green-200 bg-green-50",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          showAction: false
        };
      case 'pending':
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>,
          title: "Verification Under Review",
          description: "Your documents are being reviewed by our team. This usually takes 24-48 hours.",
          color: "border-yellow-200 bg-yellow-50",
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          showAction: false
        };
      case 'rejected':
        return {
          badge: <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
          title: "Verification Rejected",
          description: "Your verification was rejected. Please review the feedback and resubmit.",
          color: "border-red-200 bg-red-50",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          showAction: true,
          actionText: "Resubmit Documents"
        };
      default:
        return {
          badge: <Badge variant="secondary">Not Started</Badge>,
          title: "Identity Verification Required",
          description: "You must verify your identity to access all platform features.",
          color: "border-blue-200 bg-blue-50",
          icon: <Shield className="w-5 h-5 text-blue-600" />,
          showAction: true,
          actionText: "Start Verification"
        };
    }
  };

  const config = getStatusConfig(verification?.status);

  return (
    <Card className={`${config.color} border-l-4`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {config.icon}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-gray-900">{config.title}</h3>
                {config.badge}
              </div>
              <p className="text-sm text-gray-600">{config.description}</p>
              {verification?.rejectionReason && (
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Rejection Reason:</strong> {verification.rejectionReason}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          {config.showAction && (
            <Link href="/verification">
              <Button size="sm" className="ml-4">
                <Upload className="w-4 h-4 mr-1" />
                {config.actionText}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
