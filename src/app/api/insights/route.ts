import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';
  const limit = parseInt(searchParams.get('limit') || '6', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const tag = searchParams.get('tag');
  const slug = searchParams.get('slug');
  
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    let query = supabase
      .from('founder_insights')
      .select(`
        *,
        tags:insight_to_tags(
          tag:insight_tags(id, name)
        )
      `)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (featured) {
      query = query.eq('featured', true);
    }
    
    if (tag) {
      query = query.contains('tags.tag.name', [tag]);
    }
    
    if (slug) {
      query = query.eq('slug', slug).single();
      const { data, error } = await query;
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      
      // Transform the tags array
      const transformedData = {
        ...data,
        tags: data.tags.map((tagItem: any) => tagItem.tag)
      };
      
      return NextResponse.json(transformedData);
    }
    
    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Transform the tags array for each insight
    const transformedData = data.map((insight: any) => ({
      ...insight,
      tags: insight.tags.map((tagItem: any) => tagItem.tag)
    }));
    
    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('founder_insights')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);
    
    return NextResponse.json({
      insights: transformedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { title, content, summary, image_url, tags, published, featured } = await request.json();
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Insert the insight
    const { data: insight, error } = await supabase
      .from('founder_insights')
      .insert({
        title,
        content,
        summary: summary || content.substring(0, 200) + '...',
        image_url,
        published: published || false,
        featured: featured || false,
        user_id: session.user.id
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Add tags if provided
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tagId: string) => ({
        insight_id: insight.id,
        tag_id: tagId
      }));
      
      const { error: tagError } = await supabase
        .from('insight_to_tags')
        .insert(tagInserts);
      
      if (tagError) {
        console.error('Error adding tags:', tagError);
      }
    }
    
    return NextResponse.json(insight, { status: 201 });
    
  } catch (error) {
    console.error('Error creating insight:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
