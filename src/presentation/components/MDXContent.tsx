import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import type { ComponentProps } from 'react';

import { ConsumptionMap } from './charts/ConsumptionMap';
import { MarketChart } from './charts/MarketChart';
import { PriceAnalysis } from './charts/PriceAnalysis';
import { ImageGallery, VideoPlayer, MediaCarousel } from './multimedia';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface MDXContentProps {
  code: string;
}

// Custom components for MDX
const mdxComponents = {
  // Custom card component for callouts
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,

  // Chart components for data visualization
  MarketChart,
  ConsumptionMap,
  PriceAnalysis,

  // Multimedia components
  ImageGallery,
  VideoPlayer,
  MediaCarousel,

  // Custom heading components with anchor links
  h1: ({ children, ...props }: ComponentProps<'h1'>) => (
    <h1
      className="mb-4 mt-8 text-3xl font-bold text-gray-900 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentProps<'h2'>) => (
    <h2 className="mb-3 mt-6 text-2xl font-semibold text-gray-900" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps<'h3'>) => (
    <h3 className="mb-2 mt-5 text-xl font-semibold text-gray-900" {...props}>
      {children}
    </h3>
  ),

  // Custom paragraph with better spacing
  p: ({ children, ...props }: ComponentProps<'p'>) => (
    <p className="mb-4 leading-relaxed text-gray-700" {...props}>
      {children}
    </p>
  ),

  // Custom list components
  ul: ({ children, ...props }: ComponentProps<'ul'>) => (
    <ul
      className="mb-4 list-inside list-disc space-y-1 text-gray-700"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentProps<'ol'>) => (
    <ol
      className="mb-4 list-inside list-decimal space-y-1 text-gray-700"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentProps<'li'>) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),

  // Custom blockquote
  blockquote: ({ children, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote
      className="my-4 border-l-4 border-amber-500 bg-amber-50 py-2 pl-4 italic text-gray-700"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code blocks
  pre: ({ children, ...props }: ComponentProps<'pre'>) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }: ComponentProps<'code'>) => (
    <code
      className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm"
      {...props}
    >
      {children}
    </code>
  ),

  // Table components
  table: ({ children, ...props }: ComponentProps<'table'>) => (
    <div className="mb-4 overflow-x-auto">
      <table
        className="min-w-full rounded-lg border border-gray-200"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentProps<'thead'>) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: ComponentProps<'th'>) => (
    <th
      className="border-b border-gray-200 px-4 py-2 text-left font-semibold text-gray-900"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentProps<'td'>) => (
    <td className="border-b border-gray-200 px-4 py-2 text-gray-700" {...props}>
      {children}
    </td>
  ),

  // Image component
  img: ({ src, alt, width, height, ...props }: ComponentProps<'img'>) => {
    if (!src) return null;
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={600}
        className="mb-4 h-auto max-w-full rounded-lg shadow-md"
        {...props}
      />
    );
  },

  // Link component
  a: ({ href, children, ...props }: ComponentProps<'a'>) => (
    <a
      href={href}
      className="text-amber-600 underline hover:text-amber-700"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // Horizontal rule
  hr: ({ ...props }: ComponentProps<'hr'>) => (
    <hr className="my-8 border-gray-300" {...props} />
  ),
};

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx-content">
      <Component components={mdxComponents} />
    </div>
  );
}
