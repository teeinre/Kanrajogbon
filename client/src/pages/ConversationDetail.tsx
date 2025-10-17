
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Send, 
  User, 
  Paperclip, 
  Download, 
  FileIcon,
  MessageCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Bell,
  Reply,
  X,
  Search,
  Filter,
  MoreVertical,
  Clock,
  Star,
  Upload,
  File
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import ClientHeader from "@/components/client-header";
import { FinderHeader } from "@/components/finder-header";
import { FileUploader } from "@/components/FileUploader";

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachmentPaths?: string[];
  attachmentNames?: string[];
  isRead: boolean;
  createdAt: Date;
  sender: { 
    firstName: string; 
    lastName: string; 
  };
  quotedMessageId?: string;
  quotedMessage?: {
    sender: {
      firstName: string;
      lastName: string;
    };
    content: string;
  };
};

type ConversationDetail = {
  id: string;
  clientId: string;
  finderId: string;
  proposalId: string;
  proposal: { 
    request: { 
      title: string; 
    }; 
  };
  finder?: { 
    user: { 
      firstName: string; 
      lastName: string; 
    }; 
  };
  client?: { 
    firstName: string; 
    lastName: string; 
  };
};

type ConversationListItem = {
  id: string;
  clientId: string;
  finderId: string;
  proposalId: string;
  lastMessageAt: Date;
  createdAt: Date;
  proposal: { request: { title: string; }; };
  finder?: { user: { firstName: string; lastName: string; }; };
  client?: { firstName: string; lastName: string; };
  lastMessage?: { content: string; createdAt: Date; senderId: string; };
  unreadCount: number;
};

