import React from 'react';
import { Helmet } from 'react-helmet';

interface BlogPostSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
  category?: string;
  tags?: string[];
}

/**
 * BlogPostSchema component for adding structured data to blog posts
 * Implements Schema.org BlogPosting schema for better SEO
 */
const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogo,
  category,
  tags = [],
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: imageUrl,
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
    ...(category && { articleSection: category }),
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default BlogPostSchema;
