import { useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { GaugeChart } from "@/components/dashboard/GaugeChart";
import { BranchDistribution } from "@/components/dashboard/BranchDistribution";
import { CustomerSatisfaction } from "@/components/dashboard/CustomerSatisfaction";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { useData } from "@/hooks/useData";
import type { DashboardData, Sale } from "@/types/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, Users, Target } from "lucide-react";

const Dashboard = () => {
  const { data } = useData();

  // Calculate overall KPIs for all branches
  const kpis = useMemo(() => {
    if (!data) return {
      currentYearSales: 0,
      previousYearSales: 0,
      growthPercentage: 0,
      totalVisitors: 0,
      totalInvoices: 0,
      avgInvoiceValue: 0,
      conversionRate: 0,
      totalBranches: 0,
      avgSalesPerBranch: 0,
      dailyAchievement: 0,
      monthlyAchievement: 0,
      yearlyAchievement: 0,
      totalDailyTarget: 0,
      totalMonthlyTarget: 0,
      totalYearlyTarget: 0,
    };

    const currentYear = 2025;
    const previousYear = 2024;

    const currentYearSales = data.sales
      .filter(sale => sale.YEAR === currentYear)
      .reduce((sum, sale) => sum + sale["Bill Amount"], 0);

    const previousYearSales = data.sales
      .filter(sale => sale.YEAR === previousYear)
      .reduce((sum, sale) => sum + sale["Bill Amount"], 0);
    
    // Growth calculation
    const growthPercentage = previousYearSales > 0 
      ? ((currentYearSales - previousYearSales) / previousYearSales) * 100 
      : 0;
    
    // Visitors and invoices
    const totalVisitors = data.sales
      .filter(sale => sale.YEAR === currentYear)
      .reduce((sum, sale) => sum + sale.visitors, 0);
    
    const totalInvoices = data.sales
      .filter(sale => sale.YEAR === currentYear)
      .reduce((sum, sale) => sum + sale["No Of Bills"], 0);
    
    // Target achievements
    const totalDailyTarget = data["daily target"].reduce(
      (sum, target) => sum + target.target,
      0
    );
    
    const totalMonthlyTarget = data["monthly target"].reduce(
      (sum, target) => sum + target["Target Amount"],
      0
    );
    
    const totalYearlyTarget = data["yearly target"].reduce(
      (sum, target) => sum + target["Target Amount"],
      0
    );
    
    const dailyAchievement = totalDailyTarget > 0 ? (currentYearSales / totalDailyTarget) * 100 : 0;
    const monthlyAchievement = totalMonthlyTarget > 0 ? (currentYearSales / totalMonthlyTarget) * 100 : 0;
    const yearlyAchievement = totalYearlyTarget > 0 ? (currentYearSales / totalYearlyTarget) * 100 : 0;
    
    // Additional metrics
    const avgInvoiceValue = totalInvoices > 0 ? currentYearSales / totalInvoices : 0;
    const conversionRate = totalVisitors > 0 ? (totalInvoices / totalVisitors) * 100 : 0;
    const totalBranches = data.areas.length;
    const avgSalesPerBranch = totalBranches > 0 ? currentYearSales / totalBranches : 0;

    return {
      currentYearSales,
      previousYearSales,
      growthPercentage,
      totalVisitors,
      totalInvoices,
      avgInvoiceValue,
      conversionRate,
      totalBranches,
      avgSalesPerBranch,
      dailyAchievement,
      monthlyAchievement,
      yearlyAchievement,
      totalDailyTarget,
      totalMonthlyTarget,
      totalYearlyTarget
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

  return (
    <DashboardLayout 
      title="Dashboard Overview" 
      subtitle="Complete sales performance summary across all 50 branches"
    >
      {/* Top KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Total Sales (2025)"
          value={kpis.currentYearSales}
          format="currency"
          change={kpis.growthPercentage}
          changeType={kpis.growthPercentage > 0 ? 'increase' : 'decrease'}
        />
        <KPICard
          title="Total Branches"
          value={kpis.totalBranches}
          format="number"
          subtitle="Active outlets"
        />
        <KPICard
          title="Total Visitors"
          value={kpis.totalVisitors}
          format="number"
          subtitle="Current year"
        />
        <KPICard
          title="Total Invoices"
          value={kpis.totalInvoices}
          format="number"
          subtitle="Current year"
        />
      </div>

      {/* Second KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Avg Sales per Branch"
          value={kpis.avgSalesPerBranch}
          format="currency"
          subtitle="Monthly average"
        />
        <KPICard
          title="Avg Invoice Value"
          value={kpis.avgInvoiceValue}
          format="currency"
          subtitle="Per transaction"
        />
        <KPICard
          title="Conversion Rate"
          value={kpis.conversionRate}
          format="percentage"
          subtitle="Invoices / Visitors"
        />
        <KPICard
          title="YoY Growth"
          value={`${kpis.growthPercentage > 0 ? '+' : ''}${kpis.growthPercentage.toFixed(1)}%`}
          change={kpis.growthPercentage}
          changeType={kpis.growthPercentage > 0 ? 'increase' : 'decrease'}
          subtitle="2025 vs 2024"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          {data && (
            <SalesChart
              salesData={data.sales}
              targetData={data["daily target"]}
            />
          )}
        </div>
        {data && <CustomerSatisfaction data={customerSatisfaction} />}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GaugeChart
          title="Daily Target Achievement"
          percentage={kpis.dailyAchievement}
          value={kpis.currentYearSales}
          target={kpis.totalDailyTarget}
        />
        <GaugeChart
          title="Monthly Target Achievement"
          percentage={kpis.monthlyAchievement}
          value={kpis.currentYearSales}
          target={kpis.totalMonthlyTarget}
        />
        <GaugeChart
          title="Yearly Target Achievement"
          percentage={kpis.yearlyAchievement}
          value={kpis.currentYearSales}
          target={kpis.totalYearlyTarget}
        />
      </div>

      {/* Regional Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card className="transition-all duration-300 hover:shadow-lg border-dashboard-border bg-dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{region.region}</div>
                    <div className="text-sm text-muted-foreground">{region.branches} branches</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      {region.achievement.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Achievement
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'SAR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(region.sales)}
                    </div>
                    <div className="text-xs text-muted-foreground">Sales</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {data && <CategoryBreakdown categories={categories} />}
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data && (
          <>
            <BranchDistribution salesData={data.sales} year={2025} />
            <BranchDistribution salesData={data.sales} year={2024} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;