
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full">
          <Link to="/admin/blog/new">
            Create New Blog Post
          </Link>
        </Button>
        <Button asChild className="w-full">
          <Link to="/admin/portfolio/new">
            Add New Company
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/admin/profile">
            Edit Profile Information
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
