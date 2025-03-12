
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EditIcon, FileTextIcon, BriefcaseIcon } from "lucide-react";

interface StatsProps {
  blogPosts: number;
  companies: number;
  messages: number;
}

const DashboardStats = ({ blogPosts, companies, messages }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{blogPosts}</div>
          <p className="text-muted-foreground text-sm mb-4">
            Published articles on your blog
          </p>
          <Button asChild className="w-full">
            <Link to="/admin/blog">
              <EditIcon className="mr-2 h-4 w-4" />
              Manage Posts
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Portfolio Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{companies}</div>
          <p className="text-muted-foreground text-sm mb-4">
            Companies in your portfolio
          </p>
          <Button asChild className="w-full">
            <Link to="/admin/portfolio">
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              Manage Companies
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{messages}</div>
          <p className="text-muted-foreground text-sm mb-4">
            Unread messages from visitors
          </p>
          <Button asChild className="w-full">
            <Link to="/admin/messages">
              <FileTextIcon className="mr-2 h-4 w-4" />
              View Messages
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
