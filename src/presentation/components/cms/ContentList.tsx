'use client';

import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Copy,
  Archive,
  Star,
  StarOff,
  Calendar,
  User,
  Globe,
  Search,
  Filter,
  Plus,
  BookOpen,
  TrendingUp,
  Coffee,
  Briefcase,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useMemo } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'blog' | 'market-report' | 'origin-story' | 'service';
  status: 'draft' | 'published' | 'archived';
  locale: string;
  author: string;
  category: string;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
  views?: number;
  excerpt: string;
  coverImage?: string;
}

interface ContentListProps {
  items: ContentItem[];
  onEdit?: (item: ContentItem) => void;
  onPreview?: (item: ContentItem) => void;
  onDelete?: (item: ContentItem) => void;
  onDuplicate?: (item: ContentItem) => void;
  onToggleFeatured?: (item: ContentItem) => void;
  onArchive?: (item: ContentItem) => void;
  onCreate?: (type: ContentItem['type']) => void;
  loading?: boolean;
}

const contentTypeIcons = {
  blog: BookOpen,
  'market-report': TrendingUp,
  'origin-story': Coffee,
  service: Briefcase,
};

const contentTypeLabels = {
  blog: 'Blog Post',
  'market-report': 'Market Report',
  'origin-story': 'Origin Story',
  service: 'Service',
};

type SortField = 'title' | 'publishedAt' | 'updatedAt' | 'views' | 'author';
type SortDirection = 'asc' | 'desc';

export function ContentList({
  items,
  onEdit,
  onPreview,
  onDelete,
  onDuplicate,
  onToggleFeatured,
  onArchive,
  onCreate,
  loading = false,
}: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocale, setSelectedLocale] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Get unique values for filters
  const uniqueTypes = Array.from(new Set(items.map(item => item.type)));
  const uniqueLocales = Array.from(new Set(items.map(item => item.locale)));
  const uniqueCategories = Array.from(
    new Set(items.map(item => item.category))
  );

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus;
      const matchesLocale =
        selectedLocale === 'all' || item.locale === selectedLocale;

      return matchesSearch && matchesType && matchesStatus && matchesLocale;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField] as string | number;
      let bValue: string | number = b[sortField] as string | number;

      if (sortField === 'publishedAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    items,
    searchQuery,
    selectedType,
    selectedStatus,
    selectedLocale,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <SortAsc className="h-3 w-3" />
    ) : (
      <SortDesc className="h-3 w-3" />
    );
  };

  const getStatusBadge = (status: ContentItem['status']) => {
    const variants = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">
            Manage your blog posts, market reports, origin stories, and service
            pages
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(contentTypeLabels).map(([type, label]) => {
              const IconComponent =
                contentTypeIcons[type as keyof typeof contentTypeIcons];
              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => onCreate?.(type as ContentItem['type'])}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {contentTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={selectedLocale} onValueChange={setSelectedLocale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {uniqueLocales.map(locale => (
                    <SelectItem key={locale} value={locale}>
                      {locale.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">View</label>
              <Tabs
                value={viewMode}
                onValueChange={value => setViewMode(value as 'table' | 'grid')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      {viewMode === 'table' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('title')}
                    className="h-auto p-0 font-semibold"
                  >
                    Title {getSortIcon('title')}
                  </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('author')}
                    className="h-auto p-0 font-semibold"
                  >
                    Author {getSortIcon('author')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('publishedAt')}
                    className="h-auto p-0 font-semibold"
                  >
                    Published {getSortIcon('publishedAt')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('updatedAt')}
                    className="h-auto p-0 font-semibold"
                  >
                    Updated {getSortIcon('updatedAt')}
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map(item => {
                const IconComponent = contentTypeIcons[item.type];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleFeatured?.(item)}
                              className="h-8 w-8 p-0"
                            >
                              {item.featured ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {item.featured
                              ? 'Remove from featured'
                              : 'Mark as featured'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.coverImage && (
                          <div className="h-10 w-16 overflow-hidden rounded bg-muted">
                            <img
                              src={item.coverImage}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">
                            /{item.locale}/{item.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">
                          {contentTypeLabels[item.type]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{item.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(item.updatedAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onPreview?.(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicate?.(item)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onArchive?.(item)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete?.(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedItems.map(item => {
            const IconComponent = contentTypeIcons[item.type];
            return (
              <Card key={item.id} className="overflow-hidden">
                {item.coverImage && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={item.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <Badge variant="outline" className="text-xs">
                        {contentTypeLabels[item.type]}
                      </Badge>
                      {item.featured && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onPreview?.(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate?.(item)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onArchive?.(item)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(item)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {item.locale.toUpperCase()}
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Updated {formatDate(item.updatedAt)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(
              currentPage * itemsPerPage,
              filteredAndSortedItems.length
            )}{' '}
            of {filteredAndSortedItems.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  page =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0"
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No content found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ||
                selectedType !== 'all' ||
                selectedStatus !== 'all' ||
                selectedLocale !== 'all'
                  ? 'Try adjusting your filters or search query.'
                  : 'Get started by creating your first piece of content.'}
              </p>
              {!searchQuery &&
                selectedType === 'all' &&
                selectedStatus === 'all' &&
                selectedLocale === 'all' && (
                  <Button className="mt-4" onClick={() => onCreate?.('blog')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Content
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
