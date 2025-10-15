'use client';

import {
  Save,
  Eye,
  EyeOff,
  FileText,
  Image,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';

import { Button } from '@/presentation/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Switch } from '@/presentation/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Textarea } from '@/presentation/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';

interface ContentMetadata {
  title: string;
  description: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  locale: string;
  category: string;
  featured: boolean;
  publishedAt: string;
  author: string;
  coverImage: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
}

interface ContentEditorProps {
  initialContent?: string;
  initialMetadata?: Partial<ContentMetadata>;
  contentType: 'blog' | 'market-report' | 'origin-story' | 'service';
  onSave: (content: string, metadata: ContentMetadata) => Promise<void>;
  onPreview?: (content: string, metadata: ContentMetadata) => void;
  isLoading?: boolean;
}

const defaultMetadata: ContentMetadata = {
  title: '',
  description: '',
  excerpt: '',
  seoTitle: '',
  seoDescription: '',
  keywords: [],
  locale: 'en',
  category: '',
  featured: false,
  publishedAt: new Date().toISOString().split('T')[0] as string,
  author: 'Admin',
  coverImage: '',
  slug: '',
  status: 'draft',
};

const toolbarButtons = [
  { icon: Bold, action: 'bold', tooltip: 'Bold (Ctrl+B)' },
  { icon: Italic, action: 'italic', tooltip: 'Italic (Ctrl+I)' },
  { icon: Heading1, action: 'h1', tooltip: 'Heading 1' },
  { icon: Heading2, action: 'h2', tooltip: 'Heading 2' },
  { icon: Heading3, action: 'h3', tooltip: 'Heading 3' },
  { icon: List, action: 'ul', tooltip: 'Bullet List' },
  { icon: ListOrdered, action: 'ol', tooltip: 'Numbered List' },
  { icon: Quote, action: 'quote', tooltip: 'Quote' },
  { icon: Code, action: 'code', tooltip: 'Code Block' },
  { icon: Link, action: 'link', tooltip: 'Insert Link' },
  { icon: Image, action: 'image', tooltip: 'Insert Image' },
];

