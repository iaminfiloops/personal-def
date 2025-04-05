import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  onClick?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  loading = "lazy",
  priority = false,
  onClick,
  ...props
}: OptimizedImageProps & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate responsive image paths
  const generateSrcSet = () => {
    if (!src) return "";
    
    // Extract file extension and base path
    const lastDot = src.lastIndexOf('.');
    const basePath = src.substring(0, lastDot);
    const extension = src.substring(lastDot);
    
    // Generate srcset with multiple sizes
    return `
      ${basePath}-300w${extension} 300w,
      ${basePath}-600w${extension} 600w,
      ${basePath}-900w${extension} 900w,
      ${src} 1200w
    `;
  };

  useEffect(() => {
    // Preload image if priority is true
    if (priority && src) {
      const img = new Image();
      img.src = src;
    }
  }, [priority, src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : loading}
        sizes={sizes}
        srcSet={generateSrcSet()}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          error ? "hidden" : "block"
        )}
        {...props}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-sm text-muted-foreground">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
