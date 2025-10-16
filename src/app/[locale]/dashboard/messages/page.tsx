'use client';

import {  ArrowLeft, Archive, Bell, Calendar, CheckCircle, Clock, MessageSquare, MoreVertical, Paperclip, Phone, Plus, Search, Send, Star, Tag, Trash2, User, Video  } from '@/components/ui/dynamic-icons';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Typography } from '@/presentation/components/ui/typography';

// Mock data
const mockConversations = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Sales Manager',
    avatar: '/avatars/sarah.jpg',
    lastMessage:
      'The Robusta samples are ready for shipment. Would you like to schedule a call to discuss pricing?',
    timestamp: '2 min ago',
    unread: 3,
    online: true,
    type: 'sales',
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Logistics Coordinator',
    avatar: '/avatars/mike.jpg',
    lastMessage:
      'Your order GB-2024-001 has been loaded onto the vessel. ETA: March 15th.',
    timestamp: '1 hour ago',
    unread: 0,
    online: false,
    type: 'logistics',
  },
  {
    id: '3',
    name: 'Quality Team',
    role: 'Quality Assurance',
    avatar: '/avatars/quality.jpg',
    lastMessage:
      'Lab results for batch #QC-240301 are now available in your documents section.',
    timestamp: '3 hours ago',
    unread: 1,
    online: true,
    type: 'quality',
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    content:
      "Hi! I hope you're doing well. I wanted to follow up on your recent inquiry about our premium Robusta beans.",
    timestamp: '10:30 AM',
    isOwn: false,
    avatar: '/avatars/sarah.jpg',
  },
  {
    id: '2',
    sender: 'You',
    content:
      "Hello Sarah! Yes, I'm very interested. Could you provide more details about the flavor profile and pricing for a 20-ton order?",
    timestamp: '10:35 AM',
    isOwn: true,
    avatar: '/avatars/user.jpg',
  },
  {
    id: '3',
    sender: 'Sarah Johnson',
    content:
      'Absolutely! Our premium Robusta has a rich, full-bodied flavor with notes of dark chocolate and nuts. For a 20-ton order, we can offer competitive pricing. Let me prepare a detailed quote for you.',
    timestamp: '10:40 AM',
    isOwn: false,
    avatar: '/avatars/sarah.jpg',
  },
];

const mockNotifications = [
  {
    id: '1',
    title: 'New Quote Available',
    message: 'Quote #GB-2024-015 for Arabica Blend is ready for review',
    timestamp: '5 min ago',
    type: 'quote',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Shipment Update',
    message: 'Your order GB-2024-001 has departed from Ho Chi Minh Port',
    timestamp: '2 hours ago',
    type: 'shipping',
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Quality Report Ready',
    message: 'Lab analysis for batch #QC-240301 is now available',
    timestamp: '1 day ago',
    type: 'quality',
    read: true,
    priority: 'low',
  },
];

const mockTickets = [
  {
    id: 'TK-001',
    title: 'Delayed Shipment Inquiry',
    description: 'Need clarification on the delay of order GB-2024-003',
    status: 'open',
    priority: 'high',
    category: 'logistics',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-02',
    assignee: 'Mike Chen',
    responses: 3,
  },
  {
    id: 'TK-002',
    title: 'Quality Certificate Request',
    description:
      'Requesting additional quality certificates for customs clearance',
    status: 'in_progress',
    priority: 'medium',
    category: 'documentation',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-01',
    assignee: 'Quality Team',
    responses: 1,
  },
  {
    id: 'TK-003',
    title: 'Pricing Inquiry for Bulk Order',
    description: 'Need pricing for 50-ton monthly contract',
    status: 'resolved',
    priority: 'medium',
    category: 'sales',
    createdAt: '2024-02-25',
    updatedAt: '2024-02-26',
    assignee: 'Sarah Johnson',
    responses: 5,
  },
];

