'use client';

import { type ReactElement } from 'react';

// Type for structured data objects
type StructuredDataObject = Record<string, unknown>;

interface StructuredDataProps {
  data: StructuredDataObject | Array<StructuredDataObject>;
}

/**
 * Component for injecting JSON-LD structured data into the page head
 * Supports both single objects and arrays of structured data
 */
export function StructuredData({ data }: StructuredDataProps): ReactElement {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map(item => (
        <script
          key={`structured-data-${item['@type'] || 'unknown'}-${JSON.stringify(item).slice(0, 50)}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 2),
          }}
        />
      ))}
    </>
  );
}

export default StructuredData;
