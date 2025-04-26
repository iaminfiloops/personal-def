import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ImageObjectSchema from "@/components/SEO/ImageObjectSchema";

interface BlogImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  caption?: string;
  credit?: string;
  author?: string;
}

/**
 * BlogImage component for optimized image loading with SEO enhancements
 * - Uses responsive images with srcset
 * - Includes structured data for better image SEO
 * - Supports captions and credits
 * - Handles loading and error states
 */
const BlogImage = ({
  src,
  alt,
  title,
  className,
  width = 800,
  height = 500,
  priority = false,
  caption,
  credit,
  author = "Ajitesh Mondal",
}: BlogImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate responsive image URLs if the image is from Supabase storage
  const getResponsiveUrls = () => {
    if (!src || !src.includes('supabase.co/storage/v1/object/public')) {
      return null;
    }
    
    try {
      // Extract base path without extension
      const urlParts = src.split('/');
      const filename = urlParts[urlParts.length - 1];
      const basePath = src.substring(0, src.length - filename.length);
      const nameWithoutExt = filename.split('.')[0];
      
      // Check if optimized version exists
      const optimizedPath = `${basePath}optimized_${nameWithoutExt}.webp`;
      
      // Create srcset with different sizes
      const sizes = [300, 600, 900, 1200];
      const srcSet = sizes.map(size => 
        `${basePath}optimized_${nameWithoutExt}_${size}w.webp ${size}w`
      ).join(', ');
      
      return {
        optimizedSrc: optimizedPath,
        srcSet
      };
    } catch (error) {
      console.error('Error generating responsive URLs:', error);
      return null;
    }
  };
  
  const responsiveUrls = getResponsiveUrls();
  
  return (
    <>
      {/* Add structured data for the image */}
      <ImageObjectSchema
        name={title || alt}
        contentUrl={src}
        description={alt}
        caption={caption}
        creator={author}
        creditText={credit}
        copyrightNotice={`© ${new Date().getFullYear()} ${author}`}
      />
      
      <figure className={cn("relative", className)}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={responsiveUrls?.optimizedSrc || src}
            srcSet={responsiveUrls?.srcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            alt={alt}
            title={title || alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            className={cn(
              "w-full h-auto transition-opacity duration-300 rounded-lg",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              console.error(`Failed to load image: ${src}`);
              setError(true);
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-blog.jpg';
            }}
          />
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
          )}
        </div>
        
        {(caption || credit) && (
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {caption && <p>{caption}</p>}
            {credit && <p className="text-xs mt-1">Credit: {credit}</p>}
          </figcaption>
        )}
      </figure>
    </>
  );
};

export default BlogImage;
