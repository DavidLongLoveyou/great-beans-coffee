import { cn } from '@/lib/utils';

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function ContentSection({ children, className, id }: ContentSectionProps) {
  return (
    <section id={id} className={cn('py-8 md:py-12 lg:py-16', className)}>
      {children}
    </section>
  );
}