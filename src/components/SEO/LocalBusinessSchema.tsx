import React from 'react';
import { Helmet } from 'react-helmet';

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  sameAs?: string[];
  openingHours?: string[];
  priceRange?: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name,
  description,
  url,
  logo,
  telephone,
  email,
  address,
  geo,
  sameAs = [],
  openingHours = [],
  priceRange,
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    logo,
    telephone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    sameAs,
    ...(openingHours.length > 0 && { openingHoursSpecification: openingHours }),
    ...(priceRange && { priceRange }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
