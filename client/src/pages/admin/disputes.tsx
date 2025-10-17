import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminHeader from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, User, FileText } from "lucide-react";

interface Dispute {
  id: string;
  userId: string;
  contractId: string | null;
  findId: string | null;
  strikeId: string | null;
  type: string;
  description: string;
  status: string;
  submittedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  contract?: {
    id: string;
    amount: string;
    escrowStatus: string;
    isCompleted: boolean;
  } | null;
}

export default function AdminDisputes() {
  const { data: disputes, isLoading } = useQuery<Dispute[]>({
    queryKey: ["/api/admin/disputes"],
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      investigating: { label: "Investigating", className: "bg-blue-100 text-blue-800" },
      resolved: { label: "Resolved", className: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      payment_issue: { label: "Payment Issue", className: "bg-red-100 text-red-800" },
      quality_issue: { label: "Quality Issue", className: "bg-orange-100 text-orange-800" },
      communication_issue: { label: "Communication", className: "bg-purple-100 text-purple-800" },
      scope_dispute: { label: "Scope Dispute", className: "bg-blue-100 text-blue-800" },
      timeline_issue: { label: "Timeline Issue", className: "bg-indigo-100 text-indigo-800" },
      contract_dispute: { label: "Contract Dispute", className: "bg-pink-100 text-pink-800" },
      other: { label: "Other", className: "bg-gray-100 text-gray-800" },
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto mb-4"></div>
              <p className="text-gray-600">Loading disputes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-finder-red" />
            Dispute Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage all contract disputes and issues
          </p>
        </div>

        {disputes && disputes.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No disputes found</p>
                <p className="text-gray-400 text-sm mt-2">All disputes will appear here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {disputes?.map((dispute) => (
              <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeBadge(dispute.type)}
                        {getStatusBadge(dispute.status)}
                      </div>
                      <CardTitle className="text-lg">
                        Dispute #{dispute.id.slice(0, 8)}
                      </CardTitle>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(dispute.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700">{dispute.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      {dispute.user && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {dispute.user.firstName} {dispute.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dispute.user.email} • {dispute.user.role}
                            </p>
                          </div>
                        </div>
                      )}

                      {dispute.contract && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Contract: ₦{parseFloat(dispute.contract.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dispute.contract.escrowStatus} • {dispute.contract.isCompleted ? 'Completed' : 'Active'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {dispute.contractId && (
                      <div className="pt-4 border-t">
                        <Link href={`/admin/contracts/${dispute.contractId}`}>
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            data-testid={`link-contract-${dispute.id}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Contract Details
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
