import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface CategoryBreakdownProps {
  categories: Array<{
    name: string;
    percentage: number;
    amount: number;
    color: string;
  }>;
}

export const CategoryBreakdown = ({ categories }: CategoryBreakdownProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categories} layout="horizontal">
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--chart-primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {formatCurrency(category.amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {category.percentage}% of total
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-dashboard-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Total Sales
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};