import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import AdminHeader from "@/components/admin-header";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminIssueStrike from "@/components/admin-issue-strike";
import { 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Mail,
  Calendar,
  Crown,
  Star,
  Ban,
  User,
  Clock
} from "lucide-react";
import { Link, useRoute } from "wouter";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'finder' | 'client';
  isVerified: boolean;
  isBanned: boolean;
  bannedReason?: string;
  bannedAt?: string;
  createdAt?: string;
  profileImageUrl?: string;
  lastLoginAt?: string;
  strikeCount?: number;
}

export function AdminUserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [match, params] = useRoute("/admin/users/:id");
  const userId = params?.id;
  
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState("");

  const { data: userData, isLoading } = useQuery<User>({
    queryKey: [`/api/admin/users/${userId}`],
    enabled: !!user && user.role === 'admin' && !!userId
  });

  const verifyUserMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'verify' | 'unverify' }) => {
      return await apiRequest(`/api/admin/users/${userId}/${action}`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${userId}`] });
      toast({ title: "Success", description: "User verification updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update user verification", variant: "destructive" });
    }
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, action, reason }: { userId: string; action: 'ban' | 'unban'; reason?: string }) => {
      const url = `/api/admin/users/${userId}/${action}`;
      const options: any = { method: "POST" };
      
      if (action === 'ban' && reason) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify({ reason });
      }
      
      return await apiRequest(url, options);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${userId}`] });
      setBanDialogOpen(false);
      setBanReason("");
      
      const action = variables.action;
      const message = action === 'ban' ? "User banned successfully" : "User unbanned successfully";
      
      toast({ title: "Success", description: message });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update ban status", variant: "destructive" });
    }
  });

  const handleVerifyUser = (userId: string, shouldVerify: boolean) => {
    verifyUserMutation.mutate({ userId, action: shouldVerify ? 'verify' : 'unverify' });
  };

  const handleBanUser = (shouldBan: boolean) => {
    if (shouldBan) {
      setBanDialogOpen(true);
    } else {
      banUserMutation.mutate({ userId: userData!.id, action: 'unban' });
    }
  };

  const confirmBanUser = () => {
    if (!banReason.trim()) {
      toast({ 
        title: "Error", 
        description: "Please provide a reason for banning this user", 
        variant: "destructive" 
      });
      return;
    }
    banUserMutation.mutate({ userId: userData!.id, action: 'ban', reason: banReason.trim() });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-5 h-5" />;
      case 'finder': return <Star className="w-5 h-5" />;
      case 'client': return <Users className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'finder': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="users" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="users" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User not found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">The requested user could not be found.</p>
            <Link href="/admin/users">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10">
      <AdminHeader currentPage="users" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </Link>
        </div>

        {/* User Profile Header */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userData.profileImageUrl ? (
                    <img 
                      src={userData.profileImageUrl} 
                      alt={`${userData.firstName} ${userData.lastName}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`
                  )}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center ${
                  userData.isBanned ? 'bg-red-500' : userData.isVerified ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {userData.isBanned ? (
                    <XCircle className="w-4 h-4 text-white" />
                  ) : userData.isVerified ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {userData.firstName} {userData.lastName}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`px-3 py-1 rounded-full font-medium border ${getRoleColor(userData.role)}`}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(userData.role)}
                          <span>{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</span>
                        </div>
                      </Badge>
                      
                      {userData.isBanned && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 rounded-full">
                          <XCircle className="w-4 h-4 mr-1" />
                          Banned
                        </Badge>
                      )}
                      
                      {userData.isVerified && !userData.isBanned && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleVerifyUser(userData.id, !userData.isVerified)}
                      className={`${
                        userData.isVerified 
                          ? 'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20' 
                          : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {userData.isVerified ? 'Unverify' : 'Verify'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleBanUser(!userData.isBanned)}
                      className={`${
                        userData.isBanned 
                          ? 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20' 
                          : 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20'
                      }`}
                    >
                      {userData.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                    
                    {(userData.role === 'client' || userData.role === 'finder') && (
                      <AdminIssueStrike
                        userId={userData.id}
                        userRole={userData.role as 'client' | 'finder'}
                        userName={`${userData.firstName} ${userData.lastName}`}
                        trigger={
                          <Button
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Issue Strike
                          </Button>
                        }
                        onStrikeIssued={() => queryClient.invalidateQueries({ queryKey: [`/api/admin/users/${userId}`] })}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ban Information */}
        {userData.isBanned && userData.bannedReason && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-xl mb-6">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Ban Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Ban Reason:</p>
                  <p className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    {userData.bannedReason}
                  </p>
                </div>
                
                {userData.bannedAt && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <Clock className="w-4 h-4" />
                    <span>Banned on: {new Date(userData.bannedAt).toLocaleDateString()} at {new Date(userData.bannedAt).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Information */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            
            {userData.lastLoginAt && (
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">{new Date(userData.lastLoginAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Ban User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for banning (required)
              </label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter the reason for banning this user..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setBanDialogOpen(false);
                setBanReason("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBanUser}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Ban User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}