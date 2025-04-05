import React from 'react';
import { Helmet } from 'react-helmet';

interface PersonStructuredDataProps {
  name: string;
  alternateName?: string;
  jobTitle: string;
  description: string;
  image: string;
  sameAs?: string[];
  url: string;
}

export const PersonStructuredData: React.FC<PersonStructuredDataProps> = ({
  name,
  alternateName,
  jobTitle,
  description,
  image,
  sameAs = [],
  url,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(alternateName && { alternateName }),
    jobTitle,
    description,
    image,
    sameAs,
    url,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface ImageGalleryStructuredDataProps {
  name: string;
  description: string;
  url: string;
  images: Array<{
    url: string;
    name: string;
    description: string;
    contentUrl: string;
  }>;
}

export const ImageGalleryStructuredData: React.FC<ImageGalleryStructuredDataProps> = ({
  name,
  description,
  url,
  images,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name,
    description,
    url,
    image: images.map(img => ({
      '@type': 'ImageObject',
      name: img.name,
      description: img.description,
      contentUrl: img.contentUrl,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

interface WebPageStructuredDataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export const WebPageStructuredData: React.FC<WebPageStructuredDataProps> = ({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
