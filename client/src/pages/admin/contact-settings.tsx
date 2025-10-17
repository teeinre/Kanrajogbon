
import React, { useState, useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminHeader from "@/components/admin-header";
import type { ContactSettings } from "@shared/schema";
import { 
  Save,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Linkedin,
  Settings
} from "lucide-react";

export default function AdminContactSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: settings, isLoading } = useQuery<ContactSettings>({
    queryKey: ['/api/admin/contact-settings'],
  });

  const [formData, setFormData] = useState({
    supportEmail: "",
    supportPhone: "",
    officeAddress: "",
    businessHours: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    linkedinUrl: "",
    whatsappNumber: "",
    responseTimeLow: "",
    responseTimeMedium: "",
    responseTimeHigh: "",
    responseTimeUrgent: ""
  });

  // Update form data when settings are loaded
  React.useEffect(() => {
    if (settings) {
      startTransition(() => {
        setFormData({
          supportEmail: settings.supportEmail || "",
          supportPhone: settings.supportPhone || "",
          officeAddress: settings.officeAddress || "",
          businessHours: settings.businessHours || "",
          facebookUrl: settings.facebookUrl || "",
          twitterUrl: settings.twitterUrl || "",
          instagramUrl: settings.instagramUrl || "",
          tiktokUrl: settings.tiktokUrl || "",
          linkedinUrl: settings.linkedinUrl || "",
          whatsappNumber: settings.whatsappNumber || "",
          responseTimeLow: settings.responseTimeLow || "",
          responseTimeMedium: settings.responseTimeMedium || "",
          responseTimeHigh: settings.responseTimeHigh || "",
          responseTimeUrgent: settings.responseTimeUrgent || ""
        });
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('/api/admin/contact-settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-settings'] });
      toast({ title: "Contact settings updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating contact settings", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      updateMutation.mutate(formData);
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="contact-settings" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading contact settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <AdminHeader currentPage="contact-settings" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Settings className="mr-3 h-8 w-8 text-blue-600" />
            Contact Settings
          </h1>
          <p className="text-gray-600">Manage contact information displayed throughout the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={formData.supportPhone}
                  onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="businessHours">Business Hours</Label>
                <Input
                  id="businessHours"
                  value={formData.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="officeAddress">Office Address</Label>
                <Textarea
                  id="officeAddress"
                  value={formData.officeAddress}
                  onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Facebook className="w-5 h-5 mr-2" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="facebookUrl" className="flex items-center">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook URL
                </Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="twitterUrl" className="flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter/X URL
                </Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="instagramUrl" className="flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram URL
                </Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tiktokUrl" className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  TikTok URL
                </Label>
                <Input
                  id="tiktokUrl"
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="linkedinUrl" className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Support Response Times
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="responseTimeLow">Low Priority</Label>
                <Input
                  id="responseTimeLow"
                  value={formData.responseTimeLow}
                  onChange={(e) => handleInputChange('responseTimeLow', e.target.value)}
                  placeholder="e.g., 2-3 business days"
                />
              </div>

              <div>
                <Label htmlFor="responseTimeMedium">Medium Priority</Label>
                <Input
                  id="responseTimeMedium"
                  value={formData.responseTimeMedium}
                  onChange={(e) => handleInputChange('responseTimeMedium', e.target.value)}
                  placeholder="e.g., 1-2 business days"
                />
              </div>

              <div>
                <Label htmlFor="responseTimeHigh">High Priority</Label>
                <Input
                  id="responseTimeHigh"
                  value={formData.responseTimeHigh}
                  onChange={(e) => handleInputChange('responseTimeHigh', e.target.value)}
                  placeholder="e.g., 4-8 hours"
                />
              </div>

              <div>
                <Label htmlFor="responseTimeUrgent">Urgent Priority</Label>
                <Input
                  id="responseTimeUrgent"
                  value={formData.responseTimeUrgent}
                  onChange={(e) => handleInputChange('responseTimeUrgent', e.target.value)}
                  placeholder="e.g., 1-2 hours"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 px-8"
              disabled={updateMutation.isPending || isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
