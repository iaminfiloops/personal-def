
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";

// Sample blog post data (would be fetched from Supabase in production)
const blogPostsData = [
  {
    id: "1",
    title: "The Future of Social Entrepreneurship",
    content: `
      <p>Social entrepreneurship stands at a crucial juncture as we move deeper into the 21st century. The convergence of technological innovation, shifting consumer preferences, and urgent social challenges creates both opportunities and imperatives for social entrepreneurs.</p>
      <h2>Technology as an Enabler</h2>
      <p>Emerging technologies like artificial intelligence, blockchain, and the Internet of Things (IoT) are not just buzzwords but powerful tools that social entrepreneurs can leverage to scale their impact.</p>
      <p>AI, for instance, can help identify patterns in community needs that might be invisible to human analysis. Blockchain can ensure transparency in supply chains and donation allocation. IoT devices can monitor environmental conditions or health metrics in real-time, allowing for quicker interventions.</p>
      <h2>The Rise of Conscious Consumerism</h2>
      <p>Today's consumers increasingly make purchasing decisions based on a company's social and environmental impact. This shift creates a fertile ground for social enterprises that can tell compelling stories about their mission and demonstrate measurable impact.</p>
      <p>Social entrepreneurs who can effectively communicate their theory of change and show evidence of impact will not only attract customers but also investors and partners who share their values.</p>
      <h2>Blended Financing Models</h2>
      <p>The binary distinction between for-profit and non-profit is blurring. Social entrepreneurs are increasingly adopting hybrid models that combine different types of capital – grants, investments, loans – to fund their operations and growth.</p>
      <p>This approach allows them to access a wider pool of resources and build more resilient organizations that aren't dependent on a single funding source.</p>
      <h2>Collaboration Over Competition</h2>
      <p>The scale and complexity of today's social challenges demand collaborative approaches. The future of social entrepreneurship will be marked by increased collaboration across sectors – between social enterprises, traditional businesses, governments, and civil society organizations.</p>
      <p>These collaborations will enable social entrepreneurs to access new markets, share resources, and amplify their impact in ways that wouldn't be possible in isolation.</p>
      <h2>Conclusion</h2>
      <p>As we look to the future, social entrepreneurship will continue to evolve, adapting to new challenges and opportunities. What remains constant is the core purpose: to create sustainable solutions to social problems that combine innovation, empathy, and business acumen.</p>
      <p>The entrepreneurs who will thrive in this landscape will be those who can navigate complexity, build diverse coalitions, and measure their impact not just in financial terms but in lives improved and communities transformed.</p>
    `,
    image: "https://via.placeholder.com/1200x600",
    category: "Entrepreneurship",
    date: "May 12, 2023",
    readTime: "5 min read",
    author: "Emily Chen",
  },
  {
    id: "2",
    title: "Impact Investing: Beyond Financial Returns",
    content: `
      <p>Impact investing represents a paradigm shift in how we think about the role of capital in society. By seeking both financial returns and positive social or environmental outcomes, impact investors are helping to reshape markets and redirect resources toward solving our most pressing challenges.</p>
      <h2>The Evolution of Impact Investing</h2>
      <p>What began as a niche approach championed by foundations and high-net-worth individuals has grown into a global movement. Today, impact investing encompasses a wide range of asset classes, sectors, and return expectations.</p>
      <p>From microfinance and community development to renewable energy and health technology, impact investors are active across diverse fields, demonstrating that positive impact can be generated in virtually any context.</p>
      <h2>The Spectrum of Returns</h2>
      <p>One of the most significant developments in impact investing has been the recognition that it encompasses a spectrum of return expectations. Some investors prioritize preserving capital while maximizing impact, while others seek market-rate returns alongside measurable social outcomes.</p>
      <p>This diversity of approaches has helped to broaden the appeal of impact investing and attract new participants to the field, from institutional investors to retail platforms offering impact options to everyday savers.</p>
      <h2>The Challenge of Measurement</h2>
      <p>As impact investing has grown, so too has the sophistication of impact measurement and management practices. Investors increasingly recognize that understanding social and environmental outcomes requires as much rigor as financial analysis.</p>
      <p>Frameworks like the Impact Management Project, IRIS+, and the Sustainable Development Goals have provided common languages and metrics for assessing impact, though challenges remain in standardizing approaches across diverse contexts.</p>
      <h2>Aligning Incentives</h2>
      <p>One of the most promising innovations in impact investing has been the development of financial instruments that explicitly align financial returns with impact outcomes. Impact bonds, performance-based loans, and other results-based financing mechanisms create direct incentives for achieving and measuring impact.</p>
      <p>These approaches help to address the risk of "impact washing" by ensuring that capital is directed toward interventions that genuinely make a difference.</p>
      <h2>Looking Ahead</h2>
      <p>As impact investing continues to mature, several trends are emerging that will shape its future development. These include greater integration of impact considerations into mainstream investment decision-making, increased attention to addressing systemic issues like racial equity and climate change, and growing interest in place-based investing that targets specific communities or regions.</p>
      <p>What remains constant is the fundamental insight at the heart of impact investing: that investment capital, when deployed thoughtfully, can be a powerful tool for creating positive change while generating financial returns. This dual objective represents not a compromise but an opportunity to reimagine the purpose and potential of investment in building a more just and sustainable world.</p>
    `,
    image: "https://via.placeholder.com/1200x600",
    category: "Investment",
    date: "April 28, 2023",
    readTime: "7 min read",
    author: "Emily Chen",
  },
  {
    id: "3",
    title: "Building Resilient Communities Through Business",
    content: `
      <p>In an era of increasingly frequent and severe disruptions—from natural disasters to economic shocks to public health crises—community resilience has become a critical priority. Social enterprises are uniquely positioned to strengthen this resilience by creating economic opportunities, addressing local needs, and fostering social cohesion.</p>
      <h2>Economic Foundations of Resilience</h2>
      <p>Economic diversification is a cornerstone of resilient communities. When local economies depend too heavily on a single industry or employer, they become vulnerable to shocks that affect that sector. Social enterprises can help to diversify local economies by creating businesses in underserved sectors and employing people who might otherwise be excluded from the workforce.</p>
      <p>Moreover, by prioritizing local ownership and reinvestment of profits, social enterprises help to ensure that wealth remains within communities rather than being extracted by distant shareholders. This local circulation of resources strengthens economic resilience by building up community assets and reducing dependency on external support.</p>
      <h2>Meeting Basic Needs</h2>
      <p>Resilient communities must be able to meet residents' basic needs, especially during times of crisis. Social enterprises that focus on food security, affordable housing, healthcare, clean water, and renewable energy contribute directly to this foundational aspect of resilience.</p>
      <p>For example, community-supported agriculture programs and food cooperatives strengthen local food systems, reducing vulnerability to supply chain disruptions. Community land trusts and housing cooperatives create permanently affordable housing that remains stable even as market conditions fluctuate.</p>
      <h2>Building Social Capital</h2>
      <p>Perhaps the most important contribution of social enterprises to community resilience is their role in building social capital—the networks of relationships and trust that enable people to work together effectively. Research consistently shows that communities with strong social capital recover more quickly from disasters and other shocks.</p>
      <p>Social enterprises build this capital in multiple ways: by creating spaces where diverse community members can interact, by engaging volunteers and community members in their operations, and by fostering a sense of shared purpose and agency. Many social enterprises also explicitly aim to bridge divides between different community groups, strengthening the social fabric that is essential to collective action.</p>
      <h2>Adaptive Capacity</h2>
      <p>Resilience isn't just about withstanding shocks—it's also about adapting to changing conditions. By their nature, social enterprises embody this adaptive capacity, constantly innovating to address evolving community needs with limited resources.</p>
      <p>This culture of innovation and adaptation can infuse the broader community, building collective skills in problem-solving, resource mobilization, and creative thinking that are essential for navigating uncertain futures.</p>
      <h2>Case Studies in Resilience</h2>
      <p>From post-disaster New Orleans to post-industrial Detroit, from rural Appalachia to urban immigrant communities, social enterprises have demonstrated their capacity to strengthen resilience in diverse contexts.</p>
      <p>In New Orleans after Hurricane Katrina, social enterprises emerged to address urgent needs for housing, food, and employment while also tackling the underlying inequities that had made some communities more vulnerable than others. In Detroit, social enterprises have helped to revitalize neighborhoods and create new economic opportunities as the city reimagines its future.</p>
      <h2>Building Forward</h2>
      <p>As communities around the world face accelerating change and increasing instability, the role of social enterprise in building resilience will only grow more important. The most effective social entrepreneurs recognize that resilience is not about returning to some prior state of "normal" but about building forward toward more just, sustainable, and adaptive communities.</p>
      <p>By combining business acumen with deep community engagement and a commitment to social justice, these entrepreneurs are helping to create communities that can not only weather crises but emerge from them stronger and more equitable than before.</p>
    `,
    image: "https://via.placeholder.com/1200x600",
    category: "Social Impact",
    date: "March 15, 2023",
    readTime: "6 min read",
    author: "Emily Chen",
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from Supabase instead
    const fetchBlogPost = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundPost = blogPostsData.find(post => post.id === id);
        setPost(foundPost || null);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/blog" className="text-accent hover:text-accent/80 inline-flex items-center mb-8 animate-fade-in">
            <ArrowLeft size={16} className="mr-1" /> Back to Blog
          </Link>
          
          {isLoading ? (
            <div className="py-20 flex justify-center animate-pulse">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : post ? (
            <article className="max-w-3xl mx-auto animate-fade-in">
              <div className="mb-8">
                <span className="chip bg-primary/10 text-primary mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-semibold mb-6">{post.title}</h1>
                
                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-8">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays size={14} className="mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-10 rounded-xl overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent hover:prose-a:text-accent/80"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-xl font-medium mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    Share on Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    Share on LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    Copy Link
                  </Button>
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-medium mb-4">Blog post not found</h2>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/blog">Back to All Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPost;
