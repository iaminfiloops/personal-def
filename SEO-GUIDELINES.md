# SEO Guidelines for ajiteshmondal.com

This document outlines the SEO best practices implemented on the website and provides guidelines for maintaining and improving SEO performance.

## Table of Contents

1. [Image Optimization](#image-optimization)
2. [Blog Post SEO](#blog-post-seo)
3. [Structured Data](#structured-data)
4. [Sitemaps](#sitemaps)
5. [Meta Tags](#meta-tags)
6. [URL Structure](#url-structure)
7. [Performance Optimization](#performance-optimization)
8. [Maintenance Tasks](#maintenance-tasks)

## Image Optimization

### Naming Conventions

- Use descriptive, keyword-rich file names
- Separate words with hyphens (not underscores)
- Include relevant keywords that describe the image
- Example: `ajitesh-mondal-education-workshop-kolkata.jpg` instead of `IMG001.jpg`

### Alt Text Best Practices

- Always include alt text for all images
- Make alt text descriptive and include relevant keywords
- Keep alt text under 125 characters
- Be specific about what's in the image
- Example: `alt="Ajitesh Mondal conducting education workshop for underprivileged students in Kolkata"`

### Image Dimensions and Size

- Optimize images before uploading
- Use the BlogImage component for blog posts
- Recommended dimensions:
  - Featured images: 1200×630px
  - Gallery images: 800×600px
  - Thumbnails: 400×300px
- Maximum file size: 200KB for most images

### Responsive Images

- Use the responsive image components provided
- The system automatically generates different sizes for responsive display
- Include width and height attributes to prevent layout shifts

## Blog Post SEO

### Title Optimization

- Include primary keyword near the beginning
- Keep titles under 60 characters
- Make titles compelling and click-worthy
- Example: "How Ajitesh Mondal's Scholarship Program is Transforming Lives in Bengaluru"

### Meta Description

- Include primary and secondary keywords
- Keep descriptions between 120-155 characters
- Include a call-to-action when appropriate
- Make it compelling to improve click-through rates

### Content Structure

- Use proper heading hierarchy (H1, H2, H3)
- Include primary keyword in H1 (only one H1 per page)
- Include secondary keywords in H2 and H3 headings
- Break content into scannable sections
- Aim for 1000+ words for comprehensive coverage
- Include internal links to other relevant content

### Featured Images

- Always include a high-quality featured image
- Optimize the image with proper alt text and file name
- Use the BlogImage component for automatic structured data

## Structured Data

The website implements several structured data schemas:

### Blog Posts

- Uses BlogPostSchema component
- Implements Schema.org BlogPosting schema
- Includes author, publisher, dates, and category information

### Images

- Uses ImageObjectSchema component
- Implements Schema.org ImageObject schema
- Includes caption, credit, and copyright information

### Person

- Uses PersonStructuredData component
- Implements Schema.org Person schema
- Includes social profiles and biographical information

## Sitemaps

### XML Sitemap

- Located at `/sitemap.xml`
- Includes all important pages with proper priority settings
- Updated automatically during build process

### Image Sitemap

- Located at `/image-sitemap.xml`
- Includes all important images with titles and captions
- Generated automatically during build process
- Run `npm run generate-image-sitemap` to update manually

## Meta Tags

### Required Meta Tags

Every page should include:

- Title tag (unique for each page)
- Meta description
- Canonical URL
- Open Graph tags (title, description, image, type)
- Twitter Card tags (title, description, image)

### Example Implementation

```jsx
<Helmet>
  <title>Page Title | Ajitesh Mondal</title>
  <meta name="description" content="Page description here" />
  <link rel="canonical" href="https://www.ajiteshmondal.com/page-url" />
  
  {/* Open Graph tags */}
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Page description here" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.ajiteshmondal.com/page-url" />
  <meta property="og:image" content="https://www.ajiteshmondal.com/image.jpg" />
  
  {/* Twitter Card tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Page description here" />
  <meta name="twitter:image" content="https://www.ajiteshmondal.com/image.jpg" />
</Helmet>
```

## URL Structure

### Blog Posts

- Format: `/blog/[id]/[slug]`
- Example: `/blog/123/education-initiatives-kolkata`
- The slug is generated from the post title
- Keep URLs descriptive and keyword-rich

### Categories

- Format: `/blog/category/[category-name]`
- Example: `/blog/category/education-initiatives`
- Use hyphens to separate words
- Keep category names concise and descriptive

## Performance Optimization

### Image Loading

- Use lazy loading for images below the fold
- Use eager loading for critical above-the-fold images
- Implement responsive images with srcset and sizes attributes
- Use WebP format with fallbacks for better compression

### Core Web Vitals

- Optimize Largest Contentful Paint (LCP) by prioritizing above-the-fold images
- Minimize Cumulative Layout Shift (CLS) by specifying image dimensions
- Improve First Input Delay (FID) by optimizing JavaScript execution

## Maintenance Tasks

### Regular SEO Tasks

- Run `npm run seo` to optimize images and update sitemaps
- Submit sitemaps to Google Search Console monthly
- Monitor keyword rankings and adjust content strategy
- Check for broken links and fix them promptly
- Update meta descriptions for underperforming pages

### Before Deployment

- The build process automatically runs SEO optimization tasks
- Verify that all new images have proper alt text
- Ensure all new blog posts have proper meta tags
- Check structured data with Google's Rich Results Test

## Additional Resources

- [Google's SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/docs/gs.html)
- [Google Search Console](https://search.google.com/search-console)
- [Google's Rich Results Test](https://search.google.com/test/rich-results)
