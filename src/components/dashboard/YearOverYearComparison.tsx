import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sales } from "@/data/sampleData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface YearOverYearComparisonProps {
  salesData: Sales[];
}

export const YearOverYearComparison = ({ salesData }: YearOverYearComparisonProps) => {
  const chartData = React.useMemo(() => {
    const salesByOutlet = new Map();
    
    salesData.forEach(sale => {
      const outlet = sale["Outlet Name"];
      if (!salesByOutlet.has(outlet)) {
        salesByOutlet.set(outlet, { name: outlet.replace(/^\d+-/, ''), sales2024: 0, sales2025: 0 });
      }
      
      const entry = salesByOutlet.get(outlet);
      if (sale.Year === 2024) {
        entry.sales2024 += sale["Sales Amount"];
      } else if (sale.Year === 2025) {
        entry.sales2025 += sale["Sales Amount"];
      }
    });
    
    return Array.from(salesByOutlet.values()).map(item => ({
      ...item,
      growth: item.sales2024 > 0 ? ((item.sales2025 - item.sales2024) / item.sales2024) * 100 : 0,
      difference: item.sales2025 - item.sales2024
    }));
  }, [salesData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-4 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">2024: </span>
              <span className="text-warning">{formatCurrency(data.sales2024)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">2025: </span>
              <span className="text-primary">{formatCurrency(data.sales2025)}</span>
            </p>
            <div className="flex items-center gap-1 text-sm pt-1 border-t border-dashboard-border">
              {data.growth > 0 ? (
                <TrendingUp className="w-3 h-3 text-success" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span className={data.growth > 0 ? "text-success" : "text-destructive"}>
                {data.growth > 0 ? '+' : ''}{data.growth.toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-2">
                ({data.difference > 0 ? '+' : ''}{formatCurrency(data.difference)})
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Year-over-Year Sales Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="sales2024" 
              fill="hsl(var(--chart-tertiary))"
              name="2024 Sales"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="sales2025" 
              fill="hsl(var(--chart-primary))"
              name="2025 Sales"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Growth summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="bg-muted/30 rounded-lg p-3">
              <div className="text-sm font-medium">{item.name}</div>
              <div className="flex items-center gap-1 mt-1">
                {item.growth > 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className={`text-sm font-medium ${item.growth > 0 ? "text-success" : "text-destructive"}`}>
                  {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatCurrency(Math.abs(item.difference))} {item.growth > 0 ? 'increase' : 'decrease'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';