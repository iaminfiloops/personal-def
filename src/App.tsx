import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBlogEdit from "./pages/admin/BlogEdit";
import AdminPortfolioEdit from "./pages/admin/PortfolioEdit";
import InsightsManager from "./pages/admin/InsightsManager";
import InsightEditor from "./pages/admin/InsightEditor";

// Add missing routes for blog post and portfolio item detail pages
import BlogPost from "./pages/BlogPost";
import PortfolioDetail from "./pages/PortfolioDetail";
import PortfolioForm from "./components/admin/PortfolioForm";
import BlogForm from "./components/admin/BlogForm";
import Gallery from "./pages/Gallery";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";

// Import analytics components
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import FacebookPixel from "./components/analytics/FacebookPixel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Add analytics tracking */}
          <GoogleAnalytics />
          <FacebookPixel />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/insights" element={<Insights />} />

            {/* Add routes for individual blog posts, portfolio items, and insights */}
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute requireAdmin>
                <AdminBlogEdit />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/new" element={
              <ProtectedRoute requireAdmin>
                <BlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <BlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/portfolio" element={
              <ProtectedRoute requireAdmin>
                <AdminPortfolioEdit />
              </ProtectedRoute>
            } />
            <Route path="/admin/portfolio/new" element={
              <ProtectedRoute requireAdmin>
                <PortfolioForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/portfolio/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <PortfolioForm />
              </ProtectedRoute>
            } />

            {/* Insights admin routes */}
            <Route path="/admin/insights" element={
              <ProtectedRoute requireAdmin>
                <InsightsManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/insights/new" element={
              <ProtectedRoute requireAdmin>
                <InsightEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/insights/edit/:id" element={
              <ProtectedRoute requireAdmin>
                <InsightEditor />
              </ProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
