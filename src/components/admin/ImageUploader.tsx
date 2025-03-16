import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  alt: string;
  title: string;
  isUploading: boolean;
  isNew?: boolean;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  bucketName: string;
  folderPath: string;
  maxImages?: number;
}

const ImageUploader = ({
  images,
  onChange,
  bucketName,
  folderPath,
  maxImages = 10
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the max limit
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    const newImages: ImageFile[] = [...images];

    // Process each file
    Array.from(files).forEach((file) => {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed.",
          variant: "destructive",
        });
        return;
      }

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Add to images array
      newImages.push({
        id: uuidv4(),
        file,
        url: previewUrl,
        alt: file.name.split(".")[0],
        title: file.name.split(".")[0],
        isUploading: false,
        isNew: true
      });
    });

    onChange(newImages);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    onChange(updatedImages);
  };

  const handleAltChange = (id: string, alt: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, alt } : img
    );
    onChange(updatedImages);
  };

  const handleTitleChange = (id: string, title: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, title } : img
    );
    onChange(updatedImages);
  };

  const uploadImages = async (): Promise<ImageFile[]> => {
    const updatedImages = [...images];
    
    // Find images that need to be uploaded
    const imagesToUpload = updatedImages.filter(img => img.isNew && img.file);
    
    if (imagesToUpload.length === 0) return updatedImages;
    
    // Upload each image
    for (const image of imagesToUpload) {
      if (!image.file) continue;
      
      // Update status to uploading
      const index = updatedImages.findIndex(img => img.id === image.id);
      updatedImages[index] = { ...updatedImages[index], isUploading: true };
      onChange(updatedImages);
      
      try {
        // Create a unique file path
        const fileExt = image.file.name.split('.').pop();
        const filePath = `${folderPath}/${uuidv4()}.${fileExt}`;
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, image.file);
        
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        
        // Update image with new URL
        updatedImages[index] = {
          ...updatedImages[index],
          url: urlData.publicUrl,
          isUploading: false,
          isNew: false
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        // Mark as failed but keep in list
        updatedImages[index] = {
          ...updatedImages[index],
          isUploading: false
        };
        
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    onChange(updatedImages);
    return updatedImages;
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.isNew && image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <h3 className="font-medium">Click or drag images here</h3>
          <p className="text-sm text-muted-foreground">
            Support for JPG, PNG or WebP up to 5MB
          </p>
          {images.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {images.length} of {maxImages} images selected
            </p>
          )}
        </div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Selected Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="border rounded-md p-3 relative"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-20 h-20 bg-secondary/30 rounded-md overflow-hidden flex-shrink-0">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor={`alt-${image.id}`} className="text-xs">
                        Alt Text (for accessibility)
                      </Label>
                      <Input
                        id={`alt-${image.id}`}
                        value={image.alt}
                        onChange={(e) => handleAltChange(image.id, e.target.value)}
                        className="h-8 text-sm"
                        placeholder="Describe the image"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`title-${image.id}`} className="text-xs">
                        Title (for SEO)
                      </Label>
                      <Input
                        id={`title-${image.id}`}
                        value={image.title}
                        onChange={(e) => handleTitleChange(image.id, e.target.value)}
                        className="h-8 text-sm"
                        placeholder="Image title"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => handleRemoveImage(image.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
                {image.isUploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { ImageUploader };
export type { ImageFile };
export default ImageUploader;
