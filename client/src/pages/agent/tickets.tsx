import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TicketIcon, 
  Search, 
  Filter, 
  RefreshCw, 
  MessageSquare,
  Calendar,
  User,
  ArrowLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface Ticket {
  id: string;
  ticketNumber: string;
  submitterName: string;
  submitterEmail: string;
  submitterId: string | null;
  category: string;
  priority: string;
  department: string;
  subject: string;
  description: string;
  status: string;
  assignedTo: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  satisfactionRating: number | null;
  satisfactionFeedback: string | null;
  createdAt: string;
  updatedAt: string;
  submitter?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedAgent?: {
    agentId: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

interface TicketsResponse {
  tickets: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  agent: {
    id: string;
    agentId: string;
    department: string;
    permissions: string[];
  };
}

const priorityColors = {
  urgent: "bg-red-500 text-white",
  high: "bg-orange-500 text-white", 
  medium: "bg-yellow-500 text-white",
  low: "bg-green-500 text-white"
};

const statusColors = {
  open: "bg-blue-500 text-white",
  in_progress: "bg-purple-500 text-white",
  resolved: "bg-green-500 text-white",
  closed: "bg-gray-500 text-white"
};

export default function AgentTickets() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // URL params for filtering
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialStatus = searchParams.get('status') || '';
  const initialPriority = searchParams.get('priority') || '';
  const initialAssigned = searchParams.get('assigned') || '';
  
  const [filters, setFilters] = useState({
    status: initialStatus,
    priority: initialPriority,
    search: '',
    page: 1
  });

  const { data: ticketsData, isLoading, error, refetch } = useQuery<TicketsResponse>({
    queryKey: ['/api/agent/tickets', filters.status, filters.priority],
    staleTime: 30 * 1000, // 30 seconds
  });

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('/api/agent/tickets'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent/tickets'] });
    },
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    
    const queryString = params.toString();
    const newLocation = queryString ? `/agent/tickets?${queryString}` : '/agent/tickets';
    
    if (location !== newLocation) {
      setLocation(newLocation);
    }
  }, [filters.status, filters.priority]);

  const filteredTickets = ticketsData?.tickets.filter(ticket => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        ticket.ticketNumber.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.submitterName.toLowerCase().includes(searchLower) ||
        ticket.submitterEmail.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error || !ticketsData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Failed to load tickets</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const { agent } = ticketsData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/agent/dashboard">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-3">
                <TicketIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Support Tickets</h1>
                  <p className="text-sm text-gray-600">
                    {agent.department.charAt(0).toUpperCase() + agent.department.slice(1)} Department
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refreshMutation.mutate()}
                disabled={refreshMutation.isPending}
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger data-testid="select-priority">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                onClick={() => setFilters({ status: '', priority: '', search: '', page: 1 })}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Tickets ({filteredTickets.length})
            </CardTitle>
            {initialAssigned === 'unassigned' && (
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                Showing Unassigned Only
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TicketIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                <p>Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`ticket-card-${ticket.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span 
                            className="text-sm font-mono font-medium text-blue-600"
                            data-testid={`ticket-number-${ticket.id}`}
                          >
                            {ticket.ticketNumber}
                          </span>
                          <Badge 
                            className={statusColors[ticket.status as keyof typeof statusColors]}
                            data-testid={`ticket-status-${ticket.id}`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            className={priorityColors[ticket.priority as keyof typeof priorityColors]}
                            data-testid={`ticket-priority-${ticket.id}`}
                          >
                            {ticket.priority}
                          </Badge>
                          {!ticket.assignedTo && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Unassigned
                            </Badge>
                          )}
                        </div>
                        
                        <h3 
                          className="text-lg font-medium text-gray-900 mb-2"
                          data-testid={`ticket-subject-${ticket.id}`}
                        >
                          {ticket.subject}
                        </h3>
                        
                        <p 
                          className="text-sm text-gray-600 mb-3 line-clamp-2"
                          data-testid={`ticket-description-${ticket.id}`}
                        >
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span data-testid={`ticket-submitter-${ticket.id}`}>
                              {ticket.submitter ? 
                                `${ticket.submitter.firstName} ${ticket.submitter.lastName}` : 
                                ticket.submitterName
                              }
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span data-testid={`ticket-created-${ticket.id}`}>
                              {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                          
                          {ticket.assignedAgent && (
                            <div className="flex items-center">
                              <span className="text-gray-400">Assigned to:</span>
                              <span className="ml-1 font-medium" data-testid={`ticket-assignee-${ticket.id}`}>
                                {ticket.assignedAgent.user.firstName} {ticket.assignedAgent.user.lastName}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <span className="text-gray-400">Category:</span>
                            <span className="ml-1 capitalize" data-testid={`ticket-category-${ticket.id}`}>
                              {ticket.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <Link href={`/agent/tickets/${ticket.id}`}>
                          <Button size="sm" data-testid={`button-view-ticket-${ticket.id}`}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pagination would go here if needed */}
        {filteredTickets.length > 20 && (
          <Card className="mt-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Showing {Math.min(20, filteredTickets.length)} of {filteredTickets.length} tickets</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}