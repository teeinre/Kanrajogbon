
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  Home,
  Send,
  MapPin,
  Globe,
  Headphones,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

const supportCategories = [
  { value: "account", label: "Account Issues" },
  { value: "billing", label: "Billing & Payments" },
  { value: "technical", label: "Technical Problems" },
  { value: "proposals", label: "Proposals & Contracts" },
  { value: "messaging", label: "Messaging Issues" },
  { value: "feature", label: "Feature Request" },
  { value: "other", label: "Other" }
];

const priorityLevels = [
  { value: "low", label: "Low - General question", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { value: "medium", label: "Medium - Account issue", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  { value: "high", label: "High - Can't access service", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { value: "urgent", label: "Urgent - Payment/security issue", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
];

export default function ContactSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.firstName + " " + user?.lastName || "",
    email: user?.email || "",
    category: "",
    priority: "",
    subject: "",
    message: ""
  });

  // Fetch contact settings
  const { data: contactSettings } = useQuery({
    queryKey: ['/api/contact-settings'],
  });

  const submitTicket = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to submit ticket");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: user?.firstName + " " + user?.lastName || "",
        email: user?.email || "",
        category: "",
        priority: "",
        subject: "",
        message: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit support ticket. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTicket.mutate(formData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedPriority = priorityLevels.find(p => p.value === formData.priority);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/support">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Back</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-finder-red rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Support</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-gray-300 text-xs sm:text-sm">
                  <Home className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
              {user && (
                <Link href={user.role === 'admin' ? '/admin/dashboard' : user.role === 'finder' ? '/finder/dashboard' : '/client/dashboard'}>
                  <Button size="sm" className="bg-finder-red hover:bg-finder-red/90 text-xs sm:text-sm">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-finder-red to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-4 sm:mb-6">
              <Headphones className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Get Help & Support</h2>
            <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto">
              Submit a support ticket and we'll get back to you as soon as possible
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Send className="w-5 h-5 mr-2 text-finder-red" />
                  Submit a Support Ticket
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Fill out the form below and our support team will assist you
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="mt-1.5 h-10 sm:h-11"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="mt-1.5 h-10 sm:h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                        <SelectTrigger className="mt-1.5 h-10 sm:h-11">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => updateFormData("priority", value)}>
                        <SelectTrigger className={`mt-1.5 h-10 sm:h-11 ${selectedPriority ? `${selectedPriority.bg} ${selectedPriority.border}` : ''}`}>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityLevels.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <span className={priority.color}>{priority.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => updateFormData("subject", e.target.value)}
                      placeholder="Brief description of your issue"
                      className="mt-1.5 h-10 sm:h-11"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => updateFormData("message", e.target.value)}
                      placeholder="Provide detailed information about your issue..."
                      rows={5}
                      className="mt-1.5 resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-finder-red hover:bg-finder-red/90 h-11 sm:h-12 text-sm sm:text-base font-medium"
                    disabled={submitTicket.isPending}
                  >
                    {submitTicket.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Support Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Contact Methods */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-finder-red" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">Email Support</p>
                    <p className="text-sm text-gray-600 break-all">{contactSettings?.supportEmail || "findermeisterinnovations@gmail.com"}</p>
                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                  <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">Phone Support</p>
                    <p className="text-sm text-gray-600">{contactSettings?.supportPhone || "+234-7039391065"}</p>
                    <p className="text-xs text-gray-500 mt-1">{contactSettings?.businessHours || "Mon-Fri, 9 AM - 6 PM WAT"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">Office Address</p>
                    <p className="text-sm text-gray-600">{contactSettings?.officeAddress || "18 Back of Road safety office, Moniya, Ibadan"}</p>
                  </div>
                </div>

                {contactSettings?.whatsappNumber && (
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
                    <MessageSquare className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">WhatsApp</p>
                      <p className="text-sm text-gray-600">{contactSettings.whatsappNumber}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-finder-red" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Low Priority</span>
                  </div>
                  <span className="text-sm text-gray-600">{contactSettings?.responseTimeLow || "2-3 business days"}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Medium Priority</span>
                  </div>
                  <span className="text-sm text-gray-600">{contactSettings?.responseTimeMedium || "1-2 business days"}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">High Priority</span>
                  </div>
                  <span className="text-sm text-gray-600">{contactSettings?.responseTimeHigh || "4-8 hours"}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Urgent Priority</span>
                  </div>
                  <span className="text-sm text-gray-600">{contactSettings?.responseTimeUrgent || "1-2 hours"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            {contactSettings && (contactSettings.facebookUrl || contactSettings.twitterUrl || contactSettings.instagramUrl || contactSettings.linkedinUrl || contactSettings.tiktokUrl) && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Globe className="w-5 h-5 mr-2 text-finder-red" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-3">
                    {contactSettings.facebookUrl && (
                      <a 
                        href={contactSettings.facebookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                        title="Follow us on Facebook"
                      >
                        <Facebook className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {contactSettings.twitterUrl && (
                      <a 
                        href={contactSettings.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors group"
                        title="Follow us on Twitter/X"
                      >
                        <Twitter className="w-6 h-6 text-sky-600 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {contactSettings.instagramUrl && (
                      <a 
                        href={contactSettings.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors group"
                        title="Follow us on Instagram"
                      >
                        <Instagram className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {contactSettings.linkedinUrl && (
                      <a 
                        href={contactSettings.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                        title="Follow us on LinkedIn"
                      >
                        <Linkedin className="w-6 h-6 text-blue-700 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {contactSettings.tiktokUrl && (
                      <a 
                        href={contactSettings.tiktokUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Follow us on TikTok"
                      >
                        <MessageCircle className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Status */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="w-5 h-5 mr-2 text-finder-red" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50/50">
                    <span className="text-sm font-medium text-gray-900">Platform Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50/50">
                    <span className="text-sm font-medium text-gray-900">Payment System</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-green-50/50">
                    <span className="text-sm font-medium text-gray-900">Messaging System</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