export default function ConversationDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const conversationId = params.conversationId as string;
  const { toast } = useToast();

  const [newMessage, setNewMessage] = useState("");
  const [quotedMessage, setQuotedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [attachmentPaths, setAttachmentPaths] = useState<string[]>([]);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get all conversations for the sidebar
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery<ConversationListItem[]>({
    queryKey: ['/api/messages/conversations'],
    enabled: !!user
  });

  const { data: conversation } = useQuery<ConversationDetail>({
    queryKey: ['/api/messages/conversations', conversationId],
    enabled: !!conversationId && !!user,
  });

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages/conversations', conversationId, 'messages'],
    enabled: !!conversationId && !!user,
    refetchInterval: 3000,
    staleTime: 1000,
    refetchOnWindowFocus: true
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, quotedMessageId, attachmentPaths, attachmentNames }: { 
      content: string, 
      quotedMessageId?: string,
      attachmentPaths?: string[],
      attachmentNames?: string[]
    }) => {
      const response = await apiRequest(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ 
          content: content.trim(), 
          quotedMessageId, 
          attachmentPaths,
          attachmentNames
        }),
      });
      return response;
    },
    onSuccess: () => {
      setNewMessage("");
      setQuotedMessage(null);
      setAttachmentPaths([]);
      setAttachmentNames([]);
      queryClient.invalidateQueries({ 
        queryKey: ['/api/messages/conversations', conversationId, 'messages'] 
      });
      toast({
        title: "Message sent!",
        description: "Your message has been delivered successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later.",
      });
    }
  });

  const handleSend = () => {
    const content = newMessage.trim();
    if (!content && attachmentPaths.length === 0) return;
    sendMessageMutation.mutate({ 
      content, 
      quotedMessageId: quotedMessage?.id,
      attachmentPaths,
      attachmentNames
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuoteMessage = (messageToQuote: Message) => {
    setQuotedMessage(messageToQuote);
  };

  const cancelQuote = () => {
    setQuotedMessage(null);
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest('/api/objects/upload', {
      method: 'POST'
    });
    return {
      method: 'PUT' as const,
      url: response.uploadURL
    };
  };

  const handleUploadComplete = async (result: any) => {
    setIsUploading(false);
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const fileName = uploadedFile.name;
      const fileUrl = uploadedFile.uploadURL;

      try {
        // Set ACL for the uploaded file
        const aclResponse = await apiRequest('/api/objects/acl', {
          method: 'PUT',
          body: JSON.stringify({
            objectURL: fileUrl,
            visibility: 'private'
          })
        });

        setAttachmentPaths(prev => [...prev, aclResponse.objectPath]);
        setAttachmentNames(prev => [...prev, fileName]);
        
        toast({
          title: "File uploaded successfully",
          description: `${fileName} has been attached to your message.`,
        });
      } catch (error) {
        console.error('Failed to set file ACL:', error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Failed to process the uploaded file.",
        });
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachmentPaths(prev => prev.filter((_, i) => i !== index));
    setAttachmentNames(prev => prev.filter((_, i) => i !== index));
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation => {
    if (!searchTerm.trim()) return true;

    const otherUser = user?.role === 'client'
      ? conversation.finder?.user
      : conversation.client;
    const userName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : '';
    const projectTitle = conversation.proposal?.request?.title || '';
    const lastMessageContent = conversation.lastMessage?.content || '';

    const searchLower = searchTerm.toLowerCase().trim();

    return userName.toLowerCase().includes(searchLower) ||
           projectTitle.toLowerCase().includes(searchLower) ||
           lastMessageContent.toLowerCase().includes(searchLower);
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in Required</h3>
          <p className="text-gray-600">Please log in to view messages.</p>
        </Card>
      </div>
    );
  }

  const otherParticipant = user?.role === 'client' 
    ? conversation?.finder?.user 
    : conversation?.client;

  const participantName = otherParticipant 
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : 'Client A';

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.role === 'client' ? (
        <ClientHeader currentPage="messages" />
      ) : (
        <FinderHeader currentPage="messages" />
      )}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Conversation List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Message & System</h1>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Button size="sm" variant="ghost" className="p-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                  </Button>
                  {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {conversations.filter(c => c.unreadCount > 0).length}
                      </span>
                    </div>
                  )}
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-500 text-white text-sm font-semibold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Conversations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations</h3>
                <p className="text-gray-600">Start a conversation to see it here.</p>
              </div>
            ) : (
              <div>
                {filteredConversations.map((conv) => {
                  const otherUser = user?.role === 'client'
                    ? conv.finder?.user
                    : conv.client;
                  const displayName = otherUser
                    ? `${otherUser.firstName} ${otherUser.lastName}`
                    : 'Unknown User';
                  const initials = otherUser
                    ? `${otherUser.firstName.charAt(0)}${otherUser.lastName.charAt(0)}`.toUpperCase()
                    : 'U';
                  const lastMessageTime = conv.lastMessage?.createdAt
                    ? format(new Date(conv.lastMessage.createdAt), 'HH:mm')
                    : format(new Date(conv.lastMessageAt), 'HH:mm');
                  const isUnread = conv.unreadCount > 0;
                  const isSelected = conversationId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => navigate(`/messages/${conv.id}`)}
                      className={`
                        p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150
                        ${isSelected ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar with online indicator */}
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-500 text-white font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium text-sm truncate ${
                              isUnread ? 'text-gray-900' : 'text-gray-800'
                            }`}>
                              {displayName}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {lastMessageTime}
                            </span>
                          </div>

                          <p className={`text-sm truncate ${
                            isUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                          }`}>
                            {conv.lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>

                        {isUnread && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-500 text-white font-semibold">
                    {otherParticipant ? `${otherParticipant.firstName.charAt(0)}${otherParticipant.lastName.charAt(0)}` : 'CA'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-semibold text-gray-900">{participantName}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="p-2">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </Button>
                <div className="relative">
                  <Button size="sm" variant="ghost" className="p-2">
                    <Bell className="w-4 h-4 text-gray-500" />
                  </Button>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-500 text-white text-sm font-semibold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message: any, index: number) => {
                const isOwnMessage = message.senderId === user.id;
                const messageTime = format(new Date(message.createdAt), 'HH:mm');

                return (
                  <div key={message.id} className="flex items-start space-x-3">
                    {!isOwnMessage && (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-gray-500 text-white font-semibold">
                          {otherParticipant ? `${otherParticipant.firstName.charAt(0)}${otherParticipant.lastName.charAt(0)}` : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`flex-1 ${isOwnMessage ? 'flex justify-end' : ''}`}>
                      <div 
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl cursor-pointer group relative ${
                          isOwnMessage 
                            ? 'bg-blue-500 text-white rounded-br-md' 
                            : 'bg-white border border-gray-200 rounded-bl-md'
                        }`}
                        onClick={() => handleQuoteMessage(message)}
                      >
                        {/* Quote indicator */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Reply className="w-4 h-4 text-gray-400" />
                        </div>

                        {/* Quoted message display */}
                        {message.quotedMessageId && (
                          <div className={`mb-2 p-2 rounded-lg border-l-4 ${
                            isOwnMessage 
                              ? 'bg-blue-600 border-blue-300' 
                              : 'bg-gray-50 border-gray-300'
                          }`}>
                            <p className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-600'}`}>
                              {message.quotedMessage?.sender?.firstName} {message.quotedMessage?.sender?.lastName}
                            </p>
                            <p className={`text-sm truncate ${isOwnMessage ? 'text-blue-50' : 'text-gray-700'}`}>
                              {message.quotedMessage?.content || 'Message not found'}
                            </p>
                          </div>
                        )}

                        <p className="text-sm leading-relaxed">{message.content}</p>

                        {/* Message attachments */}
                        {message.attachmentPaths && message.attachmentPaths.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachmentPaths.map((path: string, attachIndex: number) => (
                              <div key={attachIndex} className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
                                <File className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700 truncate">
                                  {message.attachmentNames?.[attachIndex] || `Attachment ${attachIndex + 1}`}
                                </span>
                                <a
                                  href={path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Sample emoji reactions for the last message */}
                        {index === messages.length - 1 && !isOwnMessage && (
                          <div className="flex items-center space-x-1 mt-2">
                            <span className="text-lg">😊</span>
                            <span className="text-lg">😊</span>
                            <span className="text-lg">🙌</span>
                            <span className="text-lg">🙏</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mt-1 px-1">
                        {messageTime}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            {quotedMessage && (
              <div className="flex items-center justify-between p-2 mb-2 border rounded-lg bg-gray-100">
                <div>
                  <p className="text-xs text-gray-600">Replying to {quotedMessage.sender?.firstName} {quotedMessage.sender?.lastName}</p>
                  <p className="text-sm text-gray-800 truncate max-w-md">{quotedMessage.content}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={cancelQuote}>
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            )}
            
            {/* Attachment Preview */}
            {attachmentPaths.length > 0 && (
              <div className="mb-3 p-3 border rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Attachments ({attachmentPaths.length})
                </div>
                <div className="space-y-2">
                  {attachmentNames.map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <File className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate max-w-xs">{name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-400 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex items-center space-x-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 border-gray-200 rounded-full px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={sendMessageMutation.isPending}
                  />

                  <div className="flex items-center space-x-2">
                    <FileUploader
                      maxNumberOfFiles={5}
                      maxFileSize={31457280} // 30MB
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonClassName="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      )}
                    </FileUploader>
                    
                    <Button size="sm" variant="ghost" className="p-2 rounded-full hover:bg-gray-100">
                      <span className="text-lg">👍</span>
                    </Button>
                  </div>

                  <Button 
                    onClick={handleSend}
                    disabled={sendMessageMutation.isPending || (!newMessage.trim() && attachmentPaths.length === 0)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full min-w-[80px]"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>

              {/* File attachment indicator */}
              {(attachmentPaths.length > 0 || isUploading) && (
                <div className="ml-14 mr-24">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Paperclip className="w-4 h-4" />
                    <span>
                      {isUploading 
                        ? "Uploading file..." 
                        : `${attachmentPaths.length} file${attachmentPaths.length !== 1 ? 's' : ''} attached`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
