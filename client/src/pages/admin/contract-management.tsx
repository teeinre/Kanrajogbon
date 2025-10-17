
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AdminHeader from "@/components/admin-header";
import { XCircle, Search, FileText, User, Calendar, Banknote, CreditCard, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Contract {
  id: string;
  findId: string;
  proposalId: string;
  clientId: string;
  finderId: string;
  amount: string;
  escrowStatus: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  findTitle?: string;
  clientName?: string;
  finderName?: string;
  paymentReference?: string;
  transactionId?: string;
}

export default function AdminContractManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [contractToCancel, setContractToCancel] = useState<Contract | null>(null);
  const [contractToComplete, setContractToComplete] = useState<Contract | null>(null);

  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ['/api/admin/contracts'],
  });

  const cancelContractMutation = useMutation({
    mutationFn: async (contractId: string) => {
      return apiRequest(`/api/admin/contracts/${contractId}/cancel`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Contract Cancelled",
        description: "The contract has been successfully cancelled and funds refunded.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contracts'] });
      setContractToCancel(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel contract",
      });
    },
  });

  const completeContractMutation = useMutation({
    mutationFn: async (contractId: string) => {
      return apiRequest(`/api/admin/contracts/${contractId}/complete`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Contract Completed",
        description: "The contract has been marked as completed and funds released to finder.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contracts'] });
      setContractToComplete(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Completion Failed",
        description: error.message || "Failed to complete contract",
      });
    },
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'funded': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'released': return 'bg-green-100 text-green-700 border-green-200';
      case 'disputed': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contract.id.toLowerCase().includes(searchLower) ||
      contract.findTitle?.toLowerCase().includes(searchLower) ||
      contract.clientName?.toLowerCase().includes(searchLower) ||
      contract.finderName?.toLowerCase().includes(searchLower) ||
      contract.paymentReference?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <AdminHeader currentPage="contracts" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Management</h1>
          <p className="text-gray-600">Manage all platform contracts, transactions, and payment references</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by contract ID, title, client, finder, or payment reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Contracts ({filteredContracts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading contracts...</div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No contracts found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Find Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Finder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Ref</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono text-xs">
                          {contract.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="max-w-[200px] truncate">
                              {contract.findTitle || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {contract.clientName || contract.clientId.substring(0, 8)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {contract.finderName || contract.finderId.substring(0, 8)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-gray-400" />
                            {formatCurrency(contract.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(contract.escrowStatus)} border`}>
                            {contract.escrowStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-xs">
                              {contract.paymentReference || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {contract.transactionId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(contract.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {contract.escrowStatus === 'funded' && !contract.isCompleted && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => setContractToComplete(contract)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setContractToCancel(contract)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!contractToCancel} onOpenChange={() => setContractToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Contract?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this contract? This will:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Refund the full amount to the client</li>
                <li>Mark the contract as cancelled</li>
                <li>Notify both client and finder</li>
              </ul>
              {contractToCancel && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div><strong>Amount:</strong> {formatCurrency(contractToCancel.amount)}</div>
                  <div><strong>Payment Reference:</strong> {contractToCancel.paymentReference || 'N/A'}</div>
                  <div><strong>Transaction ID:</strong> {contractToCancel.transactionId || 'N/A'}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Contract</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => contractToCancel && cancelContractMutation.mutate(contractToCancel.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!contractToComplete} onOpenChange={() => setContractToComplete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Contract?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this contract as completed? This will:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Release funds to the finder's available balance</li>
                <li>Mark the contract as completed</li>
                <li>Notify both client and finder</li>
              </ul>
              {contractToComplete && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div><strong>Amount to Release:</strong> {formatCurrency(contractToComplete.amount)}</div>
                  <div><strong>Finder:</strong> {contractToComplete.finderName || 'N/A'}</div>
                  <div><strong>Client:</strong> {contractToComplete.clientName || 'N/A'}</div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => contractToComplete && completeContractMutation.mutate(contractToComplete.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Yes, Complete Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
