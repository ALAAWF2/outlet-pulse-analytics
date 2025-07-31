import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomerSatisfaction } from "@/components/dashboard/CustomerSatisfaction";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { extendedSampleData, categories, customerSatisfaction, regionalData } from "@/data/extendedSampleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from 'recharts';
import { BarChart3, Users, TrendingUp, Calendar, Clock, Activity } from "lucide-react";
import { useMemo } from "react";

const Analytics = () => {
  // Advanced analytics calculations
  const analyticsData = useMemo(() => {
    // Performance correlation between visitors and sales
    const performanceCorrelation = extendedSampleData.sales
      .filter(sale => sale.Year === 2025)
      .map(sale => ({
        visitors: sale.Visitors,
        sales: sale["Sales Amount"],
        invoices: sale.Invoices,
        efficiency: sale.Visitors > 0 ? sale["Sales Amount"] / sale.Visitors : 0,
        outlet: sale["Outlet Name"].replace(/^\d+-/, '')
      }));

    // Manager performance radar data
    const managerPerformance = extendedSampleData.areas.map(area => {
      const managerSales = extendedSampleData.sales
        .filter(sale => sale["Outlet Name"] === area["Outlet Name"] && sale.Year === 2025)
        .reduce((sum, sale) => sum + sale["Sales Amount"], 0);
      
      const managerVisitors = extendedSampleData.sales
        .filter(sale => sale["Outlet Name"] === area["Outlet Name"] && sale.Year === 2025)
        .reduce((sum, sale) => sum + sale.Visitors, 0);
      
      const managerInvoices = extendedSampleData.sales
        .filter(sale => sale["Outlet Name"] === area["Outlet Name"] && sale.Year === 2025)
        .reduce((sum, sale) => sum + sale.Invoices, 0);

      const target = extendedSampleData["yearly target"]
        .find(t => t["Outlet Name"] === area["Outlet Name"])?.["Target Amount"] || 0;

      return {
        manager: area["Area Manager"],
        sales: managerSales,
        visitors: managerVisitors,
        invoices: managerInvoices,
        target,
        achievement: target > 0 ? (managerSales / target) * 100 : 0,
        efficiency: managerVisitors > 0 ? managerSales / managerVisitors : 0,
        conversionRate: managerVisitors > 0 ? (managerInvoices / managerVisitors) * 100 : 0
      };
    });

    // Aggregate manager data
    const managerAggregate = {};
    managerPerformance.forEach(mp => {
      if (!managerAggregate[mp.manager]) {
        managerAggregate[mp.manager] = {
          manager: mp.manager,
          sales: 0,
          visitors: 0,
          invoices: 0,
          target: 0,
          branches: 0
        };
      }
      managerAggregate[mp.manager].sales += mp.sales;
      managerAggregate[mp.manager].visitors += mp.visitors;
      managerAggregate[mp.manager].invoices += mp.invoices;
      managerAggregate[mp.manager].target += mp.target;
      managerAggregate[mp.manager].branches += 1;
    });

    const topManagers = Object.values(managerAggregate)
      .map((manager: any) => ({
        ...manager,
        achievement: manager.target > 0 ? (manager.sales / manager.target) * 100 : 0,
        avgSalesPerBranch: manager.branches > 0 ? manager.sales / manager.branches : 0,
        conversionRate: manager.visitors > 0 ? (manager.invoices / manager.visitors) * 100 : 0
      }))
      .sort((a, b) => b.achievement - a.achievement)
      .slice(0, 6);

    // Time-based performance analysis
    const timeAnalysis = extendedSampleData.sales
      .filter(sale => sale.Year === 2025)
      .reduce((acc, sale) => {
        const day = sale.Day;
        if (!acc[day]) {
          acc[day] = { day, totalSales: 0, totalVisitors: 0, totalInvoices: 0, count: 0 };
        }
        acc[day].totalSales += sale["Sales Amount"];
        acc[day].totalVisitors += sale.Visitors;
        acc[day].totalInvoices += sale.Invoices;
        acc[day].count += 1;
        return acc;
      }, {});

    const dailyTrends = Object.values(timeAnalysis).map((day: any) => ({
      day: day.day,
      avgSales: day.totalSales / day.count,
      avgVisitors: day.totalVisitors / day.count,
      avgInvoices: day.totalInvoices / day.count,
      efficiency: day.totalVisitors > 0 ? day.totalSales / day.totalVisitors : 0
    }));

    return {
      performanceCorrelation,
      topManagers,
      dailyTrends
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <DashboardLayout 
      title="Advanced Analytics" 
      subtitle="Deep insights and correlations across all business metrics"
    >
      {/* Customer Satisfaction & Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <CustomerSatisfaction data={customerSatisfaction} />
        <CategoryBreakdown categories={categories} />
      </div>

      {/* Performance Correlation Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Visitors vs Sales Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart data={analyticsData.performanceCorrelation}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  type="number" 
                  dataKey="visitors" 
                  name="Visitors"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  type="number" 
                  dataKey="sales" 
                  name="Sales"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'sales' ? formatCurrency(value) : value.toLocaleString(),
                    name === 'sales' ? 'Sales' : 'Visitors'
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--dashboard-card))',
                    border: '1px solid hsl(var(--dashboard-border))',
                    borderRadius: '6px'
                  }}
                />
                <Scatter 
                  data={analyticsData.performanceCorrelation} 
                  fill="hsl(var(--chart-primary))"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Manager Performance Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={analyticsData.topManagers.slice(0, 1).map(manager => [
                { subject: 'Target Achievement', value: manager.achievement, fullMark: 150 },
                { subject: 'Conversion Rate', value: manager.conversionRate * 10, fullMark: 150 },
                { subject: 'Sales per Branch', value: (manager.avgSalesPerBranch / 1000000) * 10, fullMark: 150 },
                { subject: 'Total Sales', value: (manager.sales / 10000000) * 10, fullMark: 150 },
                { subject: 'Branch Count', value: manager.branches * 20, fullMark: 150 },
              ]).flat()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 150]} 
                  tick={{ fontSize: 10 }} 
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="hsl(var(--chart-primary))"
                  fill="hsl(var(--chart-primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <div className="text-sm font-medium text-foreground">
                Top Performer: {analyticsData.topManagers[0]?.manager}
              </div>
              <div className="text-xs text-muted-foreground">
                {analyticsData.topManagers[0]?.achievement.toFixed(1)}% target achievement
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Performance Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning" />
              Daily Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analyticsData.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                <XAxis 
                  dataKey="day" 
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
                    name === 'avgSales' ? formatCurrency(value) : value.toLocaleString(),
                    name === 'avgSales' ? 'Avg Sales' : 
                    name === 'avgVisitors' ? 'Avg Visitors' : 'Avg Invoices'
                  ]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--dashboard-card))',
                    border: '1px solid hsl(var(--dashboard-border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgSales" 
                  stroke="hsl(var(--chart-primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 4 }}
                  name="Avg Sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgVisitors" 
                  stroke="hsl(var(--chart-secondary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-secondary))', strokeWidth: 2, r: 3 }}
                  name="Avg Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-success" />
              Top Manager Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topManagers.slice(0, 6).map((manager, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{manager.manager}</div>
                      <div className="text-xs text-muted-foreground">
                        {manager.branches} branches managed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      {manager.achievement.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(manager.sales)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance Matrix */}
      <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-destructive" />
            Regional Performance Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionalData.map((region, index) => (
              <div key={index} className="p-4 border border-dashboard-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">{region.region}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    region.achievement >= 95 ? 'bg-success/20 text-success' :
                    region.achievement >= 85 ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {region.achievement.toFixed(1)}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Branches:</span>
                    <span className="font-medium">{region.branches}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sales:</span>
                    <span className="font-medium">{formatCurrency(region.sales)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium">{formatCurrency(region.target)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg per Branch:</span>
                    <span className="font-medium">
                      {formatCurrency(region.branches > 0 ? region.sales / region.branches : 0)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      region.achievement >= 95 ? 'bg-success' :
                      region.achievement >= 85 ? 'bg-warning' :
                      'bg-destructive'
                    }`}
                    style={{ width: `${Math.min(region.achievement, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Analytics;