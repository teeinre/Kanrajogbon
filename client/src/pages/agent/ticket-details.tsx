import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Calendar, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Settings,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string | null;
  senderType: string;
  senderName: string;
  senderEmail: string | null;
  content: string;
  attachments: string[] | null;
  isInternal: boolean;
  createdAt: string;
  sender?: {
    firstName: string;
    lastName: string;
  };
}

interface TicketDetails {
  ticket: {
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
  };
  messages: TicketMessage[];
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

export default function TicketDetails() {
  const [match, params] = useRoute("/agent/tickets/:id");
  const ticketId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [responseContent, setResponseContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [showInternalNotes, setShowInternalNotes] = useState(true);

  const { data: ticketData, isLoading, error, refetch } = useQuery<TicketDetails>({
    queryKey: ['/api/agent/tickets', ticketId],
    enabled: !!ticketId,
    staleTime: 30 * 1000, // 30 seconds
  });

  const respondMutation = useMutation({
    mutationFn: async (data: { content: string; isInternal: boolean }) => {
      return apiRequest(`/api/agent/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Response sent",
        description: isInternal ? "Internal note added successfully" : "Response sent to customer",
      });
      setResponseContent("");
      setIsInternal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/agent/tickets', ticketId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send response",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async (updates: { status?: string; priority?: string; resolution?: string }) => {
      return apiRequest(`/api/agent/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      toast({
        title: "Ticket updated",
        description: "Ticket has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/agent/tickets', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['/api/agent/dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update ticket",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (ticketData?.ticket) {
      setNewStatus(ticketData.ticket.status);
      setNewPriority(ticketData.ticket.priority);
    }
  }, [ticketData]);

  if (!match || !ticketId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Invalid ticket ID</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Failed to load ticket details</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const { ticket, messages } = ticketData;
  
  const filteredMessages = messages.filter(msg => 
    showInternalNotes || !msg.isInternal
  );

  const handleSendResponse = () => {
    if (!responseContent.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending",
        variant: "destructive",
      });
      return;
    }

    respondMutation.mutate({ 
      content: responseContent.trim(), 
      isInternal 
    });
  };

  const handleUpdateTicket = () => {
    const updates: any = {};
    
    if (newStatus !== ticket.status) {
      updates.status = newStatus;
    }
    
    if (newPriority !== ticket.priority) {
      updates.priority = newPriority;
    }

    if (Object.keys(updates).length > 0) {
      updateTicketMutation.mutate(updates);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/agent/tickets">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tickets
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900" data-testid="ticket-number">
                  {ticket.ticketNumber}
                </h1>
                <p className="text-sm text-gray-600">
                  {ticket.department.charAt(0).toUpperCase() + ticket.department.slice(1)} • 
                  Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowInternalNotes(!showInternalNotes)}
                data-testid="button-toggle-internal"
              >
                {showInternalNotes ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showInternalNotes ? 'Hide Internal' : 'Show Internal'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                data-testid="button-refresh"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2" data-testid="ticket-subject">
                      {ticket.subject}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge 
                        className={statusColors[ticket.status as keyof typeof statusColors]}
                        data-testid="ticket-status"
                      >
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        className={priorityColors[ticket.priority as keyof typeof priorityColors]}
                        data-testid="ticket-priority"
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline" data-testid="ticket-category">
                        {ticket.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap" data-testid="ticket-description">
                      {ticket.description}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Submitted by:</span>
                      <p className="font-medium" data-testid="ticket-submitter">
                        {ticket.submitter ? 
                          `${ticket.submitter.firstName} ${ticket.submitter.lastName}` : 
                          ticket.submitterName
                        }
                      </p>
                      <p className="text-gray-600" data-testid="ticket-email">
                        {ticket.submitter?.email || ticket.submitterEmail}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Assigned to:</span>
                      <p className="font-medium" data-testid="ticket-assignee">
                        {ticket.assignedAgent ? 
                          `${ticket.assignedAgent.user.firstName} ${ticket.assignedAgent.user.lastName}` : 
                          'Unassigned'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Conversation ({filteredMessages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`p-4 rounded-lg ${
                        message.senderType === 'agent' 
                          ? message.isInternal 
                            ? 'bg-yellow-50 border border-yellow-200' 
                            : 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                      data-testid={`message-${message.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm" data-testid={`message-sender-${message.id}`}>
                            {message.sender ? 
                              `${message.sender.firstName} ${message.sender.lastName}` : 
                              message.senderName
                            }
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              message.senderType === 'agent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}
                            data-testid={`message-type-${message.id}`}
                          >
                            {message.senderType}
                          </Badge>
                          {message.isInternal && (
                            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500" data-testid={`message-time-${message.id}`}>
                          {format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-900 whitespace-pre-wrap" data-testid={`message-content-${message.id}`}>
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your response here..."
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                  rows={4}
                  data-testid="textarea-response"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="internal-note"
                      checked={isInternal}
                      onCheckedChange={(checked) => setIsInternal(checked as boolean)}
                      data-testid="checkbox-internal"
                    />
                    <label htmlFor="internal-note" className="text-sm text-gray-600">
                      Internal note (not visible to customer)
                    </label>
                  </div>
                  
                  <Button 
                    onClick={handleSendResponse}
                    disabled={respondMutation.isPending || !responseContent.trim()}
                    data-testid="button-send-response"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {respondMutation.isPending ? 'Sending...' : 'Send Response'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Ticket Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                  </label>
                  <Select
                    value={newStatus}
                    onValueChange={setNewStatus}
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Priority
                  </label>
                  <Select
                    value={newPriority}
                    onValueChange={setNewPriority}
                  >
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleUpdateTicket}
                  disabled={updateTicketMutation.isPending || (newStatus === ticket.status && newPriority === ticket.priority)}
                  className="w-full"
                  data-testid="button-update-ticket"
                >
                  {updateTicketMutation.isPending ? 'Updating...' : 'Update Ticket'}
                </Button>
              </CardContent>
            </Card>

            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span data-testid="ticket-created">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Last updated:</span>
                  <span data-testid="ticket-updated">
                    {format(new Date(ticket.updatedAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
                
                {ticket.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Resolved:</span>
                    <span data-testid="ticket-resolved">
                      {format(new Date(ticket.resolvedAt), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="capitalize" data-testid="ticket-department">
                    {ticket.department}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Messages:</span>
                  <span data-testid="ticket-message-count">
                    {messages.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}