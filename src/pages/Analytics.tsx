import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomerSatisfaction } from "@/components/dashboard/CustomerSatisfaction";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { useData } from "@/hooks/useData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend } from 'recharts';
import { BarChart3, Users, TrendingUp, Calendar, Clock, Activity } from "lucide-react";
import { useMemo } from "react";

const Analytics = () => {
  const { data } = useData();
  // Advanced analytics calculations
  const analyticsData = useMemo(() => {
    if (!data) return { performanceCorrelation: [], topManagers: [], dailyTrends: [] };
    // Performance correlation between visitors and sales
    const performanceCorrelation = data.sales
      .filter(sale => sale.YEAR === 2025)
      .map(sale => ({
        visitors: sale.visitors,
        sales: sale["Bill Amount"],
        invoices: sale["No Of Bills"],
        efficiency: sale.visitors > 0 ? sale["Bill Amount"] / sale.visitors : 0,
        outlet: sale["Outlet Name"].replace(/^\d+-/, '')
      }));

    // Manager performance radar data
    const managerPerformance = data.areas.map(area => {
      const managerSales = data.sales
        .filter(sale => sale["Outlet Name"] === area["Outlet Name"] && sale.YEAR === 2025)
        .reduce((sum, sale) => sum + sale["Bill Amount"], 0);
      
      const managerVisitors = data.sales
        .filter(sale => sale["Outlet Name"] === area["Outlet Name"] && sale.YEAR === 2025)
        .reduce((sum, sale) => sum + sale.visitors, 0);
      
      const managerInvoices = data.sales
        .filter(sale => sale["Outlet Name"] === area["Outlet Name"] && sale.YEAR === 2025)
        .reduce((sum, sale) => sum + sale["No Of Bills"], 0);

      const target = data["yearly target"]
        .find(t => t["Outlet Name"] === area["Outlet Name"])?.["Target Amount"] || 0;

      return {
        manager: area["area manager"],
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
    const managerAggregate: Record<string, { manager: string; sales: number; visitors: number; invoices: number; target: number; branches: number }> = {};
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

    const topManagers = (Object.values(managerAggregate) as Array<{ manager: string; sales: number; visitors: number; invoices: number; target: number; branches: number }> )
      .map((manager) => ({
        ...manager,
        achievement: manager.target > 0 ? (manager.sales / manager.target) * 100 : 0,
        avgSalesPerBranch: manager.branches > 0 ? manager.sales / manager.branches : 0,
        conversionRate: manager.visitors > 0 ? (manager.invoices / manager.visitors) * 100 : 0
      }))
      .sort((a, b) => b.achievement - a.achievement)
      .slice(0, 6);

    // Time-based performance analysis
    const timeAnalysis = data.sales
      .filter(sale => sale.YEAR === 2025)
      .reduce((acc, sale) => {
        const day = sale.Day;
        if (!acc[day]) {
          acc[day] = { day, totalSales: 0, totalVisitors: 0, totalInvoices: 0, count: 0 };
        }
        acc[day].totalSales += sale["Bill Amount"];
        acc[day].totalVisitors += sale.visitors;
        acc[day].totalInvoices += sale["No Of Bills"];
        acc[day].count += 1;
        return acc;
      }, {});

    const dailyTrends = Object.values(timeAnalysis).map((day: { day: number; totalSales: number; totalVisitors: number; totalInvoices: number; count: number }) => ({
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
  }, [data]);

  const getRegion = (name: string) => {
    if (name.includes('Riyadh')) return 'Riyadh';
    if (name.includes('Jeddah')) return 'Jeddah';
    if (name.includes('Dammam') || name.includes('Khobar') || name.includes('Dhahran')) return 'Eastern Province';
    if (name.includes('Mecca')) return 'Mecca';
    if (name.includes('Medina')) return 'Medina';
    return 'Other Regions';
  };

  const regionalData = useMemo(() => {
    if (!data) return [] as Array<{ region: string; branches: number; sales: number; target: number; achievement: number }>;
    const map = new Map<string, { branches: Set<string>; sales: number; target: number }>();
    data.areas.forEach(a => {
      const region = getRegion(a["Outlet Name"]);
      if (!map.has(region)) map.set(region, { branches: new Set(), sales: 0, target: 0 });
      map.get(region)!.branches.add(a["Outlet Name"]);
    });
    data.sales.forEach(s => {
      if (s.YEAR === 2025) {
        const region = getRegion(s["Outlet Name"]);
        const entry = map.get(region);
        if (entry) entry.sales += s["Bill Amount"];
      }
    });
    data["yearly target"].forEach(t => {
      const region = getRegion(t["Outlet Name"]);
      const entry = map.get(region);
      if (entry) entry.target += t["Target Amount"];
    });
    return Array.from(map.entries()).map(([region, val]) => ({
      region,
      branches: val.branches.size,
      sales: val.sales,
      target: val.target,
      achievement: val.target > 0 ? (val.sales / val.target) * 100 : 0,
    }));
  }, [data]);

  const categories = useMemo(() => {
    const colors = [
      'hsl(var(--chart-primary))',
      'hsl(var(--chart-secondary))',
      'hsl(var(--chart-tertiary))',
      'hsl(var(--chart-quaternary))',
      'hsl(var(--accent))',
    ];
    const total = regionalData.reduce((s, r) => s + r.sales, 0);
    return regionalData.map((r, i) => ({
      name: r.region,
      percentage: total ? (r.sales / total) * 100 : 0,
      amount: r.sales,
      color: colors[i % colors.length],
    }));
  }, [regionalData]);

  const customerSatisfaction = useMemo(() => {
    if (!data) return { overall: 0, categories: [] as Array<{ name: string; rating: number; percentage: number }> };
    const sales = data.sales.filter(s => s.YEAR === 2025);
    const avgVisitorsRate = sales.reduce((s, v) => s + v["visitors rate"], 0) / sales.length || 0;
    const avgBillRate = sales.reduce((s, v) => s + v["bill rate"], 0) / sales.length || 0;
    const avgSalesRate = sales.reduce((s, v) => s + v["sales rate"], 0) / sales.length || 0;
    const avgConversion = sales.reduce((s, v) => s + (v["No Of Bills"] / (v.visitors || 1)), 0) / sales.length || 0;
    const avgInvoiceValue = sales.reduce((s, v) => s + (v["Bill Amount"] / (v["No Of Bills"] || 1)), 0) / sales.length || 0;
    const toRating = (val: number, max: number) => Math.min(5, Math.max(0, (val / max) * 5));
    const cats = [
      { name: 'Service', rating: toRating(avgConversion, 1), percentage: toRating(avgConversion, 1) * 20 },
      { name: 'Cleanliness and Hygiene', rating: toRating(avgVisitorsRate, 1), percentage: toRating(avgVisitorsRate, 1) * 20 },
      { name: 'Freshness and Quality', rating: toRating(avgBillRate, 300), percentage: toRating(avgBillRate, 300) * 20 },
      { name: 'Affordable', rating: toRating(avgInvoiceValue, 500), percentage: toRating(avgInvoiceValue, 500) * 20 },
      { name: 'Availability and Accessibility', rating: toRating(avgSalesRate, 100), percentage: toRating(avgSalesRate, 100) * 20 },
    ];
    const overall = Math.round((cats.reduce((s, c) => s + c.rating, 0) / cats.length) * 20);
    return { overall, categories: cats };
  }, [data]);

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