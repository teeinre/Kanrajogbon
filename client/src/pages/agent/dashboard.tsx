import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TicketIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  MessageSquare,
  ArrowUpRight,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface AgentDashboardData {
  agent: {
    id: string;
    agentId: string;
    department: string;
    permissions: string[];
    maxTicketsPerDay: number;
    responseTimeTarget: number;
  };
  statistics: {
    assigned: {
      total: number;
      open: number;
      inProgress: number;
      resolved: number;
    };
    department: {
      total: number;
      unassigned: number;
      urgent: number;
      high: number;
    };
  };
  recentTickets: Array<{
    id: string;
    ticketNumber: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    submitterName: string;
  }>;
}

const priorityColors = {
  urgent: "bg-red-500",
  high: "bg-orange-500", 
  medium: "bg-yellow-500",
  low: "bg-green-500"
};

const statusColors = {
  open: "bg-blue-500",
  in_progress: "bg-purple-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500"
};

export default function AgentDashboard() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: dashboardData, isLoading, error, refetch } = useQuery<AgentDashboardData>({
    queryKey: ['/api/agent/dashboard'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['/api/agent/tickets'],
    staleTime: 60 * 1000, // 1 minute
  });

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('/api/agent/dashboard'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agent/tickets'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const { agent, statistics, recentTickets } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Agent Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {agent.agentId} • {agent.department.charAt(0).toUpperCase() + agent.department.slice(1)} Department
                </p>
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
              <Link href="/agent/tickets">
                <Button size="sm" data-testid="button-all-tickets">
                  <TicketIcon className="w-4 h-4 mr-2" />
                  All Tickets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="recent" data-testid="tab-recent">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Assigned Tickets */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">My Assigned Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-3" data-testid="stat-assigned-total">
                    {statistics.assigned.total}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Open:</span>
                      <span className="font-medium text-blue-600" data-testid="stat-assigned-open">
                        {statistics.assigned.open}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">In Progress:</span>
                      <span className="font-medium text-purple-600" data-testid="stat-assigned-progress">
                        {statistics.assigned.inProgress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resolved:</span>
                      <span className="font-medium text-green-600" data-testid="stat-assigned-resolved">
                        {statistics.assigned.resolved}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department Stats */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Department Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-3" data-testid="stat-department-total">
                    {statistics.department.total}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unassigned:</span>
                      <span className="font-medium text-orange-600" data-testid="stat-department-unassigned">
                        {statistics.department.unassigned}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgent:</span>
                      <span className="font-medium text-red-600" data-testid="stat-department-urgent">
                        {statistics.department.urgent}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">High Priority:</span>
                      <span className="font-medium text-orange-600" data-testid="stat-department-high">
                        {statistics.department.high}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Target */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Response Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1" data-testid="stat-response-target">
                    {agent.responseTimeTarget}h
                  </div>
                  <p className="text-sm text-gray-600">Target response time</p>
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Daily limit: {agent.maxTicketsPerDay} tickets
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/agent/tickets?status=open">
                    <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-view-open">
                      <TicketIcon className="w-4 h-4 mr-2" />
                      View Open Tickets
                    </Button>
                  </Link>
                  <Link href="/agent/tickets?priority=urgent">
                    <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-view-urgent">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Urgent Tickets
                    </Button>
                  </Link>
                  <Link href="/agent/tickets?assigned=unassigned">
                    <Button variant="outline" size="sm" className="w-full justify-start" data-testid="button-view-unassigned">
                      <Users className="w-4 h-4 mr-2" />
                      Unassigned
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Agent Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Agent Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.permissions.map((permission) => (
                    <Badge 
                      key={permission} 
                      variant="secondary" 
                      className="text-xs"
                      data-testid={`permission-${permission}`}
                    >
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            {/* Recent Tickets */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Assigned Tickets</CardTitle>
                <Link href="/agent/tickets">
                  <Button variant="outline" size="sm" data-testid="button-view-all">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TicketIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No tickets assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTickets.map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        data-testid={`ticket-${ticket.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900" data-testid={`ticket-number-${ticket.id}`}>
                              {ticket.ticketNumber}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs text-white ${statusColors[ticket.status as keyof typeof statusColors]}`}
                              data-testid={`ticket-status-${ticket.id}`}
                            >
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs text-white ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}
                              data-testid={`ticket-priority-${ticket.id}`}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 truncate" data-testid={`ticket-subject-${ticket.id}`}>
                            {ticket.subject}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span data-testid={`ticket-submitter-${ticket.id}`}>
                              From: {ticket.submitterName}
                            </span>
                            <span data-testid={`ticket-date-${ticket.id}`}>
                              {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/agent/tickets/${ticket.id}`}>
                            <Button variant="outline" size="sm" data-testid={`button-view-ticket-${ticket.id}`}>
                              <MessageSquare className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}