import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sales } from "@/data/sampleData";

interface BranchDistributionProps {
  salesData: Sales[];
  year?: number;
}

export const BranchDistribution = ({ salesData, year = 2025 }: BranchDistributionProps) => {
  const chartData = React.useMemo(() => {
    const filteredData = salesData.filter(sale => sale.Year === year);
    const salesByBranch = new Map();
    
    filteredData.forEach(sale => {
      const outlet = sale["Outlet Name"];
      const current = salesByBranch.get(outlet) || 0;
      salesByBranch.set(outlet, current + sale["Sales Amount"]);
    });
    
    return Array.from(salesByBranch.entries()).map(([outlet, sales]) => ({
      name: outlet.replace(/^\d+-/, ''), // Remove prefix for display
      value: sales,
      fullName: outlet
    }));
  }, [salesData, year]);

  const COLORS = [
    'hsl(var(--chart-primary))',
    'hsl(var(--chart-secondary))',
    'hsl(var(--chart-tertiary))',
    'hsl(var(--chart-quaternary))',
    'hsl(var(--accent))'
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.payload.fullName}</p>
          <p className="text-primary">
            Sales: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            {((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sales Distribution by Branch ({year})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-1 gap-2">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.fullName}</span>
              </div>
              <span className="font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';