import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin-header";
import { 
  Shield, 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Settings,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function AdminCategories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDesc, setEditCategoryDesc] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/admin/categories'],
    enabled: !!user && user.role === 'admin'
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await apiRequest('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setNewCategoryName("");
      setNewCategoryDesc("");
      toast({
        title: "Success",
        description: "Category created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive"
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; description: string }) => {
      return await apiRequest(`/api/admin/categories/${data.id}`, { 
        method: 'PUT', 
        body: JSON.stringify({ name: data.name, description: data.description }) 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      setEditingCategory(null);
      setEditCategoryName("");
      setEditCategoryDesc("");
      toast({
        title: "Success",
        description: "Category updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive"
      });
    }
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: async (data: { id: string; isActive: boolean }) => {
      return await apiRequest(`/api/admin/categories/${data.id}`, { 
        method: 'PUT', 
        body: JSON.stringify({ isActive: data.isActive }) 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      toast({
        title: "Success",
        description: "Category status updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category status",
        variant: "destructive"
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/categories/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive"
      });
    }
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    createCategoryMutation.mutate({
      name: newCategoryName,
      description: newCategoryDesc
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryDesc(category.description || "");
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;
    
    updateCategoryMutation.mutate({
      id: editingCategory.id,
      name: editCategoryName,
      description: editCategoryDesc
    });
  };

  const handleToggleCategory = (category: Category) => {
    toggleCategoryMutation.mutate({
      id: category.id,
      isActive: !category.isActive
    });
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminHeader currentPage="categories" />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 safe-area-t safe-area-b">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-2 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-64 sm:w-96 mb-4 sm:mb-8"></div>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 mb-1 sm:mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-64"></div>
                    </div>
                    <div className="h-6 sm:h-8 w-6 sm:w-8 bg-gray-200 rounded flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminHeader currentPage="categories" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 safe-area-t safe-area-b">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <Settings className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <span className="break-words">Category Management</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">Create and manage find categories for the platform</p>
        </div>

        {/* Create New Category */}
        <Card className="mb-6 sm:mb-8 backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center text-lg sm:text-xl">
              <Plus className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              Add New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="categoryName" className="text-xs sm:text-sm font-medium">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Web Development"
                    className="bg-white/80 w-full text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="categoryDesc" className="text-xs sm:text-sm font-medium">Description</Label>
                  <textarea
                    id="categoryDesc"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="Brief description of the category"
                    className="bg-white/80 w-full text-sm sm:text-base border border-slate-300 rounded-md p-2"
                    rows={2}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={createCategoryMutation.isPending}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                {createCategoryMutation.isPending ? "Creating..." : "Add Category"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 text-lg sm:text-xl">Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-slate-500">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300" />
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">No categories yet</h3>
                <p className="text-sm sm:text-base">Create your first category to get started.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {categories.map((category: Category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6 hover:shadow-md transition-shadow duration-200 transition-responsive"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-2 sm:mb-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {category.name}
                          </h3>
                          <Badge variant={category.isActive ? "default" : "secondary"} className="self-start sm:self-auto">
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center touch-target">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 touch-target focus-visible-enhanced"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleEditCategory(category)}
                            className="text-sm touch-target"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleCategory(category)}
                            className="text-sm touch-target"
                          >
                            {category.isActive ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteCategoryMutation.mutate(category.id)}
                            className="text-red-600 text-sm touch-target"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <Card className="w-full max-w-sm sm:max-w-md bg-white mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg lg:text-xl">Edit Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateCategory} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="editCategoryName" className="text-xs sm:text-sm font-medium">Category Name</Label>
                    <Input
                      id="editCategoryName"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="editCategoryDesc" className="text-xs sm:text-sm font-medium">Description</Label>
                    <textarea
                      id="editCategoryDesc"
                      value={editCategoryDesc}
                      onChange={(e) => setEditCategoryDesc(e.target.value)}
                      placeholder="Category description"
                      className="w-full text-sm sm:text-base border border-slate-300 rounded-md p-2"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-3 sm:pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setEditingCategory(null)}
                      className="w-full sm:w-auto touch-target focus-visible-enhanced"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateCategoryMutation.isPending}
                      className="w-full sm:w-auto touch-target focus-visible-enhanced"
                    >
                      {updateCategoryMutation.isPending ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}