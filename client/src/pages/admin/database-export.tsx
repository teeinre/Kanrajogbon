
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AdminHeader from "@/components/admin-header";
import {
  Database,
  Download,
  FileText,
  Package,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDatabaseExport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'sql'>('json');

  // Export database mutation
  const exportMutation = useMutation({
    mutationFn: async (format: 'json' | 'csv' | 'sql') => {
      const response = await fetch(`/api/admin/export-database?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findermeister_token') || localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export database');
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `findermeister_export_${new Date().toISOString().split('T')[0]}.${format}`;

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { filename, size: blob.size };
    },
    onSuccess: (data) => {
      toast({
        title: "Export Successful",
        description: `Database exported as ${data.filename} (${(data.size / 1024).toFixed(2)} KB)`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export database",
        variant: "destructive",
      });
    }
  });

  const handleExport = () => {
    exportMutation.mutate(exportFormat);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminHeader currentPage="settings" />

      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
            <Database className="mr-3 h-8 w-8 text-blue-600" />
            Database Export
          </h1>
          <p className="text-slate-600">Export your complete database for backup or migration purposes</p>
        </div>

        {/* Export Options */}
        <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-slate-800 flex items-center text-xl">
              <Download className="w-6 h-6 mr-3 text-green-500" />
              Export Options
            </CardTitle>
            <CardDescription className="text-slate-600">
              Choose the format for your database export
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Export Format</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* JSON Format */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportFormat === 'json' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExportFormat('json')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">JSON</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete structured data export with metadata. Ideal for applications and data analysis.
                  </p>
                </div>

                {/* CSV Format */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportFormat === 'csv' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExportFormat('csv')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">CSV</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Individual CSV files for each table. Perfect for Excel, Google Sheets, or data imports.
                  </p>
                </div>

                {/* SQL Format */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportFormat === 'sql' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setExportFormat('sql')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">SQL</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete SQL dump with structure and data. Can be imported directly into PostgreSQL.
                  </p>
                </div>
              </div>
            </div>

            {/* Export Information */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The export will include all tables and data from your FinderMeister database. 
                This may take a few moments depending on the size of your data.
              </AlertDescription>
            </Alert>

            {/* Export Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleExport}
                disabled={exportMutation.isPending}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {exportMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Exporting {exportFormat.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Export as {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="mt-6 backdrop-blur-sm bg-white/80 border border-white/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  What's Included
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• All user accounts and profiles</li>
                  <li>• Service requests and proposals</li>
                  <li>• Contracts and transactions</li>
                  <li>• Messages and conversations</li>
                  <li>• Admin settings and configurations</li>
                  <li>• Categories and platform data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                  Important Notes
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Exports contain sensitive user data</li>
                  <li>• Store exported files securely</li>
                  <li>• Regular backups are recommended</li>
                  <li>• Large databases may take time to export</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
