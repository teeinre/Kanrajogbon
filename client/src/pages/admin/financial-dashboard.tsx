
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminHeader from "@/components/admin-header";
import { useAuth } from "@/hooks/use-auth";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Eye,
  Filter,
  Coins,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Wallet,
  FileText,
  DollarSign
} from "lucide-react";

interface Transaction {
  id: string;
  userId?: string;
  finderId?: string;
  amount: number;
  type: 'findertoken_purchase' | 'proposal' | 'escrow_funding' | 'withdrawal' | 'grant';
  description: string;
  reference?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  finder?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface WithdrawalRequest {
  id: string;
  finderId: string;
  amount: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  finder: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface Contract {
  id: string;
  amount: string;
  escrowStatus: 'pending' | 'held' | 'released' | 'completed';
  createdAt: string;
  clientId: string;
  finderId: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
  };
  finder: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface FinancialSummary {
  totalRevenue: number;
  totalWithdrawals: number;
  pendingEscrow: number;
  tokenSales: number;
  dailyRevenue: Array<{ date: string; amount: number }>;
  weeklyRevenue: Array<{ week: string; amount: number }>;
  monthlyRevenue: Array<{ month: string; amount: number }>;
  yearlyRevenue: Array<{ year: string; amount: number }>;
}

export default function FinancialDashboard() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const queryClient = useQueryClient();

  // Fetch all financial data with proper error handling
  const { 
    data: transactions = [], 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useQuery<Transaction[]>({
    queryKey: ['/api/admin/transactions'],
    enabled: !!user && user.role === 'admin',
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { 
    data: withdrawals = [], 
    isLoading: withdrawalsLoading, 
    error: withdrawalsError 
  } = useQuery<WithdrawalRequest[]>({
    queryKey: ['/api/admin/withdrawals'],
    enabled: !!user && user.role === 'admin',
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: contracts = [], 
    isLoading: contractsLoading, 
    error: contractsError 
  } = useQuery<Contract[]>({
    queryKey: ['/api/admin/contracts'],
    enabled: !!user && user.role === 'admin',
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = transactionsLoading || withdrawalsLoading || contractsLoading;
  const hasError = transactionsError || withdrawalsError || contractsError;

  // Refresh data function
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
    queryClient.invalidateQueries({ queryKey: ['/api/admin/withdrawals'] });
    queryClient.invalidateQueries({ queryKey: ['/api/admin/contracts'] });
  };

  // Filter transactions based on date and type
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    const now = new Date();
    
    // Date filtering
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return transactionDate >= today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return transactionDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return transactionDate >= monthAgo;
    } else if (dateFilter === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      return transactionDate >= yearAgo;
    } else if (dateFilter === 'custom' && customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);
      endDate.setHours(23, 59, 59, 999);
      return transactionDate >= startDate && transactionDate <= endDate;
    }
    
    // Type filtering
    if (transactionTypeFilter !== 'all') {
      return transaction.type === transactionTypeFilter;
    }
    
    return true;
  });

  // Calculate financial summary
  const financialSummary: FinancialSummary = {
    totalRevenue: filteredTransactions
      .filter(t => ['findertoken_purchase', 'escrow_funding'].includes(t.type))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalWithdrawals: withdrawals
      .filter(w => w.status === 'approved')
      .reduce((sum, w) => sum + parseFloat(w.amount), 0),
    pendingEscrow: contracts
      .filter(c => c.escrowStatus === 'held')
      .reduce((sum, c) => sum + parseFloat(c.amount), 0),
    tokenSales: filteredTransactions
      .filter(t => t.type === 'findertoken_purchase')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    dailyRevenue: [],
    weeklyRevenue: [],
    monthlyRevenue: [],
    yearlyRevenue: []
  };

  // Group transactions by time periods
  // Inside the React component: groupTransactionsByPeriod
  const groupTransactionsByPeriod = (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
      const grouped = filteredTransactions
        .filter(t => ['findertoken_purchase', 'escrow_funding'].includes(t.type))
        .reduce((acc, transaction) => {
          const date = new Date(transaction.createdAt);
          let key: string;
  
          switch (period) {
            case 'daily':
              key = date.toISOString().split('T')[0];
              break;
            case 'weekly':
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay());
              key = `Week of ${weekStart.toISOString().split('T')[0]}`;
              break;
            case 'monthly':
              key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              break;
            case 'yearly':
              key = date.getFullYear().toString();
              break;
            default:
              key = date.toISOString().split('T')[0];
          }
  
          if (!acc[key]) {
            acc[key] = 0;
          }
          acc[key] += Math.abs(transaction.amount);
          return acc;
        }, {} as Record<string, number>);
  
      return Object.entries(grouped)
        .map(([key, amount]) => ({ [period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : period === 'yearly' ? 'year' : 'date']: key, amount }))
        .sort((a, b) => {
          const labelKey: 'week' | 'month' | 'year' | 'date' =
            period === 'weekly' ? 'week' :
            period === 'monthly' ? 'month' :
            period === 'yearly' ? 'year' : 'date';
          return a[labelKey].localeCompare(b[labelKey]);
        });
  };
  const periodData = groupTransactionsByPeriod(viewMode);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount).replace(/NGN/g, '₦');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'findertoken_purchase':
        return <Coins className="w-4 h-4 text-green-600" />;
      case 'escrow_funding':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'withdrawal':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'grant':
        return <ArrowUpRight className="w-4 h-4 text-purple-600" />;
      default:
        return <Coins className="w-4 h-4 text-gray-600" />;
    }
  };

  const exportToCSV = () => {
    const csvData = filteredTransactions.map(transaction => ({
      Date: formatDate(transaction.createdAt),
      Type: transaction.type,
      Amount: transaction.amount,
      Description: transaction.description,
      User: transaction.user ? `${transaction.user.firstName} ${transaction.user.lastName}` : 
            transaction.finder ? `${transaction.finder.user.firstName} ${transaction.finder.user.lastName}` : 'N/A',
      Reference: transaction.reference || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-statement-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader currentPage="financial" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finder-red mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading financial data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader currentPage="financial" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive financial overview and accounting statements</p>
          </div>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
          </Button>
        </div>

        {/* Error State */}
        {hasError && (
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error Loading Financial Data</h3>
                    <p className="text-sm text-red-600 mt-1">
                      {transactionsError && "Failed to load transactions. "}
                      {withdrawalsError && "Failed to load withdrawals. "}
                      {contractsError && "Failed to load contracts. "}
                      Please try refreshing the page or contact support if the issue persists.
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        onClick={refreshData} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Retrying...
                          </>
                        ) : (
                          'Retry Loading'
                        )}
                      </Button>
                      <Button 
                        onClick={() => window.location.reload()} 
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                        size="sm"
                      >
                        Refresh Page
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content - Only show when not loading and no errors */}
        {!isLoading && !hasError && (
          <>
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(financialSummary.totalRevenue)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Token Sales</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(financialSummary.tokenSales)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Coins className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Escrow</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(financialSummary.pendingEscrow)}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(financialSummary.totalWithdrawals)}
                      </p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters & Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div>
                    <Label>Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {dateFilter === 'custom' && (
                    <>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label>Transaction Type</Label>
                    <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="findertoken_purchase">Token Purchases</SelectItem>
                        <SelectItem value="escrow_funding">Escrow Funding</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                        <SelectItem value="grant">Token Grants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>View Mode</Label>
                    <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={exportToCSV} className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Column 1: Withdrawals */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5 text-red-600" />
                    <span>Withdrawal Requests</span>
                    <Badge variant="outline" className="ml-auto">
                      {withdrawals.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {withdrawals.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No withdrawal requests found</p>
                      </div>
                    ) : (
                      withdrawals.slice(0, 10).map((withdrawal) => (
                        <div key={withdrawal.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {withdrawal.finder.user.firstName} {withdrawal.finder.user.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{withdrawal.finder.user.email}</p>
                            </div>
                            <Badge 
                              variant={
                                withdrawal.status === 'approved' ? 'default' :
                                withdrawal.status === 'pending' ? 'secondary' :
                                withdrawal.status === 'processing' ? 'outline' :
                                'destructive'
                              }
                              className="text-xs"
                            >
                              {withdrawal.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-red-600">
                              {formatCurrency(parseFloat(withdrawal.amount))}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(withdrawal.requestedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            via {withdrawal.paymentMethod}
                          </p>
                        </div>
                      ))
                    )}
                    {withdrawals.length > 10 && (
                      <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                          Showing first 10 of {withdrawals.length} requests
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Column 2: Contract Funding */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Contract Funding</span>
                    <Badge variant="outline" className="ml-auto">
                      {contracts.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {contracts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No contracts found</p>
                      </div>
                    ) : (
                      contracts.slice(0, 10).map((contract) => (
                        <div key={contract.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                Client: {contract.client.firstName} {contract.client.lastName}
                              </p>
                              <p className="text-xs text-gray-600">
                                Finder: {contract.finder.user.firstName} {contract.finder.user.lastName}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                contract.escrowStatus === 'completed' ? 'default' :
                                contract.escrowStatus === 'held' ? 'secondary' :
                                contract.escrowStatus === 'released' ? 'outline' :
                                'destructive'
                              }
                              className="text-xs"
                            >
                              {contract.escrowStatus}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(parseFloat(contract.amount))}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(contract.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {contracts.length > 10 && (
                      <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                          Showing first 10 of {contracts.length} contracts
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Column 3: Recent Transactions */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span>Recent Transactions</span>
                    <Badge variant="outline" className="ml-auto">
                      {filteredTransactions.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No transactions found</p>
                      </div>
                    ) : (
                      filteredTransactions.slice(0, 10).map((transaction) => (
                        <div key={transaction.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              {getTransactionIcon(transaction.type)}
                              <Badge 
                                variant={
                                  transaction.type === 'findertoken_purchase' ? 'default' :
                                  transaction.type === 'escrow_funding' ? 'secondary' :
                                  transaction.type === 'withdrawal' ? 'destructive' :
                                  'outline'
                                }
                                className="text-xs"
                              >
                                {transaction.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                          <div className="mb-2">
                            {transaction.user ? (
                              <p className="font-medium text-sm">
                                {transaction.user.firstName} {transaction.user.lastName}
                              </p>
                            ) : transaction.finder ? (
                              <p className="font-medium text-sm">
                                {transaction.finder.user.firstName} {transaction.finder.user.lastName}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400">N/A</p>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-600 truncate flex-1 mr-2">
                              {transaction.description}
                            </p>
                            <span className={`text-sm font-bold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}
                              {formatCurrency(Math.abs(transaction.amount))}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {filteredTransactions.length > 10 && (
                      <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                          Showing first 10 of {filteredTransactions.length} transactions
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Period-based Revenue Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Revenue by {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {periodData.map((item, index) => {
                    const periodKey = Object.keys(item)[0];
                    const period = item[periodKey];
                    const amount = item.amount;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{period}</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
