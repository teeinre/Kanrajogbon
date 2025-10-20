import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminHeader from "@/components/admin-header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Gift, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function MonthlyTokenGrantAdmin() {
  const { user, getToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch monthly token grant status
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/admin/monthly-token-grant/status'],
    enabled: !!user && user.role === 'admin'
  });

  // Mutation for manual token grant
  const grantTokensMutation = useMutation({
    mutationFn: async () => {
      let token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/admin/monthly-token-grant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // Retry with new token
          token = getToken();
          const retryResponse = await fetch('/api/admin/monthly-token-grant', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!retryResponse.ok) {
            const error = await retryResponse.json();
            throw new Error(error.message || 'Failed to grant tokens after refresh');
          }
          return retryResponse.json();
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to grant tokens');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/monthly-token-grant/status'] });
      toast({
        title: "Success",
        description: "Monthly tokens granted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to grant monthly tokens",
        variant: "destructive",
      });
    }
  });

  const handleGrantTokens = () => {
    if (window.confirm('Are you sure you want to grant monthly tokens to all active finders? This action cannot be undone.')) {
      grantTokensMutation.mutate();
    }
  };

  const isFirstDayOfMonth = new Date().getDate() === 1;
  const hasGrantedThisMonth = statusData?.hasGrantedThisMonth || false;

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader currentPage="monthly-tokens" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading monthly token status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="monthly-tokens" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Monthly Token Grant</h1>
          <p className="text-gray-600 mt-2">Manage automatic monthly token distribution to finders</p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {hasGrantedThisMonth ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                  <div>
                    <p className="font-medium">Monthly Token Grant Status</p>
                    <p className="text-sm text-gray-600">
                      {hasGrantedThisMonth ? 'Tokens have been granted this month' : 'Tokens not yet granted this month'}
                    </p>
                  </div>
                </div>
                <Badge variant={hasGrantedThisMonth ? "default" : "secondary"}>
                  {hasGrantedThisMonth ? "Granted" : "Pending"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Current Date</p>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant={isFirstDayOfMonth ? "default" : "outline"}>
                  {isFirstDayOfMonth ? "1st Day" : "Not 1st Day"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Grant Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>Token Grant Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This system automatically grants tokens to all active finders based on their level on the 1st day of each month.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Monthly Token Amounts by Level</h3>
                  <ul className="space-y-1 text-sm">
                    <li><strong>GrandMeister:</strong> 50 tokens</li>
                    <li><strong>Meister:</strong> 30 tokens</li>
                    <li><strong>Seeker:</strong> 20 tokens</li>
                    <li><strong>Pathfinder:</strong> 20 tokens</li>
                    <li><strong>Novice:</strong> 20 tokens</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Automatic Schedule</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Runs on 1st day of month</li>
                    <li>• Grants to active finders only</li>
                    <li>• Tokens expire after 1 year</li>
                    <li>• Prevents duplicate grants</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Grant Button */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>Manual Token Grant</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Use this button to manually trigger the monthly token grant. This is useful for testing or if the automatic grant failed.
              </p>

              {hasGrantedThisMonth && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Monthly tokens have already been granted this month. Granting again will create duplicate tokens.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleGrantTokens}
                disabled={grantTokensMutation.isPending || hasGrantedThisMonth}
                className="w-full md:w-auto"
                size="lg"
              >
                {grantTokensMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Granting Tokens...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Grant Monthly Tokens
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}