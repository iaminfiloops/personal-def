-- Create founder_insights table
CREATE TABLE IF NOT EXISTS public.founder_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.founder_insights ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to published insights
CREATE POLICY "Published insights are viewable by everyone" 
  ON public.founder_insights
  FOR SELECT 
  USING (published = true);

-- Create policy for authors to manage their own insights
CREATE POLICY "Users can create their own insights" 
  ON public.founder_insights
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" 
  ON public.founder_insights
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights" 
  ON public.founder_insights
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create tags table for categorizing insights
CREATE TABLE IF NOT EXISTS public.insight_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for many-to-many relationship between insights and tags
CREATE TABLE IF NOT EXISTS public.insight_to_tags (
  insight_id UUID REFERENCES public.founder_insights(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.insight_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (insight_id, tag_id)
);

-- Add RLS to tags tables
ALTER TABLE public.insight_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_to_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for tags
CREATE POLICY "Tags are viewable by everyone" 
  ON public.insight_tags
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can create tags" 
  ON public.insight_tags
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policies for insight_to_tags junction table
CREATE POLICY "Insight tags are viewable by everyone" 
  ON public.insight_to_tags
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage tags for their own insights" 
  ON public.insight_to_tags
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_insights 
      WHERE id = insight_id AND user_id = auth.uid()
    )
  );

-- Create function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate slugs
CREATE TRIGGER set_slug
BEFORE INSERT OR UPDATE ON public.founder_insights
FOR EACH ROW
EXECUTE FUNCTION generate_slug();

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.founder_insights
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Insert some initial tags
INSERT INTO public.insight_tags (name) VALUES
  ('Entrepreneurship'),
  ('Leadership'),
  ('Innovation'),
  ('Social Impact'),
  ('Business Strategy'),
  ('Personal Growth')
ON CONFLICT (name) DO NOTHING;
