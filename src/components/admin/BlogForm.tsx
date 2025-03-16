import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import ImageUploader, { ImageFile } from "./ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Validation schema
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

interface BlogPost {
  id?: string;
  title: string;
  category: string;
  status: string;
  content: string;
  date: string;
  author_id: string;
  created_at?: string;
  updated_at?: string;
}

const BlogForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>("");

  // Initialize the form
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      category: "",
      status: "Draft",
      content: "",
    },
  });

  // Fetch blog post data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching blog post:", error);
          toast({
            title: "Error",
            description: "Could not fetch blog post details. Please try again.",
            variant: "destructive",
          });
          navigate("/admin/blog");
          return;
        }

        if (data) {
          console.log("Fetched blog post:", data);
          // Set form values
          form.reset({
            title: data.title,
            category: data.category || "",
            status: data.status || "Draft",
            content: data.content || "",
          });

          // Set featured image if it exists in metadata
          if (data.image_url) {
            setFeaturedImage(data.image_url);
          }

          // Fetch additional images if they exist in metadata
          if (data.images && Array.isArray(data.images)) {
            const blogImages: ImageFile[] = data.images.map((img: any) => ({
              id: img.id || crypto.randomUUID(),
              url: img.url,
              alt: img.alt || "",
              title: img.title || "",
              isUploading: false
            }));
            setImages(blogImages);
          }
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, isEditMode, navigate, toast, form]);

  const onSubmit = async (values: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form with values:", values);

      // Upload all images that need to be uploaded
      const uploadedImages = [...images];
      
      // Find images that need to be uploaded (have file property)
      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];
        
        if (image.isNew && image.file) {
          // Update status to uploading
          uploadedImages[i] = { ...uploadedImages[i], isUploading: true };
          setImages([...uploadedImages]); // Update UI
          
          try {
            // Create a unique file path
            const fileExt = image.file.name.split('.').pop();
            const filePath = `posts/${crypto.randomUUID()}.${fileExt}`;
            
            // Upload to Supabase storage
            const { error } = await supabase.storage
              .from("blog")
              .upload(filePath, image.file);
            
            if (error) throw error;
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from("blog")
              .getPublicUrl(filePath);
            
            // Update image with new URL
            uploadedImages[i] = {
              ...uploadedImages[i],
              url: urlData.publicUrl,
              isUploading: false,
              isNew: false
            };
          } catch (error) {
            console.error("Error uploading image:", error);
            // Mark as failed but keep in list
            uploadedImages[i] = {
              ...uploadedImages[i],
              isUploading: false
            };
            
            toast({
              title: "Upload failed",
              description: "Failed to upload image. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
      
      // Prepare image data for storage
      const imageData = uploadedImages.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        title: img.title
      }));

      // Get the featured image (first image or existing one)
      const mainImage = featuredImage || (uploadedImages.length > 0 ? uploadedImages[0].url : "");

      // Store image metadata separately
      const imageMetadata = {
        image_url: mainImage,
        images: imageData
      };

      // Prepare the submission data with only fields that exist in the database
      const submissionData: BlogPost = {
        title: values.title,
        category: values.category,
        status: values.status,
        content: values.content,
        date: new Date().toISOString(),
        author_id: user?.id || "",
        updated_at: new Date().toISOString()
      };

      if (isEditMode && id) {
        // Update existing blog post
        const { error } = await supabase
          .from("blog_posts")
          .update(submissionData)
          .eq("id", id);

        if (error) {
          console.error("Error updating blog post:", error);
          throw error;
        }

        // Update image metadata in a separate table or field if needed
        // This would depend on your database structure
        
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        // Create new blog post
        const { error } = await supabase
          .from("blog_posts")
          .insert([{
            ...submissionData,
            created_at: new Date().toISOString()
          }]);

        if (error) {
          console.error("Error creating blog post:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      
      // Navigate back to blog list
      navigate("/admin/blog");
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (newImages: ImageFile[]) => {
    setImages(newImages);
    
    // If there's no featured image set and we have images, set the first one as featured
    if (!featuredImage && newImages.length > 0) {
      setFeaturedImage(newImages[0].url);
    }
  };

  const handleFeaturedImageChange = (imageUrl: string) => {
    setFeaturedImage(imageUrl);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <button
            onClick={() => navigate("/admin/blog")}
            className="text-accent hover:text-accent/80 inline-flex items-center mb-6"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Blog Posts
          </button>

          <h1 className="text-3xl font-semibold mb-6">
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter blog post title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category*</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                                  <SelectItem value="Social Impact">Social Impact</SelectItem>
                                  <SelectItem value="Investment">Investment</SelectItem>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                  <SelectItem value="Leadership">Leadership</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status*</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Draft">Draft</SelectItem>
                                  <SelectItem value="Published">Published</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content*</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your blog post content here..." 
                              className="min-h-[300px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Images</Label>
                      <ImageUploader
                        images={images}
                        onChange={handleImageChange}
                        bucketName="blog"
                        folderPath="posts"
                        maxImages={10}
                      />
                    </div>

                    {images.length > 0 && (
                      <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {images.map((image) => (
                            <div 
                              key={image.id}
                              className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                                featuredImage === image.url 
                                  ? 'border-primary' 
                                  : 'border-transparent'
                              }`}
                              onClick={() => handleFeaturedImageChange(image.url)}
                            >
                              <img 
                                src={image.url} 
                                alt={image.alt} 
                                className="w-full h-24 object-cover"
                              />
                              {featuredImage === image.url && (
                                <div className="absolute top-1 right-1 bg-primary text-white text-xs px-2 py-1 rounded-full">
                                  Featured
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/blog")}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-accent hover:bg-accent/90 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            {isEditMode ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          isEditMode ? "Update Post" : "Create Post"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogForm;
