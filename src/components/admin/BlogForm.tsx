import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

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
  image_url?: string;  // Thumbnail image URL
  images?: Array<{id: string; url: string; alt: string; title: string}>;  // Gallery images
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
  const [thumbnailImage, setThumbnailImage] = useState<ImageFile | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");

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

  // Watch content field for preview
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.content) {
        setEditorContent(value.content);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

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
          
          setEditorContent(data.content || "");

          // Set thumbnail image if it exists
          if (data.image_url) {
            setFeaturedImage(data.image_url);
          }

          // Fetch gallery images if they exist
          if (data.images && Array.isArray(data.images)) {
            const blogImages: ImageFile[] = data.images.map((img:any) => ({
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
      let thumbnailImageUrl = featuredImage;
      
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
            
            // Get public URL using the correct storage URL format
            const { data: urlData } = supabase.storage
              .from('blog')
              .getPublicUrl(filePath);
            
            // Get the actual public URL
            const storageUrl = urlData.publicUrl;
            
            // Update image with new URL
            uploadedImages[i] = {
              ...uploadedImages[i],
              url: storageUrl,
              isUploading: false,
              isNew: false
            };
            
            // If this was the featured image, update the thumbnail URL
            if (featuredImage === image.url) {
              thumbnailImageUrl = storageUrl;
              setFeaturedImage(storageUrl);
            }
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
      
      // Prepare image data for storage (gallery images)
      const imageData = uploadedImages.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        title: img.title
      }));

      // Prepare the submission data with image fields
      const submissionData: BlogPost = {
        title: values.title,
        category: values.category,
        status: values.status,
        content: values.content,
        date: new Date().toISOString(),
        author_id: user?.id || "",
        image_url: thumbnailImageUrl,  // Use the updated thumbnail URL
        images: imageData,        // These are the gallery images
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

  // Text formatting helper functions
  const insertTextAtCursor = (textToInsert: string, surroundSelection: boolean = false) => {
    const textArea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    
    if (!textArea) return;
    
    const startPos = textArea.selectionStart;
    const endPos = textArea.selectionEnd;
    const selectedText = textArea.value.substring(startPos, endPos);
    
    let newText;
    let newCursorPos;
    
    if (surroundSelection && selectedText) {
      // Wrap the selected text
      newText = textArea.value.substring(0, startPos) + textToInsert.replace('%s', selectedText) + textArea.value.substring(endPos);
      newCursorPos = startPos + newText.length - textArea.value.length + endPos;
    } else {
      // Just insert text at cursor
      newText = textArea.value.substring(0, startPos) + textToInsert + textArea.value.substring(endPos);
      newCursorPos = startPos + textToInsert.length;
    }
    
    // Update the form value
    form.setValue('content', newText, { shouldValidate: true, shouldDirty: true });
    
    // Set focus back to textarea and set cursor position
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBold = () => {
    insertTextAtCursor('**%s**', true);
  };

  const formatItalic = () => {
    insertTextAtCursor('*%s*', true);
  };

  const formatHeading1 = () => {
    insertTextAtCursor('\n# %s\n', true);
  };

  const formatHeading2 = () => {
    insertTextAtCursor('\n## %s\n', true);
  };

  const formatUnorderedList = () => {
    insertTextAtCursor('\n- Item 1\n- Item 2\n- Item 3\n');
  };

  const formatOrderedList = () => {
    insertTextAtCursor('\n1. Item 1\n2. Item 2\n3. Item 3\n');
  };

  const formatQuote = () => {
    insertTextAtCursor('\n> %s\n', true);
  };

  const formatCode = () => {
    insertTextAtCursor('\n```\n%s\n```\n', true);
  };

  const insertLink = () => {
    insertTextAtCursor('[Link text](https://example.com)');
  };

  const insertImageMarkdown = () => {
    insertTextAtCursor('![Alt text](https://example.com/image.jpg)');
  };

  // Convert markdown to HTML for preview
  const markdownToHtml = (markdown: string) => {
    // Simple converter for preview
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+)<\/li>/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\n<ul>/g, '')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+)<\/li>/g, '<ol><li>$1</li></ol>')
      .replace(/<\/ol>\n<ol>/g, '')
      // Blockquotes
      .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    return `<div class="prose prose-sm"><p>${html}</p></div>`;
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
                          <div>
                            <Tabs defaultValue="write" className="w-full">
                              <div className="flex justify-between items-center mb-2">
                                <TabsList>
                                  <TabsTrigger value="write">Write</TabsTrigger>
                                  <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>
                                
                                <div className="flex items-center space-x-1 border rounded-md p-1">
                                  <Toggle onClick={formatBold} aria-label="Bold">
                                    <Bold size={16} />
                                  </Toggle>
                                  <Toggle onClick={formatItalic} aria-label="Italic">
                                    <Italic size={16} />
                                  </Toggle>
                                  <Separator orientation="vertical" className="h-6" />
                                  <Toggle onClick={formatHeading1} aria-label="Heading 1">
                                    <Heading1 size={16} />
                                  </Toggle>
                                  <Toggle onClick={formatHeading2} aria-label="Heading 2">
                                    <Heading2 size={16} />
                                  </Toggle>
                                  <Separator orientation="vertical" className="h-6" />
                                  <Toggle onClick={formatUnorderedList} aria-label="Bullet List">
                                    <List size={16} />
                                  </Toggle>
                                  <Toggle onClick={formatOrderedList} aria-label="Numbered List">
                                    <ListOrdered size={16} />
                                  </Toggle>
                                  <Separator orientation="vertical" className="h-6" />
                                  <Toggle onClick={formatQuote} aria-label="Quote">
                                    <Quote size={16} />
                                  </Toggle>
                                  <Toggle onClick={formatCode} aria-label="Code">
                                    <Code size={16} />
                                  </Toggle>
                                  <Toggle onClick={insertLink} aria-label="Link">
                                    <LinkIcon size={16} />
                                  </Toggle>
                                  <Toggle onClick={insertImageMarkdown} aria-label="Image">
                                    <ImageIcon size={16} />
                                  </Toggle>
                                </div>
                              </div>
                              
                              <TabsContent value="write" className="mt-0">
                                <FormControl>
                                  <Textarea 
                                    placeholder="Write your blog post content here..." 
                                    className="min-h-[300px] font-mono text-sm"
                                    {...field} 
                                  />
                                </FormControl>
                              </TabsContent>
                              
                              <TabsContent value="preview" className="mt-0">
                                <div 
                                  className="min-h-[300px] border rounded-md p-4 overflow-auto"
                                  dangerouslySetInnerHTML={{ __html: markdownToHtml(editorContent) }}
                                />
                              </TabsContent>
                            </Tabs>
                            
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">
                                Use Markdown for formatting. You can use the toolbar above or type directly.
                              </p>
                              <div className="mt-1 text-xs text-muted-foreground grid grid-cols-2 gap-2">
                                <div>
                                  <code># Heading 1</code> - Heading 1<br />
                                  <code>## Heading 2</code> - Heading 2<br />
                                  <code>**Bold**</code> - <strong>Bold</strong><br />
                                  <code>*Italic*</code> - <em>Italic</em>
                                </div>
                                <div>
                                  <code>- Item</code> - Bullet list<br />
                                  <code>1. Item</code> - Numbered list<br />
                                  <code>&#x3E; Quote</code> - Blockquote<br />
                                  <code>```code```</code> - Code block
                                </div>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label>Gallery Images</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload images for your blog post gallery. The selected featured image will be used as the thumbnail.
                      </p>
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
                        <Label>Featured Image (Thumbnail)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Select one image as the featured image. This will be used as the blog post thumbnail.
                        </p>
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