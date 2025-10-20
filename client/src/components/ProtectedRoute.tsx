import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'finder' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only check auth after loading is complete and we haven't redirected yet
    if (!isLoading && !hasRedirected) {
      // Check if we have a token first
      const hasToken = !!localStorage.getItem('findermeister_token');
      
      // Only redirect to login if we're certain there's no valid auth
      // (no token OR explicitly not authenticated)
      if (!hasToken) {
        setHasRedirected(true);
        navigate('/login');
        return;
      }

      // If we have a token but no user yet, wait for the auth query to complete
      if (!user && !isAuthenticated) {
        return;
      }

      // Check role-based access
      if (requiredRole && user && user.role !== requiredRole) {
        setHasRedirected(true);
        // Redirect to appropriate dashboard based on user role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'finder') {
          navigate('/finder/dashboard');
        } else if (user.role === 'client') {
          navigate('/client/dashboard');
        } else {
          navigate('/');
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, navigate, requiredRole, hasRedirected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

export function FinderRoute({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  // Don't redirect on payment success and thank you pages to allow payment verification
  const isPaymentRelatedPage = location.includes('/payment-success') || 
                              location.includes('/thank-you') ||
                              location.includes('/payment-callback');

  return (
    <ProtectedRoute requiredRole="finder">
      {children}
    </ProtectedRoute>
  );
}

export function ClientRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="client">
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

// Special route for support agents
export function AgentRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [agentVerified, setAgentVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    // Check if user has support agent access via API
    const checkAgentAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/agent/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setAgentVerified(true);
        } else {
          setAgentVerified(false);
          // Redirect based on user role
          if (user) {
            switch (user.role) {
              case 'admin':
                setLocation("/admin/dashboard");
                break;
              case 'finder':
                setLocation("/finder/dashboard");
                break;
              case 'client':
                setLocation("/client/dashboard");
                break;
              default:
                setLocation("/");
            }
          } else {
            setLocation("/");
          }
        }
      } catch (error) {
        console.error('Agent access check failed:', error);
        setAgentVerified(false);
        setLocation("/");
      }
    };

    checkAgentAccess();
  }, [isLoading, isAuthenticated, user, setLocation]);

  if (isLoading || agentVerified === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying agent access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !agentVerified) {
    return null;
  }

  return <>{children}</>;
}