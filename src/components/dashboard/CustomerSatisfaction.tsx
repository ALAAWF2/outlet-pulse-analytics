import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface CustomerSatisfactionProps {
  data: {
    overall: number;
    categories: Array<{
      name: string;
      rating: number;
      percentage: number;
    }>;
  };
}

export const CustomerSatisfaction = ({ data }: CustomerSatisfactionProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return "text-success";
    if (rating >= 3.5) return "text-warning";
    return "text-destructive";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 85) return "bg-success";
    if (percentage >= 70) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-warning" />
          Customer Satisfaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="text-center mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-3xl font-bold text-foreground mb-1">
            {data.overall}%
          </div>
          <div className="text-sm text-muted-foreground">
            Overall Satisfaction
          </div>
          <div className="flex justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(data.overall / 20) 
                    ? "text-warning fill-warning" 
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {data.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getRatingColor(category.rating)}`}>
                    {category.rating.toFixed(1)}
                  </span>
                  <Star className={`w-3 h-3 ${getRatingColor(category.rating)}`} />
                </div>
              </div>
              <div className="relative">
                <Progress 
                  value={category.percentage} 
                  className="h-2"
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(category.percentage)}`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Poor</span>
                <span className="font-medium text-foreground">
                  {category.percentage}%
                </span>
                <span>Excellent</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};