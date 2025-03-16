
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusIcon, Pencil, Trash2, ArrowLeft, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the shape of a portfolio company
interface Company {
  id: string;
  name: string;
  type: string;
  year: number;
  status: string;
  description?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminPortfolioEdit = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch companies from Supabase
  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log("Fetching portfolio companies from Supabase");
      const { data, error } = await supabase
        .from('portfolio_companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching companies:", error);
        throw error;
      }
      
      console.log("Fetched companies:", data);
      return data as Company[];
    }
  });

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting company with ID:", id);
      const { error } = await supabase
        .from('portfolio_companies')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting company:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the companies query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Company deleted",
        description: "The company has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Delete company error:', error);
      toast({
        title: 'Error deleting company',
        description: 'There was an error deleting the company. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.type && company.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteCompany = async (id: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      deleteCompanyMutation.mutate(id);
    }
  };

  if (error) {
    console.error("Error loading companies:", error);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">Error loading companies. Please try refreshing the page.</p>
            </div>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <Link to="/admin" className="text-accent hover:text-accent/80 inline-flex items-center mb-4">
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Manage Portfolio Companies</h1>
                <p className="text-muted-foreground">
                  Create, edit and delete your portfolio companies.
                </p>
              </div>
              
              <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                <Link to="/admin/portfolio/new">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Company
                </Link>
              </Button>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search companies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-20 flex justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map(company => (
                          <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.type}</TableCell>
                            <TableCell>{company.year}</TableCell>
                            <TableCell>
                              <span 
                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  company.status === "Active" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {company.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => navigate(`/admin/portfolio/edit/${company.id}`)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            {searchQuery ? "No matching companies found." : "No companies found. Add your first company."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPortfolioEdit;
