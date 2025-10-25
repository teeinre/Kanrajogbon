import { useAuth } from "@/hooks/use-auth";
import { AlertCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BanAlert() {
  const { user } = useAuth();

  // Only show alert if user is banned
  if (!user?.isBanned) {
    return null;
  }

  const supportEmail = "support@findermeister.com";
  const supportPhone = "+1-800-FINDER";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Alert className="border-red-500 bg-red-50 shadow-2xl">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-red-800 text-2xl font-bold mb-4">
                Account Suspended
              </AlertTitle>
              <AlertDescription className="text-red-700 space-y-4">
                <p className="text-lg font-semibold">
                  You are currently banned from Findermeister. Please contact customer support for assistance.
                </p>
                
                {user.bannedReason && (
                  <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                    <p className="font-semibold text-red-800 mb-2">Reason for suspension:</p>
                    <p className="text-red-700">{user.bannedReason}</p>
                  </div>
                )}

                {user.bannedAt && (
                  <div className="bg-red-100 p-3 rounded-lg border border-red-300">
                    <p className="text-sm text-red-600">
                      <span className="font-semibold">Suspended on:</span> {new Date(user.bannedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <p className="text-red-800 font-semibold text-lg">Contact Support:</p>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-700 border-red-300 hover:bg-red-100"
                      onClick={() => window.location.href = `mailto:${supportEmail}?subject=Account Suspension Appeal`}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email: {supportEmail}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-700 border-red-300 hover:bg-red-100"
                      onClick={() => window.location.href = `tel:${supportPhone}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Phone: {supportPhone}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-red-300">
                  <p className="text-red-600 text-sm">
                    <strong>Important:</strong> This suspension will remain in effect until resolved by customer support. 
                    Please provide detailed information about your situation when contacting support for faster resolution.
                  </p>
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
}