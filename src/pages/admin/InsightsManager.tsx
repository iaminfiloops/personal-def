import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { FounderInsight } from '@/components/FounderInsights';

const InsightsManager = () => {
  const [insights, setInsights] = useState<FounderInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInsights, setTotalInsights] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [insightToDelete, setInsightToDelete] = useState<FounderInsight | null>(null);
  const insightsPerPage = 6;

  // Function to calculate reading time
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Fetch insights
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', insightsPerPage.toString());

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (activeTab === 'published') {
          params.append('published', 'true');
        } else if (activeTab === 'drafts') {
          params.append('published', 'false');
        } else if (activeTab === 'featured') {
          params.append('featured', 'true');
        }

        // Fetch insights (admin endpoint would include all insights, not just published ones)
        const response = await fetch(`/api/admin/insights?${params.toString()}`);
        const data = await response.json();

        if (data.insights) {
          setInsights(data.insights);
          setTotalPages(data.pagination.pages);
          setTotalInsights(data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
        toast({
          title: 'Error',
          description: 'Failed to load insights. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [currentPage, searchQuery, activeTab]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Toggle insight selection
  const toggleInsightSelection = (insightId: string) => {
    setSelectedInsights(prev =>
      prev.includes(insightId)
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
  };

  // Toggle all insights selection
  const toggleAllInsights = () => {
    if (selectedInsights.length === insights.length) {
      setSelectedInsights([]);
    } else {
      setSelectedInsights(insights.map(insight => insight.id));
    }
  };

  // Toggle insight published status
  const togglePublishedStatus = async (insight: FounderInsight) => {
    try {
      const response = await fetch(`/api/admin/insights/${insight.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !insight.published,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update insight');
      }

      // Update local state
      setInsights(prev =>
        prev.map(item =>
          item.id === insight.id
            ? { ...item, published: !item.published }
            : item
        )
      );

      toast({
        title: 'Success',
        description: `Insight ${insight.published ? 'unpublished' : 'published'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update insight. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Toggle insight featured status
  const toggleFeaturedStatus = async (insight: FounderInsight) => {
    try {
      const response = await fetch(`/api/admin/insights/${insight.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !insight.featured,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update insight');
      }

      // Update local state
      setInsights(prev =>
        prev.map(item =>
          item.id === insight.id
            ? { ...item, featured: !item.featured }
            : item
        )
      );

      toast({
        title: 'Success',
        description: `Insight ${insight.featured ? 'removed from' : 'marked as'} featured.`,
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update insight. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Delete insight
  const deleteInsight = async () => {
    if (!insightToDelete) return;

    try {
      const response = await fetch(`/api/admin/insights/${insightToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete insight');
      }

      // Update local state
      setInsights(prev => prev.filter(item => item.id !== insightToDelete.id));
      setSelectedInsights(prev => prev.filter(id => id !== insightToDelete.id));

      toast({
        title: 'Success',
        description: 'Insight deleted successfully.',
      });

      setInsightToDelete(null);
    } catch (error) {
      console.error('Error deleting insight:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete insight. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Bulk delete insights
  const bulkDeleteInsights = async () => {
    if (selectedInsights.length === 0) return;

    try {
      const response = await fetch('/api/admin/insights/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: selectedInsights,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete insights');
      }

      // Update local state
      setInsights(prev => prev.filter(item => !selectedInsights.includes(item.id)));
      setSelectedInsights([]);

      toast({
        title: 'Success',
        description: `${selectedInsights.length} insights deleted successfully.`,
      });
    } catch (error) {
      console.error('Error bulk deleting insights:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete insights. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout title="Founder Insights Manager">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Founder Insights</h1>
            <p className="text-muted-foreground">
              Manage your founder insights and articles
            </p>
          </div>

          <Button asChild>
            <Link to="/admin/insights/new" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> New Insight
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSearch} className="w-full md:w-auto md:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search insights..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {selectedInsights.length > 0 && (
          <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">
              {selectedInsights.length} {selectedInsights.length === 1 ? 'item' : 'items'} selected
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the selected insights.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={bulkDeleteInsights}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : insights.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight) => (
                <Card key={insight.id} className={`overflow-hidden transition-all duration-300 ${selectedInsights.includes(insight.id) ? 'border-primary' : 'border-border'}`}>
                  <div className="relative">
                    {insight.image_url ? (
                      <div className="h-40">
                        <img
                          src={insight.image_url}
                          alt={insight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No image</p>
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedInsights.includes(insight.id)}
                        onCheckedChange={() => toggleInsightSelection(insight.id)}
                        className="h-5 w-5 bg-background/80"
                      />
                    </div>

                    {insight.featured && (
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {insight.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-1">{insight.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {insight.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(insight.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{insight.reading_time || getReadingTime(insight.content)} min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={insight.published}
                            onCheckedChange={() => togglePublishedStatus(insight)}
                          />
                          <Label className="text-sm">Published</Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={insight.featured}
                            onCheckedChange={() => toggleFeaturedStatus(insight)}
                          />
                          <Label className="text-sm">Featured</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/insights/${insight.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Link>
                      </Button>

                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/admin/insights/edit/${insight.id}`}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Link>
                      </Button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setInsightToDelete(insight)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the insight
                            "{insightToDelete?.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setInsightToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteInsight}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">No insights found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first insight'}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            ) : (
              <Button asChild>
                <Link to="/admin/insights/new">
                  <Plus className="mr-2 h-4 w-4" /> Create Insight
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InsightsManager;
