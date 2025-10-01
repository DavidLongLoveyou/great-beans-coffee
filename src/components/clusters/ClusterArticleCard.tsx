'use client';

import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { CoffeeButton } from '@/shared/components/design-system/Button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/shared/components/design-system/Card';

export interface ClusterArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  url: string;
  isFeatured?: boolean;
}

interface ClusterArticleCardProps {
  article: ClusterArticle;
  locale: string;
}

export function ClusterArticleCard({
  article,
  locale,
}: ClusterArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" hover className="h-full overflow-hidden">
      {/* Article Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {article.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-coffee-600 text-white">
            Featured
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute right-3 top-3 bg-white/90 text-coffee-800"
        >
          {article.category}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-coffee-800">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Article Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {article.readingTime}
            </div>
          </div>
        </div>

        {/* Author Information */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coffee-100">
            <span className="text-xs font-medium text-coffee-600">
              {article.author.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-coffee-800">
              {article.author.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {article.author.role}
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <Tag className="mr-1 h-3 w-3 text-muted-foreground" />
            {article.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardContent className="pt-0">
        <Link href={article.url} className="block">
          <CoffeeButton variant="ghost" size="sm" className="group w-full">
            Read Article
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
          </CoffeeButton>
        </Link>
      </CardContent>
    </Card>
  );
}
