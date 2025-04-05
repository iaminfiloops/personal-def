import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
}

/**
 * LazyImage component for optimized image loading
 * - Uses IntersectionObserver for lazy loading
 * - Provides placeholder while loading
 * - Supports priority loading for above-the-fold images
 */
const LazyImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "blur",
  onLoad,
  ...props
}: LazyImageProps & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [imgSrc, setImgSrc] = useState(priority ? src : "");

  useEffect(() => {
    // Skip if priority loading is enabled
    if (priority) {
      setImgSrc(src);
      return;
    }

    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        setImgSrc(src);
        observer.disconnect();
      }
    }, {
      rootMargin: "200px", // Start loading when image is 200px from viewport
      threshold: 0.01
    });

    // Get current element reference
    const element = document.querySelector(`[data-img-src="${src}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
      data-img-src={src}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          {...props}
        />
      )}
      
      {(!isLoaded || !isVisible) && placeholder === "blur" && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