function ChatSidebar({
  selectedConversation,
  onSelectConversation,
}: {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}) {
  const t = useTranslations('messages');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    return mockConversations.filter(
      conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex w-full flex-col bg-white sm:w-80">
      <div className="border-b p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <Typography
            variant="h3"
            className="text-base font-semibold sm:text-lg"
          >
            {t('chat.title')}
          </Typography>
          <Button size="sm" className="h-8 px-2 sm:h-9 sm:px-3">
            <Plus className="mr-1 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('chat.newChat')}</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('chat.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-9 pl-10 sm:h-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-1 sm:p-2">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                'flex min-h-[60px] cursor-pointer items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50 sm:min-h-[56px] sm:p-3',
                selectedConversation === conversation.id && 'bg-primary/10'
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={conversation.avatar}
                    alt={conversation.name}
                  />
                  <AvatarFallback>
                    {conversation.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <Typography variant="small" className="truncate font-medium">
                    {conversation.name}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="ml-2 flex-shrink-0 text-xs"
                  >
                    {conversation.timestamp}
                  </Typography>
                </div>
                <Typography
                  variant="muted"
                  className="mb-1 text-xs text-muted-foreground"
                >
                  {conversation.role}
                </Typography>
                <Typography
                  variant="muted"
                  className="line-clamp-2 text-sm leading-tight text-muted-foreground"
                >
                  {conversation.lastMessage}
                </Typography>
              </div>
              {conversation.unread > 0 && (
                <Badge className="ml-2 h-5 w-5 flex-shrink-0 rounded-full p-0 text-xs">
                  {conversation.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ChatWindow({
  conversationId,
  onBackToList,
}: {
  conversationId: string | null;
  onBackToList?: () => void;
}) {
  const t = useTranslations('messages');
  const [message, setMessage] = useState('');

  if (!conversationId) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <Typography variant="h3" className="mb-2">
            {t('chat.selectConversation')}
          </Typography>
          <Typography variant="muted">
            {t('chat.selectConversationDescription')}
          </Typography>
        </div>
      </div>
    );
  }

  const conversation = mockConversations.find(c => c.id === conversationId);

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b bg-white p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          {/* Mobile back button */}
          {onBackToList && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToList}
              className="h-8 w-8 sm:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={conversation?.avatar} alt={conversation?.name} />
            <AvatarFallback>
              {conversation?.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <Typography
              variant="small"
              className="text-sm font-medium sm:text-base"
            >
              {conversation?.name}
            </Typography>
            <Typography
              variant="muted"
              className="text-xs text-muted-foreground"
            >
              {conversation?.role} •{' '}
              {conversation?.online ? 'Online' : 'Offline'}
            </Typography>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9"
          >
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                {t('chat.actions.star')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                {t('chat.actions.archive')}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {t('chat.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {mockMessages.map(msg => (
            <div
              key={msg.id}
              className={cn(
                'flex space-x-2 sm:space-x-3',
                msg.isOwn && 'flex-row-reverse space-x-reverse'
              )}
            >
              <Avatar className="h-7 w-7 flex-shrink-0 sm:h-8 sm:w-8">
                <AvatarImage src={msg.avatar} alt={msg.sender} />
                <AvatarFallback className="text-xs">
                  {msg.sender
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[75%] sm:max-w-xs lg:max-w-md',
                  msg.isOwn && 'text-right'
                )}
              >
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 sm:px-4 sm:py-2',
                    msg.isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  <Typography
                    variant="small"
                    className="text-sm leading-relaxed"
                  >
                    {msg.content}
                  </Typography>
                </div>
                <Typography
                  variant="muted"
                  className="mt-1 text-xs text-muted-foreground"
                >
                  {msg.timestamp}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-white p-3 sm:p-4">
        <div className="flex items-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 sm:flex sm:h-10 sm:w-10"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Textarea
              placeholder={t('chat.messagePlaceholder')}
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="min-h-[44px] resize-none text-base sm:min-h-[40px] sm:text-sm"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  // Handle send message
                  setMessage('');
                }
              }}
            />
          </div>
          <Button
            disabled={!message.trim()}
            className="h-9 w-9 p-0 sm:h-10 sm:w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const t = useTranslations('messages');
  const [filter, setFilter] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return mockNotifications;
    if (filter === 'unread') return mockNotifications.filter(n => !n.read);
    return mockNotifications.filter(n => n.type === filter);
  }, [filter]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <MessageSquare className="h-4 w-4" />;
      case 'shipping':
        return <Clock className="h-4 w-4" />;
      case 'quality':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="font-semibold">
          {t('notifications.title')}
        </Typography>
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('notifications.filters.all')}
              </SelectItem>
              <SelectItem value="unread">
                {t('notifications.filters.unread')}
              </SelectItem>
              <SelectItem value="quote">
                {t('notifications.filters.quotes')}
              </SelectItem>
              <SelectItem value="shipping">
                {t('notifications.filters.shipping')}
              </SelectItem>
              <SelectItem value="quality">
                {t('notifications.filters.quality')}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            {t('notifications.markAllRead')}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredNotifications.map(notification => (
          <Card
            key={notification.id}
            className={cn(
              'cursor-pointer transition-colors hover:bg-gray-50',
              !notification.read && 'border-l-4 border-l-primary'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div
                  className={cn(
                    'mt-1',
                    getPriorityColor(notification.priority)
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <Typography
                      variant="small"
                      className={cn(
                        'font-medium',
                        !notification.read && 'font-semibold'
                      )}
                    >
                      {notification.title}
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {notification.timestamp}
                    </Typography>
                  </div>
                  <Typography
                    variant="muted"
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {notification.message}
                  </Typography>
                  <div className="mt-2 flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                    <Badge
                      variant={
                        notification.priority === 'high'
                          ? 'destructive'
                          : notification.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {notification.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SupportTickets() {
  const t = useTranslations('messages');
  const [filter, setFilter] = useState('all');

  const filteredTickets = useMemo(() => {
    if (filter === 'all') return mockTickets;
    return mockTickets.filter(ticket => ticket.status === filter);
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="font-semibold">
          {t('tickets.title')}
        </Typography>
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tickets.filters.all')}</SelectItem>
              <SelectItem value="open">{t('tickets.filters.open')}</SelectItem>
              <SelectItem value="in_progress">
                {t('tickets.filters.inProgress')}
              </SelectItem>
              <SelectItem value="resolved">
                {t('tickets.filters.resolved')}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('tickets.createNew')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map(ticket => (
          <Card
            key={ticket.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <Typography variant="small" className="font-medium">
                      {ticket.id}
                    </Typography>
                    <Badge className={getStatusColor(ticket.status)}>
                      {t(`tickets.status.${ticket.status}`)}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {t(`tickets.priority.${ticket.priority}`)}
                    </Badge>
                  </div>
                  <Typography variant="h4" className="mb-2 font-semibold">
                    {ticket.title}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="mb-4 text-muted-foreground"
                  >
                    {ticket.description}
                  </Typography>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{ticket.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{ticket.createdAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{ticket.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {ticket.responses} {t('tickets.responses')}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      {t('tickets.actions.view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {t('tickets.actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {t('tickets.actions.close')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const t = useTranslations('messages');
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title={t('title')}
          description={t('subtitle')}
          icon={MessageSquare}
        />

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">{t('tabs.chat')}</TabsTrigger>
            <TabsTrigger value="notifications">
              {t('tabs.notifications')}
            </TabsTrigger>
            <TabsTrigger value="tickets">{t('tabs.tickets')}</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="flex h-[500px] flex-col overflow-hidden sm:h-[600px] sm:flex-row">
              {/* Mobile: Show sidebar or chat window based on selection */}
              <div
                className={cn(
                  'flex-shrink-0 border-b sm:border-b-0 sm:border-r',
                  selectedConversation
                    ? 'hidden sm:flex sm:w-80'
                    : 'flex w-full sm:w-80'
                )}
              >
                <ChatSidebar
                  selectedConversation={selectedConversation}
                  onSelectConversation={setSelectedConversation}
                />
              </div>

              <div
                className={cn(
                  'min-w-0 flex-1',
                  selectedConversation ? 'flex' : 'hidden sm:flex'
                )}
              >
                <ChatWindow
                  conversationId={selectedConversation}
                  onBackToList={() => setSelectedConversation(null)}
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationsPanel />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <SupportTickets />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