export function ContentEditor({
  initialContent = '',
  initialMetadata = {},
  contentType: _contentType,
  onSave,
  onPreview,
  isLoading = false,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [metadata, setMetadata] = useState<ContentMetadata>({
    ...defaultMetadata,
    ...initialMetadata,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Auto-generate slug from title
  useEffect(() => {
    if (metadata.title && !metadata.slug) {
      const slug = metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setMetadata(prev => ({ ...prev, slug }));
    }
  }, [metadata.title, metadata.slug]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(
      content !== initialContent ||
        JSON.stringify(metadata) !==
          JSON.stringify({ ...defaultMetadata, ...initialMetadata })
    );
  }, [content, metadata, initialContent, initialMetadata]);

  const insertText = useCallback(
    (before: string, after: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newText =
        content.substring(0, start) +
        before +
        selectedText +
        after +
        content.substring(end);

      setContent(newText);

      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      // Focus and set cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [content, history, historyIndex]
  );

  const handleToolbarAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'bold':
          insertText('**', '**');
          break;
        case 'italic':
          insertText('*', '*');
          break;
        case 'h1':
          insertText('# ');
          break;
        case 'h2':
          insertText('## ');
          break;
        case 'h3':
          insertText('### ');
          break;
        case 'ul':
          insertText('- ');
          break;
        case 'ol':
          insertText('1. ');
          break;
        case 'quote':
          insertText('> ');
          break;
        case 'code':
          insertText('```\n', '\n```');
          break;
        case 'link':
          insertText('[', '](url)');
          break;
        case 'image':
          insertText('![alt text](', ')');
          break;
      }
    },
    [insertText]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousContent = history[historyIndex - 1];
      if (previousContent !== undefined) {
        setContent(previousContent);
      }
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextContent = history[historyIndex + 1];
      if (nextContent !== undefined) {
        setContent(nextContent);
      }
    }
  }, [history, historyIndex]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content, metadata);
      setHasUnsavedChanges(false);
    } catch (error) {
      // Error handling - could be logged to external service in production
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(content, metadata);
    }
    setShowPreview(!showPreview);
  };

  const updateMetadata = (
    key: keyof ContentMetadata,
    value: ContentMetadata[keyof ContentMetadata]
  ) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const addKeyword = (keyword: string) => {
    if (keyword && !metadata.keywords.includes(keyword)) {
      updateMetadata('keywords', [...metadata.keywords, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    updateMetadata(
      'keywords',
      metadata.keywords.filter(k => k !== keyword)
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {metadata.title || 'Untitled Content'}
          </h2>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 text-sm text-yellow-600">
              <AlertCircle className="h-3 w-3" />
              Unsaved changes
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Content Settings</DialogTitle>
                <DialogDescription>
                  Configure metadata and SEO settings for your content
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="publishing">Publishing</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={metadata.title}
                        onChange={e => updateMetadata('title', e.target.value)}
                        placeholder="Enter content title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={metadata.description}
                        onChange={e =>
                          updateMetadata('description', e.target.value)
                        }
                        placeholder="Brief description of the content"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={metadata.excerpt}
                        onChange={e =>
                          updateMetadata('excerpt', e.target.value)
                        }
                        placeholder="Short excerpt for previews"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="coverImage">Cover Image URL</Label>
                      <Input
                        id="coverImage"
                        value={metadata.coverImage}
                        onChange={e =>
                          updateMetadata('coverImage', e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={metadata.seoTitle}
                        onChange={e =>
                          updateMetadata('seoTitle', e.target.value)
                        }
                        placeholder="SEO optimized title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={metadata.seoDescription}
                        onChange={e =>
                          updateMetadata('seoDescription', e.target.value)
                        }
                        placeholder="SEO meta description"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={metadata.slug}
                        onChange={e => updateMetadata('slug', e.target.value)}
                        placeholder="url-friendly-slug"
                      />
                    </div>
                    <div>
                      <Label>Keywords</Label>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {metadata.keywords.map(keyword => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(keyword)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <Input
                        placeholder="Add keyword and press Enter"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addKeyword(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="publishing" className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="locale">Language</Label>
                      <Select
                        value={metadata.locale}
                        onValueChange={value => updateMetadata('locale', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="vi">Vietnamese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={metadata.category}
                        onChange={e =>
                          updateMetadata('category', e.target.value)
                        }
                        placeholder="Content category"
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={metadata.author}
                        onChange={e => updateMetadata('author', e.target.value)}
                        placeholder="Content author"
                      />
                    </div>
                    <div>
                      <Label htmlFor="publishedAt">Publish Date</Label>
                      <Input
                        id="publishedAt"
                        type="date"
                        value={metadata.publishedAt}
                        onChange={e =>
                          updateMetadata('publishedAt', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={metadata.featured}
                        onCheckedChange={checked =>
                          updateMetadata('featured', checked)
                        }
                      />
                      <Label htmlFor="featured">Featured Content</Label>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={metadata.status}
                        onValueChange={value => updateMetadata('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowSettings(false)}>
                  Save Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handlePreview}>
            {showPreview ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b p-2">
        <TooltipProvider>
          {toolbarButtons.map(({ icon: Icon, action, tooltip }) => (
            <Tooltip key={action}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToolbarAction(action)}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Editor Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <div className="border-b p-2">
            <span className="text-sm font-medium">Editor</span>
          </div>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your content in Markdown..."
            className="flex-1 resize-none border-0 focus-visible:ring-0"
            style={{ minHeight: '500px' }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 border-l">
            <div className="border-b p-2">
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="h-full overflow-auto p-4">
              <div className="prose prose-sm max-w-none">
                {/* This would be replaced with actual MDX rendering */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
