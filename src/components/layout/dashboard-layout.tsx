'use client';

import {
  LayoutDashboard,
  FileText,
  Package,
  BarChart3,
  User,
  FileStack,
  Calculator,
  MessageSquare,
  Menu,
  LogOut,
  Settings,
  Bell,
  Search,
  Coffee,
} from '@/components/ui/icons';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/presentation/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Coffee,
    badge: null,
  },
  {
    title: 'Quotes',
    href: '/dashboard/quotes',
    icon: FileText,
    badge: '3',
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: Package,
    badge: null,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    badge: null,
  },
  {
    title: 'Documents',
    href: '/dashboard/documents',
    icon: FileStack,
    badge: null,
  },
  {
    title: 'Logistics',
    href: '/dashboard/logistics',
    icon: Calculator,
    badge: null,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: '2',
  },
  {
    title: 'Account',
    href: '/dashboard/account',
    icon: User,
    badge: null,
  },
];

function DashboardSidebar({ className }: { className?: string }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full flex-col border-r bg-white', className)}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 sm:h-16 sm:px-6">
        <Link href="/dashboard" className="flex items-center">
          <div className="h-8 w-28 sm:h-10 sm:w-32">
            <Image
              src="/images/logo.svg"
              alt="The Great Beans Coffee"
              width={128}
              height={40}
              className="h-full w-full object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 px-3 py-4"
        aria-label="Dashboard navigation"
      >
        {navigationItems.map(item => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-[44px] touch-manipulation items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80'
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">
                  {t(`navigation.${item.title.toLowerCase()}`)}
                </span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto min-h-[44px] w-full justify-start px-3 py-3"
            >
              <Avatar className="mr-3 h-8 w-8 flex-shrink-0">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="w-full truncate text-sm font-medium">
                  John Doe
                </span>
                <span className="w-full truncate text-xs text-muted-foreground">
                  Coffee Buyer
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="min-h-[44px] cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="min-h-[44px] cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function DashboardHeader() {
  const t = useTranslations('dashboard');

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-3 sm:h-16 sm:px-4 lg:px-6">
      {/* Mobile menu */}
      <div className="flex items-center lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>

        {/* Mobile logo */}
        <Link href="/dashboard" className="ml-3 flex items-center lg:hidden">
          <div className="h-6 w-20 sm:h-8 sm:w-24">
            <Image
              src="/images/logo.svg"
              alt="The Great Beans Coffee"
              width={96}
              height={32}
              className="h-full w-full object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>
      </div>

      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div className="hidden flex-1 items-center justify-center px-4 sm:flex lg:justify-start lg:px-6">
        <div className="w-full max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search.placeholder')}
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Mobile search button */}
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 sm:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0 sm:h-auto sm:w-auto sm:p-2"
          onClick={() => {
            // Navigate to notifications or messages page
            window.location.href = '/dashboard/messages';
          }}
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 lg:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
