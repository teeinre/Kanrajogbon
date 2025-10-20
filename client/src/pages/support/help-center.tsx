import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  User,
  FileText,
  CreditCard,
  Shield,
  MessageSquare,
  ChevronRight,
  HelpCircle,
  Phone,
  Mail,
  Clock,
  Home,
  DollarSign,
  ReceiptText,
  Users,
  Lock,
  Award,
  Activity,
  CloudUpload,
  Calendar,
  Cog,
  Wifi,
  Laptop,
  Scan
} from "lucide-react";
import type { FAQ } from "@shared/schema";

// Mapping of icon names to Lucide React components
const iconMap: { [key: string]: React.ElementType } = {
  User,
  CreditCard,
  MessageSquare,
  FileText,
  Shield,
  HelpCircle,
  Home,
  DollarSign,
  ReceiptText,
  Users,
  Lock,
  Award,
  Activity,
  CloudUpload,
  Calendar,
  Cog,
  Wifi,
  Laptop,
  Scan
};

// Define the expected type for categories
interface Category {
  id: string;
  name: string;
  icon: string; // Name of the icon from iconMap
  color: string;
  description?: string;
}

// Placeholder for categories, to be replaced by fetched data
// const categories = [
//   { name: "Getting Started", icon: User, color: "bg-blue-100 text-blue-800" },
//   { name: "Tokens & Payments", icon: CreditCard, color: "bg-green-100 text-green-800" },
//   { name: "Communication", icon: MessageSquare, color: "bg-purple-100 text-purple-800" },
//   { name: "Work Completion", icon: FileText, color: "bg-orange-100 text-orange-800" },
//   { name: "Account Management", icon: Shield, color: "bg-gray-100 text-gray-800" },
//   { name: "Gamification", icon: HelpCircle, color: "bg-indigo-100 text-indigo-800" }
// ];

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const { data: faqs = [], isLoading: isLoadingFaqs } = useQuery<FAQ[]>({
    queryKey: ['/api/public/faqs'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories from the API
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/public/categories'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredFAQs = faqs.filter(faq => {
    // Only show active FAQs to public
    if (!faq.isActive) return false;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pre-calculate category counts for display
  const categoryFaqCounts = categories.reduce((acc, category) => {
    acc[category.name] = faqs.filter(faq => faq.category === category.name && faq.isActive).length;
    return acc;
  }, {} as Record<string, number>);


  if (isLoadingFaqs || isLoadingCategories) {
    return <div className="min-h-screen flex items-center justify-center">Loading Help Center...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions and get support for using FinderMeister
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, FAQs, or guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {categories.map((category) => {
                  const Icon = iconMap[category.icon as keyof typeof iconMap] || HelpCircle;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-gray-600">support@findermeister.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Overview */}
            {!selectedCategory && !searchTerm && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {categories.map((category: any) => {
                    const IconComponent = iconMap[category.icon as keyof typeof iconMap] || HelpCircle;
                    const categoryFAQs = faqs.filter(faq => faq.category === category.name && faq.isActive);

                    return (
                      <Card
                        key={category.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${category.color}`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">
                                {categoryFaqCounts[category.name] || 0} question{categoryFaqCounts[category.name] !== 1 ? 's' : ''}
                              </p>
                              {category.description && (
                                <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FAQ Results */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} FAQs` : 'Frequently Asked Questions'}
                </h2>
                {selectedCategory && (
                  <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                    Show All Categories
                  </Button>
                )}
              </div>

              {filteredFAQs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or browse by category.
                    </p>
                    <Button onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}>
                      Reset Search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => {
                    const category = categories.find(c => c.name === faq.category);
                    return (
                      <Card key={faq.id}>
                        <CardHeader
                          className="cursor-pointer"
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-900 mb-2">
                                {faq.question}
                              </CardTitle>
                              <div className="flex items-center space-x-2">
                                {category && (
                                  <Badge className={category.color}>
                                    {faq.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedFAQ === faq.id ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </CardHeader>
                        {expandedFAQ === faq.id && (
                          <CardContent>
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}