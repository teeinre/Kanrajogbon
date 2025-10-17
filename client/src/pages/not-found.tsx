import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AdminHeader from "@/components/admin-header";
import ClientHeader from "@/components/client-header";
import { FinderHeader } from "@/components/finder-header";

export default function NotFound() {
  const { user } = useAuth();

  const renderHeader = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'admin':
        return <AdminHeader />;
      case 'client':
        return <ClientHeader />;
      case 'finder':
        return <FinderHeader />;
      default:
        return null;
    }
  };

  const getHomeRoute = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case 'admin':
        return "/admin/dashboard";
      case 'client':
        return "/client/dashboard";
      case 'finder':
        return "/finder/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-finder-red" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
            
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <Link href={getHomeRoute()}>
              <Button className="bg-finder-red hover:bg-finder-red-dark">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
