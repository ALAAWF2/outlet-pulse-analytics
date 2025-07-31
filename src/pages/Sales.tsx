import { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { YearOverYearComparison } from "@/components/dashboard/YearOverYearComparison";
import { OutletFilter } from "@/components/dashboard/OutletFilter";
import { useData } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Users } from "lucide-react";

const Sales = () => {
  const [selectedOutlet, setSelectedOutlet] = useState<string | undefined>();
  const [selectedManager, setSelectedManager] = useState<string | undefined>();
  const { data } = useData();

  // Calculate sales-specific KPIs
  const salesKpis = useMemo(() => {
    if (!data) return {
      currentYearSales: 0,
      previousYearSales: 0,
      growthPercentage: 0,
      dailyAverage: 0,
      bestDay: 0,
      worstDay: Infinity,
      bestDayDate: '',
      worstDayDate: '',
    };

    const filteredSales = selectedOutlet
      ? data.sales.filter(sale => sale["Outlet Name"] === selectedOutlet)
      : data.sales;

    const currentYear = 2025;
    const previousYear = 2024;
    
    const currentYearSales = filteredSales
      .filter(sale => sale.YEAR === currentYear)
      .reduce((sum, sale) => sum + sale["Bill Amount"], 0);
    
    const previousYearSales = filteredSales
      .filter(sale => sale.YEAR === previousYear)
      .reduce((sum, sale) => sum + sale["Bill Amount"], 0);
    
    const growthPercentage = previousYearSales > 0 
      ? ((currentYearSales - previousYearSales) / previousYearSales) * 100 
      : 0;

    // Daily averages
    const currentYearDays = new Set(filteredSales.filter(s => s.YEAR === currentYear).map(s => s.DATE)).size;
    const dailyAverage = currentYearDays > 0 ? currentYearSales / currentYearDays : 0;

    // Best and worst performing days
    const dailySales = new Map();
    filteredSales.filter(s => s.YEAR === currentYear).forEach(sale => {
      const date = sale.DATE;
      dailySales.set(date, (dailySales.get(date) || 0) + sale["Bill Amount"]);
    });

    const salesByDay = Array.from(dailySales.entries());
    const bestDay = salesByDay.reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
    const worstDay = salesByDay.reduce((min, current) => current[1] < min[1] ? current : min, ['', Infinity]);

    return {
      currentYearSales,
      previousYearSales,
      growthPercentage,
      dailyAverage,
      bestDay: bestDay[1],
      worstDay: worstDay[1],
      bestDayDate: bestDay[0],
      worstDayDate: worstDay[0]
    };
  }, [selectedOutlet, data]);

  // Prepare trend data
  const trendData = useMemo(() => {
    if (!data) return [] as Array<{ date: string; sales2024: number; sales2025: number }>;
    const filteredSales = selectedOutlet
      ? data.sales.filter(sale => sale["Outlet Name"] === selectedOutlet)
      : data.sales;

    const salesByDate = new Map();
    
    filteredSales.forEach(sale => {
      const date = sale.DATE;
      if (!salesByDate.has(date)) {
        salesByDate.set(date, { date, sales2024: 0, sales2025: 0 });
      }
      
      const entry = salesByDate.get(date);
      if (sale.YEAR === 2024) {
        entry.sales2024 += sale["Bill Amount"];
      } else if (sale.YEAR === 2025) {
        entry.sales2025 += sale["Bill Amount"];
      }
    });
    
    return Array.from(salesByDate.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return Array.from(salesByDate.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedOutlet, data]);

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
    <DashboardLayout 
      title="Sales Analytics" 
      subtitle="Detailed sales performance and trends analysis"
    >
      {/* Filters */}
      <div className="mb-6">
        {data && (
          <OutletFilter
            areas={data.areas}
            selectedOutlet={selectedOutlet}
            onOutletChange={setSelectedOutlet}
            selectedManager={selectedManager}
            onManagerChange={setSelectedManager}
          />
        )}
      </div>

      {/* Sales KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Sales (2025)"
          value={salesKpis.currentYearSales}
          format="currency"
          change={salesKpis.growthPercentage}
          changeType={salesKpis.growthPercentage > 0 ? 'increase' : 'decrease'}
        />
        <KPICard
          title="Daily Average"
          value={salesKpis.dailyAverage}
          format="currency"
          subtitle="Current year"
        />
        <KPICard
          title="Best Day Sales"
          value={salesKpis.bestDay}
          format="currency"
          subtitle={salesKpis.bestDayDate ? formatDate(salesKpis.bestDayDate) : 'N/A'}
        />
        <KPICard
          title="Lowest Day Sales"
          value={salesKpis.worstDay !== Infinity ? salesKpis.worstDay : 0}
          format="currency"
          subtitle={salesKpis.worstDayDate ? formatDate(salesKpis.worstDayDate) : 'N/A'}
        />
      </div>

      {/* Main Sales Chart */}
      <div className="mb-6">
        {data && (
          <SalesChart
            salesData={data.sales}
            targetData={data["daily target"]}
            selectedOutlet={selectedOutlet}
          />
        )}
      </div>

      {/* Sales Trend Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Sales Trend Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
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
                    name === 'sales2024' ? '2024 Sales' : '2025 Sales'
                  ]}
                  labelFormatter={(date) => `Date: ${formatDate(date)}`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--dashboard-card))',
                    border: '1px solid hsl(var(--dashboard-border))',
                    borderRadius: '6px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales2024"
                  stackId="1"
                  stroke="hsl(var(--chart-tertiary))"
                  fill="hsl(var(--chart-tertiary))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="sales2025"
                  stackId="1"
                  stroke="hsl(var(--chart-primary))"
                  fill="hsl(var(--chart-primary))"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {data && (
          <YearOverYearComparison
            salesData={
              selectedOutlet
                ? data.sales.filter(sale => sale["Outlet Name"] === selectedOutlet)
                : data.sales
            }
          />
        )}
      </div>

      {/* Detailed Sales Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Daily Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Best Day</div>
                  <div className="font-medium text-success">
                    {salesKpis.bestDayDate ? formatDate(salesKpis.bestDayDate) : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">
                    {formatCurrency(salesKpis.bestDay)}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Lowest Day</div>
                  <div className="font-medium text-destructive">
                    {salesKpis.worstDayDate ? formatDate(salesKpis.worstDayDate) : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-destructive">
                    {formatCurrency(salesKpis.worstDay !== Infinity ? salesKpis.worstDay : 0)}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                  <div className="font-medium text-primary">Current Year</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    {formatCurrency(salesKpis.dailyAverage)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-warning" />
              Sales Growth Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Growth Metrics</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Year-over-Year Growth:</span>
                    <span className={`font-medium ${salesKpis.growthPercentage > 0 ? 'text-success' : 'text-destructive'}`}>
                      {salesKpis.growthPercentage > 0 ? '+' : ''}{salesKpis.growthPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Absolute Growth:</span>
                    <span className="font-medium">
                      {formatCurrency(salesKpis.currentYearSales - salesKpis.previousYearSales)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">2024 Total:</span>
                    <span className="font-medium">{formatCurrency(salesKpis.previousYearSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">2025 Total:</span>
                    <span className="font-medium">{formatCurrency(salesKpis.currentYearSales)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">Performance Status</div>
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg ${salesKpis.growthPercentage > 10 ? 'bg-success/10' : salesKpis.growthPercentage > 0 ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                    <div className="text-sm font-medium">
                      {salesKpis.growthPercentage > 10 ? 'Excellent Growth' : 
                       salesKpis.growthPercentage > 0 ? 'Moderate Growth' : 'Declining Sales'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {salesKpis.growthPercentage > 10 ? 'Outstanding performance above 10% growth' :
                       salesKpis.growthPercentage > 0 ? 'Positive growth trending upward' :
                       'Requires attention and strategy adjustment'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Sales;