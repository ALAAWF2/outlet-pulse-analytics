import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  title: string;
  percentage: number;
  value: number;
  target: number;
  format?: 'currency' | 'number';
}

export const GaugeChart = ({ title, percentage, value, target, format = 'currency' }: GaugeChartProps) => {
  const data = [
    { name: 'Achieved', value: Math.min(percentage, 100) },
    { name: 'Remaining', value: Math.max(100 - percentage, 0) }
  ];

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    return new Intl.NumberFormat('en-US').format(val);
  };

  const getColor = (percentage: number) => {
    if (percentage >= 90) return 'hsl(var(--success))';
    if (percentage >= 75) return 'hsl(var(--chart-secondary))';
    if (percentage >= 50) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const COLORS = [getColor(percentage), 'hsl(var(--muted))'];

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-foreground">
              {percentage.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              Achievement
            </div>
          </div>
        </div>
        
        {/* Values */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Achieved:</span>
            <span className="font-medium">{formatValue(value)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target:</span>
            <span className="font-medium">{formatValue(target)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-dashboard-border pt-2">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-medium text-warning">
              {formatValue(Math.max(target - value, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};