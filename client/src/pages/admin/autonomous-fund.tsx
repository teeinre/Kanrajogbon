import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminHeader from "@/components/admin-header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Clock, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Coins,
  Play,
  Info
} from "lucide-react";

interface AutonomousFundConfig {
  holdingPeriodHours: number;
  autoCreditEnabled: boolean;
  minimumRating: number;
  minimumJobsCompleted: number;
}

export default function AutonomousFundAdmin() {
  const { user, getToken, refreshAuthToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current configuration
  const { data: config, isLoading: configLoading } = useQuery<AutonomousFundConfig>({
    queryKey: ['/api/admin/autonomous-fund/config'],
    enabled: !!user && user.role === 'admin'
  });

  // State for form inputs
  const [formData, setFormData] = useState<AutonomousFundConfig>({
    holdingPeriodHours: 24,
    autoCreditEnabled: true,
    minimumRating: 4.0,
    minimumJobsCompleted: 1
  });

  // Update form data when config loads
  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  // Mutation for updating configuration
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: Partial<AutonomousFundConfig>) => {
      let token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/admin/autonomous-fund/config', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newConfig)
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // Retry with new token
          token = getToken();
          const retryResponse = await fetch('/api/admin/autonomous-fund/config', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConfig)
          });
          
          if (!retryResponse.ok) {
            const error = await retryResponse.json();
            throw new Error(error.message || 'Failed to update configuration after refresh');
          }
          return retryResponse.json();
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update configuration');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/autonomous-fund/config'] });
      toast({
        title: "Success",
        description: "Configuration updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    }
  });

  // Mutation for manual processing
  const processMutation = useMutation({
    mutationFn: async () => {
      let token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('/api/admin/autonomous-fund/process', {
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
          const retryResponse = await fetch('/api/admin/autonomous-fund/process', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!retryResponse.ok) {
            const error = await retryResponse.json();
            throw new Error(error.message || 'Failed to process autonomous fund after refresh');
          }
          return retryResponse.json();
        } else {
          throw new Error('Authentication failed. Please log in again.');
        }
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process funds');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Autonomous fund processing initiated!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process funds",
        variant: "destructive",
      });
    }
  });

  const handleConfigUpdate = () => {
    updateConfigMutation.mutate(formData);
  };

  const handleProcessNow = () => {
    if (window.confirm('Are you sure you want to manually process autonomous fund crediting?')) {
      processMutation.mutate();
    }
  };

  if (configLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader currentPage="autonomous-fund" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="autonomous-fund" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Autonomous Fund Service</h1>
          <p className="text-gray-600 mt-2">Configure automatic fund crediting and level management</p>
        </div>

        {/* Status Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Service Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${config?.autoCreditEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-medium">Auto-Credit</p>
                  <p className="text-sm text-gray-600">
                    {config?.autoCreditEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Holding Period</p>
                  <p className="text-sm text-gray-600">
                    {config?.holdingPeriodHours} hours
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Minimum Rating</p>
                  <p className="text-sm text-gray-600">
                    {config?.minimumRating}/5.0
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configuration Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This system automatically credits funds to finders after the holding period and updates their levels based on performance metrics.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="holdingPeriod">Holding Period (Hours)</Label>
                  <Input
                    id="holdingPeriod"
                    type="number"
                    min="1"
                    max="168"
                    value={formData.holdingPeriodHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, holdingPeriodHours: parseInt(e.target.value) || 24 }))}
                  />
                  <p className="text-sm text-gray-600">
                    Hours to hold funds before automatic crediting
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumRating">Minimum Rating</Label>
                  <Input
                    id="minimumRating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.minimumRating}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumRating: parseFloat(e.target.value) || 4.0 }))}
                  />
                  <p className="text-sm text-gray-600">
                    Minimum rating required for level advancement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumJobs">Minimum Jobs Completed</Label>
                  <Input
                    id="minimumJobs"
                    type="number"
                    min="0"
                    value={formData.minimumJobsCompleted}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumJobsCompleted: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="text-sm text-gray-600">
                    Minimum jobs required for level advancement
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autoCredit">Enable Auto-Credit</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoCredit"
                      checked={formData.autoCreditEnabled}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoCreditEnabled: checked }))}
                    />
                    <span className="text-sm text-gray-600">
                      {formData.autoCreditEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Automatically credit funds after holding period
                  </p>
                </div>
              </div>

              <Button
                onClick={handleConfigUpdate}
                disabled={updateConfigMutation.isPending}
                className="w-full md:w-auto"
              >
                {updateConfigMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Update Configuration
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Manual Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Manual Processing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Manually trigger autonomous fund processing. This will check all completed contracts and credit eligible funds.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">How it works:</h4>
                    <ul className="text-sm text-blue-800 mt-1 space-y-1">
                      <li>• Checks contracts completed within holding period</li>
                      <li>• Credits funds to finder available balance</li>
                      <li>• Updates finder level based on performance</li>
                      <li>• Runs automatically every hour when enabled</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleProcessNow}
                disabled={processMutation.isPending || !formData.autoCreditEnabled}
                variant="outline"
                className="w-full md:w-auto"
              >
                {processMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 mr-2" />
                    Process Now
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