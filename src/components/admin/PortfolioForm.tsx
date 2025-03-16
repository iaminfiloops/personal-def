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
import ImageUploader, { ImageFile } from "./ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Validation schema
const portfolioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  year: z.number().min(1900, "Year must be at least 1900"),
  status: z.string().min(1, "Status is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface PortfolioCompany {
  id?: string;
  name: string;
  type: string;
  year: number;
  status: string;
  description: string;
  logo_url: string;
  gallery_images?: Array<{id: string; url: string; alt: string; title: string}>;
  created_at?: string;
  updated_at: string;
}

const PortfolioForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [logoImage, setLogoImage] = useState<ImageFile | null>(null);
  const [galleryImages, setGalleryImages] = useState<ImageFile[]>([]);

  // Initialize the form
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: "",
      type: "",
      year: new Date().getFullYear(),
      status: "Active",
      description: "",
    },
  });

  // Fetch company data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("portfolio_companies")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching company:", error);
          toast({
            title: "Error",
            description: "Could not fetch company details. Please try again.",
            variant: "destructive",
          });
          navigate("/admin/portfolio");
          return;
        }

        if (data) {
          console.log("Fetched company:", data);
          // Set form values
          form.reset({
            name: data.name,
            type: data.type || "",
            year: data.year || new Date().getFullYear(),
            status: data.status || "Active",
            description: data.description || "",
          });

          // Set logo image
          if (data.logo_url) {
            setLogoImage({
              id: crypto.randomUUID(),
              url: data.logo_url,
              alt: data.name,
              title: data.name,
              isUploading: false
            });
          }

          // Fetch gallery images if they exist
          if (data.gallery_images && Array.isArray(data.gallery_images)) {
            // Use type assertion to handle the gallery_images property
            const galleryData = (data as any).gallery_images;
            const galleryImgs: ImageFile[] = galleryData.map((img: any) => ({
              id: img.id || crypto.randomUUID(),
              url: img.url,
              alt: img.alt || "",
              title: img.title || "",
              isUploading: false
            }));
            setGalleryImages(galleryImgs);
          }
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id, isEditMode, navigate, toast, form]);

  const onSubmit = async (values: PortfolioFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting form with values:", values);

      // Handle logo upload
      let logoUrl = "";
      if (logoImage && logoImage.file) {
        const fileExt = logoImage.file.name.split('.').pop();
        const filePath = `logos/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(filePath, logoImage.file);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from("portfolio")
          .getPublicUrl(filePath);
          
        logoUrl = urlData.publicUrl;
      } else if (logoImage) {
        logoUrl = logoImage.url;
      }

      // Upload gallery images
      const uploadedGalleryImages = [...galleryImages];
      
      // Process each gallery image that needs to be uploaded
      for (let i = 0; i < uploadedGalleryImages.length; i++) {
        const image = uploadedGalleryImages[i];
        
        if (image.isNew && image.file) {
          // Update status to uploading
          uploadedGalleryImages[i] = { ...uploadedGalleryImages[i], isUploading: true };
          setGalleryImages([...uploadedGalleryImages]); // Update UI
          
          try {
            // Create a unique file path
            const fileExt = image.file.name.split('.').pop();
            const filePath = `gallery/${crypto.randomUUID()}.${fileExt}`;
            
            // Upload to Supabase storage
            const { error } = await supabase.storage
              .from("portfolio")
              .upload(filePath, image.file);
            
            if (error) throw error;
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from("portfolio")
              .getPublicUrl(filePath);
            
            // Update image with new URL
            uploadedGalleryImages[i] = {
              ...uploadedGalleryImages[i],
              url: urlData.publicUrl,
              isUploading: false,
              isNew: false
            };
          } catch (error) {
            console.error("Error uploading image:", error);
            // Mark as failed but keep in list
            uploadedGalleryImages[i] = {
              ...uploadedGalleryImages[i],
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
      
      // Prepare gallery image data for storage
      const galleryData = uploadedGalleryImages.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        title: img.title
      }));

      // Prepare the submission data with image fields
      const submissionData: any = {
        name: values.name,
        type: values.type,
        year: values.year,
        status: values.status,
        description: values.description,
        logo_url: logoUrl,
        gallery_images: galleryData,
        updated_at: new Date().toISOString()
      };

      if (isEditMode && id) {
        // Update existing company
        const { error } = await supabase
          .from("portfolio_companies")
          .update(submissionData)
          .eq("id", id);

        if (error) {
          console.error("Error updating company:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Company updated successfully",
        });
      } else {
        // Create new company with created_at timestamp
        const newCompany: any = {
          ...submissionData,
          created_at: new Date().toISOString()
        };
        
        // Insert the new company
        const { error } = await supabase
          .from("portfolio_companies")
          .insert([newCompany]);

        if (error) {
          console.error("Error creating company:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Company created successfully",
        });
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      
      // Navigate back to portfolio list
      navigate("/admin/portfolio");
    } catch (error: any) {
      console.error("Error saving company:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (newImages: ImageFile[]) => {
    if (newImages.length > 0) {
      setLogoImage(newImages[0]);
    } else {
      setLogoImage(null);
    }
  };

  const handleGalleryChange = (newImages: ImageFile[]) => {
    setGalleryImages(newImages);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 max-w-3xl">
      <button
        onClick={() => navigate("/admin/portfolio")}
        className="text-accent hover:text-accent/80 inline-flex items-center mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Portfolio
      </button>

      <h1 className="text-3xl font-semibold mb-6">
        {isEditMode ? "Edit Company" : "Add New Company"}
      </h1>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type*</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Founder">Founder</SelectItem>
                            <SelectItem value="Investor">Investor</SelectItem>
                            <SelectItem value="Advisor">Advisor</SelectItem>
                            <SelectItem value="Partner">Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founding Year*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g. 2020" 
                          min={1900} 
                          max={new Date().getFullYear()} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="In Development">In Development</SelectItem>
                            <SelectItem value="Acquired">Acquired</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Company Logo</Label>
                <ImageUploader
                  images={logoImage ? [logoImage] : []}
                  onChange={handleLogoChange}
                  bucketName="portfolio"
                  folderPath="logos"
                  maxImages={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload multiple images to showcase the company's products, services, or team.
                </p>
                <ImageUploader
                  images={galleryImages}
                  onChange={handleGalleryChange}
                  bucketName="portfolio"
                  folderPath="gallery"
                  maxImages={20}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a description of the company" 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/portfolio")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update Company" : "Create Company"}</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioForm;
