import { useState } from "react";
import { BanAlert } from "@/components/BanAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Test component to demonstrate ban alert functionality
export function BanAlertDemo() {
  const [showBanned, setShowBanned] = useState(false);

  // Mock user data for testing
  const mockBannedUser = {
    id: 123,
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "client",
    isBanned: true,
    bannedReason: "Violation of community guidelines - inappropriate behavior",
    bannedAt: new Date().toISOString()
  };

  const mockNormalUser = {
    id: 123,
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "client",
    isBanned: false
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Ban Alert System Demo</CardTitle>
            <CardDescription>
              Test the ban alert functionality by toggling between banned and normal user states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowBanned(false)}
                  variant={!showBanned ? "default" : "outline"}
                >
                  Normal User
                </Button>
                <Button
                  onClick={() => setShowBanned(true)}
                  variant={showBanned ? "destructive" : "outline"}
                >
                  Banned User
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <strong>Current State:</strong> {showBanned ? "User is BANNED" : "User is Normal"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulate the ban alert */}
        {showBanned && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="border-red-500 bg-red-50 shadow-2xl rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 text-red-600">⚠️</div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-red-800 text-2xl font-bold mb-4">
                      Account Suspended
                    </h2>
                    <div className="text-red-700 space-y-4">
                      <p className="text-lg font-semibold">
                        You are currently banned from Findermeister. Please contact customer support for assistance.
                      </p>
                      
                      {mockBannedUser.bannedReason && (
                        <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                          <p className="font-semibold text-red-800 mb-2">Reason for suspension:</p>
                          <p className="text-red-700">{mockBannedUser.bannedReason}</p>
                        </div>
                      )}

                      {mockBannedUser.bannedAt && (
                        <div className="bg-red-100 p-3 rounded-lg border border-red-300">
                          <p className="text-sm text-red-600">
                            <span className="font-semibold">Suspended on:</span> {new Date(mockBannedUser.bannedAt).toLocaleDateString('en-US', { 
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
                          <button
                            className="w-full justify-start text-red-700 border border-red-300 hover:bg-red-100 px-4 py-2 rounded-md flex items-center"
                            onClick={() => window.location.href = `mailto:support@findermeister.com?subject=Account Suspension Appeal`}
                          >
                            📧 Email: support@findermeister.com
                          </button>
                          
                          <button
                            className="w-full justify-start text-red-700 border border-red-300 hover:bg-red-100 px-4 py-2 rounded-md flex items-center"
                            onClick={() => window.location.href = `tel:+1-800-FINDER`}
                          >
                            📞 Phone: +1-800-FINDER
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-red-300">
                        <p className="text-red-600 text-sm">
                          <strong>Important:</strong> This suspension will remain in effect until resolved by customer support. 
                          Please provide detailed information about your situation when contacting support for faster resolution.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo content that would be blurred/blocked for banned users */}
        <div className={showBanned ? "pointer-events-none select-none filter blur-sm opacity-30" : ""}>
          <Card>
            <CardHeader>
              <CardTitle>Application Content</CardTitle>
              <CardDescription>
                This content would be inaccessible to banned users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>This represents the normal application content that users would interact with.</p>
                <Button>Normal Button</Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border">
                    <h3 className="font-semibold">Feature 1</h3>
                    <p className="text-sm text-gray-600">Some application feature</p>
                  </div>
                  <div className="p-4 bg-white rounded border">
                    <h3 className="font-semibold">Feature 2</h3>
                    <p className="text-sm text-gray-600">Another application feature</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}