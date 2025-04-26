import React from 'react';
import { Helmet } from 'react-helmet';

interface ImageObjectSchemaProps {
  name: string;
  contentUrl: string;
  description?: string;
  caption?: string;
  creditText?: string;
  creator?: string;
  copyrightNotice?: string;
  license?: string;
  acquireLicensePage?: string;
}

/**
 * ImageObjectSchema component for adding structured data to images
 * Implements Schema.org ImageObject schema for better image SEO
 */
const ImageObjectSchema: React.FC<ImageObjectSchemaProps> = ({
  name,
  contentUrl,
  description,
  caption,
  creditText,
  creator,
  copyrightNotice,
  license,
  acquireLicensePage,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name,
    contentUrl,
    ...(description && { description }),
    ...(caption && { caption }),
    ...(creditText && { creditText }),
    ...(creator && { creator: {
      '@type': 'Person',
      name: creator
    }}),
    ...(copyrightNotice && { copyrightNotice }),
    ...(license && { license }),
    ...(acquireLicensePage && { acquireLicensePage }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default ImageObjectSchema;
