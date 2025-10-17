import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminHeader from "@/components/admin-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus,
  Edit,
  Trash2,
  Tag,
  Save
} from "lucide-react";

type FAQCategory = {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const iconOptions = [
  { value: "HelpCircle", label: "Help Circle" },
  { value: "User", label: "User" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "MessageSquare", label: "Message" },
  { value: "FileText", label: "File" },
  { value: "Shield", label: "Shield" },
  { value: "Settings", label: "Settings" },
  { value: "Star", label: "Star" }
];

const colorOptions = [
  { value: "bg-blue-100 text-blue-800", label: "Blue" },
  { value: "bg-green-100 text-green-800", label: "Green" },
  { value: "bg-purple-100 text-purple-800", label: "Purple" },
  { value: "bg-orange-100 text-orange-800", label: "Orange" },
  { value: "bg-gray-100 text-gray-800", label: "Gray" },
  { value: "bg-red-100 text-red-800", label: "Red" }
];

export default function AdminFAQCategories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);

  // Form state for creating/editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "HelpCircle",
    color: "bg-blue-100 text-blue-800",
    sortOrder: 0,
    isActive: true
  });

  const { data: categories = [], isLoading, error } = useQuery<FAQCategory[]>({
    queryKey: ['/api/admin/faq-categories'],
    enabled: !!user && user.role === 'admin'
  });

  const createMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      return apiRequest('/api/admin/faq-categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] });
      toast({ title: "FAQ category created successfully" });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error creating FAQ category", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: any) => {
      return apiRequest(`/api/admin/faq-categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] });
      toast({ title: "FAQ category updated successfully" });
      setIsEditModalOpen(false);
      setEditingCategory(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error updating FAQ category", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/faq-categories/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] });
      toast({ title: "FAQ category deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting FAQ category", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "HelpCircle",
      color: "bg-blue-100 text-blue-800",
      sortOrder: 0,
      isActive: true
    });
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
    resetForm();
  };

  const handleEdit = (category: FAQCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon,
      color: category.color,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        ...formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="faq-categories" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading FAQ categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <AdminHeader currentPage="faq-categories" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600 mb-4">Error loading FAQ categories</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/faq-categories'] })}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <AdminHeader currentPage="faq-categories" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Tag className="mr-3 h-8 w-8 text-blue-600" />
                FAQ Categories
              </h1>
              <p className="text-gray-600">Manage categories for organizing FAQs</p>
            </div>
            <Button 
              onClick={handleCreate}
              data-testid="button-create-category"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first FAQ category.</p>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Category
                </Button>
              </CardContent>
            </Card>
          ) : (
            categories.map((category) => (
              <Card key={category.id} data-testid={`card-category-${category.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg" data-testid={`text-category-name-${category.id}`}>
                          {category.name}
                        </CardTitle>
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                        {!category.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Icon: {category.icon}</span>
                        <span>Sort Order: {category.sortOrder}</span>
                        <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(category)}
                        data-testid={`button-edit-${category.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-${category.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setEditingCategory(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit FAQ Category" : "Create New FAQ Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                  data-testid="input-category-name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  rows={3}
                  data-testid="input-category-description"
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger data-testid="select-category-icon">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>{icon.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color Theme</Label>
                <Select 
                  value={formData.color} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger data-testid="select-category-color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  data-testid="input-category-sort-order"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  data-testid="switch-category-active"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-category"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}