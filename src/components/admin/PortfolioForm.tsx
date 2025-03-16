
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

// Validation schema
const portfolioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  year: z.coerce.number().int().min(1900, "Year must be valid").max(new Date().getFullYear(), "Year cannot be in the future"),
  status: z.string().min(1, "Status is required"),
  description: z.string().optional(),
  logo_url: z.string().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

interface Company {
  id?: string;
  name: string;
  type: string;
  year: number;
  status: string;
  description?: string;
  logo_url?: string;
}

const PortfolioForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Initialize the form
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: "",
      type: "",
      year: new Date().getFullYear(),
      status: "In Development",
      description: "",
      logo_url: "",
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
            status: data.status || "In Development",
            description: data.description || "",
            logo_url: data.logo_url || "",
          });
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

      if (isEditMode && id) {
        // Update existing company
        const { error } = await supabase
          .from("portfolio_companies")
          .update(values)
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
        // Create new company
        const { error } = await supabase
          .from("portfolio_companies")
          .insert([values]);

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
                      <FormLabel>Relationship Type*</FormLabel>
                      <FormControl>
                        <Input placeholder="Founder, Advisor, Investor, etc." {...field} />
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
                      <FormLabel>Year*</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <FormControl>
                      <Input placeholder="Active, In Development, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description of the company..."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/portfolio")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : isEditMode ? "Update Company" : "Create Company"}
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
