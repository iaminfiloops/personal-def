
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PlusIcon, Pencil, Trash2, ArrowLeft, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Sample companies data (will be replaced with Supabase data in production)
const initialCompanies = [
  {
    id: 1,
    name: "EcoSolutions",
    type: "Founder",
    year: 2018,
    status: "Active"
  },
  {
    id: 2,
    name: "EduAccess",
    type: "Investor",
    year: 2020,
    status: "Active"
  },
  {
    id: 3,
    name: "HealthBridge",
    type: "Founder",
    year: 2019,
    status: "Active"
  },
  {
    id: 4,
    name: "FarmTech",
    type: "Advisor",
    year: 2021,
    status: "In Development"
  }
];

const AdminPortfolioEdit = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState(initialCompanies);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // In a real implementation, this would load data from Supabase
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        // This is where you would fetch from Supabase in production
        // Example:
        // const { data, error } = await supabase
        //   .from('companies')
        //   .select('*')
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        // setCompanies(data);

        // For now, just use our sample data with a delay to simulate fetching
        await new Promise(resolve => setTimeout(resolve, 500));
        setCompanies(initialCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast({
          title: 'Error loading companies',
          description: 'Please try refreshing the page.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [user?.id]); // Re-fetch when user changes

  const handleDeleteCompany = async (id: number) => {
    if (confirm("Are you sure you want to delete this company?")) {
      try {
        // In production, this would be a Supabase delete operation
        // Example:
        // const { error } = await supabase
        //   .from('companies')
        //   .delete()
        //   .eq('id', id);
        
        // if (error) throw error;
        
        // For now, just update the local state
        setCompanies(companies.filter(company => company.id !== id));
        
        toast({
          title: "Company deleted",
          description: "The company has been successfully deleted.",
        });
      } catch (error) {
        console.error('Error deleting company:', error);
        toast({
          title: 'Error deleting company',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

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
                                asChild
                              >
                                <Link to={`/admin/portfolio/edit/${company.id}`}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
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
                            No companies found.
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
