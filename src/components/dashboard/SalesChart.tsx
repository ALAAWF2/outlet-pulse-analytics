import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sale, DailyTarget } from "@/types/data";

interface SalesChartProps {
  salesData: Sale[];
  targetData: DailyTarget[];
  selectedOutlet?: string;
}

export const SalesChart = ({ salesData, targetData, selectedOutlet }: SalesChartProps) => {
  // Prepare chart data
  const chartData = React.useMemo(() => {
    const filteredSales = selectedOutlet 
      ? salesData.filter(sale => sale["Outlet Name"] === selectedOutlet)
      : salesData;
    
    const filteredTargets = selectedOutlet
      ? targetData.filter(target => target["Outlet Name"] === selectedOutlet)
      : targetData;

    // Group by date and calculate totals
    const dataMap = new Map();
    
    filteredSales.forEach(sale => {
      const date = sale.DATE;
      if (!dataMap.has(date)) {
        dataMap.set(date, {
          date,
          sales2024: 0,
          sales2025: 0,
          target: 0,
          visitors: 0
        });
      }
      
      const entry = dataMap.get(date);
      if (sale.YEAR === 2024) {
        entry.sales2024 += sale["Bill Amount"];
      } else if (sale.YEAR === 2025) {
        entry.sales2025 += sale["Bill Amount"];
        entry.visitors += sale.visitors;
      }
    });
    
    // Add targets
    filteredTargets.forEach(target => {
      const date = target.DATE;
      if (dataMap.has(date)) {
        dataMap.get(date).target += target.target;
      }
    });
    
    return Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [salesData, targetData, selectedOutlet]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Daily Sales Trends (2024 vs 2025)
          {selectedOutlet && <span className="text-sm font-normal text-muted-foreground ml-2">- {selectedOutlet}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'sales2024' ? '2024 Sales' :
                name === 'sales2025' ? '2025 Sales' : 
                name === 'target' ? 'Target' : name
              ]}
              labelFormatter={(date) => `Date: ${formatDate(date)}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--dashboard-card))',
                border: '1px solid hsl(var(--dashboard-border))',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="sales2024" 
              fill="hsl(var(--chart-tertiary))"
              name="2024 Sales"
              opacity={0.8}
            />
            <Bar 
              dataKey="sales2025" 
              fill="hsl(var(--chart-primary))"
              name="2025 Sales"
              opacity={0.9}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--chart-secondary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-secondary))', strokeWidth: 2, r: 4 }}
              name="Daily Target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};