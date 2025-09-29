import { useMDXComponent } from 'next-contentlayer2/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

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
  
  // Custom heading components with anchor links
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-5 mb-2" {...props}>
      {children}
    </h3>
  ),
  
  // Custom paragraph with better spacing
  p: ({ children, ...props }: any) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  
  // Custom list components
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  
  // Custom blockquote
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-amber-500 pl-4 py-2 my-4 bg-amber-50 text-gray-700 italic" {...props}>
      {children}
    </blockquote>
  ),
  
  // Custom code blocks
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4 text-sm" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  
  // Custom table components
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-gray-200 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-2 text-gray-700 border-b border-gray-200" {...props}>
      {children}
    </td>
  ),
  
  // Custom image component
  img: ({ src, alt, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className="rounded-lg shadow-md max-w-full h-auto mb-4" 
      {...props} 
    />
  ),
  
  // Custom link component
  a: ({ href, children, ...props }: any) => (
    <a 
      href={href} 
      className="text-amber-600 hover:text-amber-700 underline" 
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  
  // Custom horizontal rule
  hr: ({ ...props }: any) => (
    <hr className="border-gray-300 my-8" {...props} />
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