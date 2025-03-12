
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Blog post updated:</span> "The Future of Social Entrepreneurship" - 2 days ago
          </li>
          <li className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">New company added:</span> "HealthBridge" - 1 week ago
          </li>
          <li className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Profile information updated</span> - 2 weeks ago
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
