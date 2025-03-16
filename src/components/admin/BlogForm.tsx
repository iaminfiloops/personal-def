
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

// Validation schema
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type BlogFormValues = z.infer<typeof blogPostSchema>;

const BlogForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

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

      const submissionData = {
        ...values,
        date: new Date().toISOString(),
        author_id: user?.id,
      };

      if (isEditMode && id) {
        // Update existing blog post
        const { error } = await supabase
          .from("blog_posts")
          .update(values)
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
          .insert([submissionData]);

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
                              <Input placeholder="e.g. Entrepreneurship, Investment" {...field} />
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
                              <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                                {...field}
                              >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                              </select>
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
                              placeholder="Enter blog post content..."
                              className="resize-y min-h-[300px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/blog")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-accent hover:bg-accent/90 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
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
