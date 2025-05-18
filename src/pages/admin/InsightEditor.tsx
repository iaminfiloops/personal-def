import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Eye, Trash2, Plus, X } from 'lucide-react';
import { FounderInsight, InsightTag } from '@/components/FounderInsights';

// Rich text editor (you can replace this with your preferred editor)
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const InsightEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [insight, setInsight] = useState<Partial<FounderInsight>>({
    title: '',
    content: '',
    summary: '',
    image_url: '',
    published: false,
    featured: false,
    tags: [],
  });

  const [availableTags, setAvailableTags] = useState<InsightTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch insight if editing
  useEffect(() => {
    if (isEditing) {
      const fetchInsight = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/admin/insights/${id}`);
          const data = await response.json();

          if (data) {
            setInsight(data);
            setSelectedTags(data.tags?.map((tag: InsightTag) => tag.id) || []);
          }
        } catch (error) {
          console.error('Error fetching insight:', error);
          toast({
            title: 'Error',
            description: 'Failed to load insight. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchInsight();
    }
  }, [id, isEditing]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();

        if (data) {
          setAvailableTags(data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Generate preview URL
  useEffect(() => {
    if (isEditing && insight.slug) {
      setPreviewUrl(`/insights/${insight.slug}`);
    }
  }, [isEditing, insight.slug]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInsight(prev => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor change
  const handleEditorChange = (content: string) => {
    setInsight(prev => ({ ...prev, content }));
  };

  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setInsight(prev => ({ ...prev, [name]: checked }));
  };

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Create new tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tag');
      }

      const newTag = await response.json();

      setAvailableTags(prev => [...prev, newTag]);
      setSelectedTags(prev => [...prev, newTag.id]);
      setNewTagName('');

      toast({
        title: 'Success',
        description: 'Tag created successfully.',
      });
    } catch (error: any) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create tag. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Save insight
  const handleSave = async (publish: boolean = false) => {
    if (!insight.title || !insight.content) {
      toast({
        title: 'Error',
        description: 'Title and content are required.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // If summary is empty, generate one from content
      if (!insight.summary) {
        const textContent = insight.content.replace(/<[^>]+>/g, '');
        insight.summary = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
      }

      // Set published status if specified
      if (publish !== undefined) {
        insight.published = publish;
      }

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/admin/insights/${id}` : '/api/admin/insights';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...insight,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save insight');
      }

      const savedInsight = await response.json();

      toast({
        title: 'Success',
        description: `Insight ${isEditing ? 'updated' : 'created'} successfully.`,
      });

      // Redirect to insights manager
      navigate('/admin/insights');
    } catch (error: any) {
      console.error('Error saving insight:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save insight. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete insight
  const handleDelete = async () => {
    if (!isEditing) return;

    try {
      const response = await fetch(`/api/admin/insights/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete insight');
      }

      toast({
        title: 'Success',
        description: 'Insight deleted successfully.',
      });

      navigate('/admin/insights');
    } catch (error) {
      console.error('Error deleting insight:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete insight. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? 'Edit Insight' : 'Create New Insight'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/insights')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
          </Button>

          <div className="flex items-center gap-2">
            {isEditing && (
              <Button asChild variant="outline">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </a>
              </Button>
            )}

            <Button onClick={() => handleSave(false)} disabled={saving}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>

            <Button onClick={() => handleSave(true)} disabled={saving} variant="default">
              {insight.published ? 'Update' : 'Publish'}
            </Button>

            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the insight
                      "{insight.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Insight' : 'New Insight'}</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update your insight details' : 'Create a new founder insight'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={insight.title}
                      onChange={handleInputChange}
                      placeholder="Enter a title for your insight"
                    />
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>
                    <TabsContent value="content" className="space-y-2">
                      <Label>Content</Label>
                      <div className="min-h-[400px]">
                        <ReactQuill
                          theme="snow"
                          value={insight.content}
                          onChange={handleEditorChange}
                          className="h-[350px] mb-12"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="summary" className="space-y-2">
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        value={insight.summary}
                        onChange={handleInputChange}
                        placeholder="Enter a brief summary of your insight (optional)"
                        className="min-h-[150px]"
                      />
                      <p className="text-sm text-muted-foreground">
                        If left empty, a summary will be automatically generated from your content.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Featured Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={insight.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {insight.image_url && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <img
                        src={insight.image_url}
                        alt="Featured"
                        className="w-full h-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={insight.published}
                    onCheckedChange={(checked) => handleSwitchChange('published', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured</Label>
                  <Switch
                    id="featured"
                    checked={insight.featured}
                    onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagSelect(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new tag"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateTag();
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleCreateTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleSave()} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InsightEditor;
