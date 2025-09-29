'use client';

import { type ReactElement } from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Component for injecting JSON-LD structured data into the page head
 * Supports both single objects and arrays of structured data
 */
export function StructuredData({ data }: StructuredDataProps): ReactElement {
  const jsonLd = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 2)
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;